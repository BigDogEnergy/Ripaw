from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import Account, Transaction,  db
from ..forms import NewAccountForm, TransactionForm, UpdateTransactionForm, UpdateAccountForm
from decimal import Decimal
from sqlalchemy import or_
from datetime import datetime

account_routes = Blueprint('accounts', __name__)

# Retrieve all accounts for a user
@account_routes.route('')
@login_required
def get_accounts():
    accounts = Account.query.filter_by(userId=current_user.id, status='Open').all()
    return jsonify({'accounts': [account.to_dict() for account in accounts]}), 200


# Retrieve details for a specific account  
@account_routes.route('/<int:id>', methods=['GET'])
@login_required
def single_account(id):
    account = Account.query.get(id)
    if account:
        return jsonify(account.to_dict()), 200
    else:
        return jsonify({'error': 'Account not found'}), 404

# Create an account for the signed in user
@account_routes.route('', methods=['POST'])
@login_required
def create_account():

    if request.is_json:
        data = request.get_json()
        form = NewAccountForm(data=data)
    else:
        form = NewAccountForm()

    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        account = Account(
            accountName=data['accountName'],
            userId=current_user.id
        )
        db.session.add(account)
        db.session.commit()
        return jsonify(account.to_dict()), 201
    else:
        return jsonify({'error': 'Invalid form data', 'form_errors': form.errors}), 400

# Update an account for the signed in user
@account_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_account(id):
    targetAccount = Account.query.get(id)
    if targetAccount is None:
        return jsonify({'error': 'Account not found'}), 404

    if targetAccount.userId != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    if targetAccount.status != 'Open':
        return jsonify({'error': 'Account is not open'}), 400

    data = request.get_json()
    form = UpdateAccountForm(data=data)
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        if 'accountName' in data:
            targetAccount.accountName = data['accountName']

        if 'status' in data:
            targetAccount.status = data['status']

        db.session.commit()
        return jsonify(targetAccount.to_dict()), 200
    else:
        return jsonify({'error': 'Invalid form data', 'form_errors': form.errors}), 400



# Delete an account (ADMIN Only)
@account_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_account(id):
    targetAccount = Account.query.get(id)
    if targetAccount and targetAccount.userId == current_user.id:
        db.session.delete(targetAccount)
        db.session.commit()
        return jsonify({'message': 'Account successfully deleted'}), 200 
    else:
        return jsonify({'error': 'Account not found'}), 404

#Get all transactions for the current user
@account_routes.route('/transactions')
@login_required
def get_transactions():
    # Get all account IDs for the current user
    user_accounts = Account.query.filter(Account.userId == current_user.id).all()
    user_account_ids = [account.id for account in user_accounts]

    # Get all transactions where the current user is either the sender or the receiver
    transactions = Transaction.query.filter(
        or_(
            Transaction.senderId.in_(user_account_ids),
            Transaction.receiverId.in_(user_account_ids)
        )
    ).all()

    if transactions:
        return jsonify({"transactions": [transaction.to_dict() for transaction in transactions]}), 200
    else:
        return jsonify({'error': 'No transactions found'}), 404

#Get transactions for a specific account
@account_routes.route('/<int:account_id>/transactions')
@login_required
def get_account_transactions(account_id):
    account = Account.query.filter_by(id=account_id, userId=current_user.id).first()
    if not account:
        return jsonify({'error': 'Unauthorized'}), 403
    
    transactions = Transaction.query.filter(
        or_(
            Transaction.senderId == account_id,
            Transaction.receiverId == account_id
        )
    ).all()

    if transactions:
        return jsonify({"transactions": [transaction.to_dict() for transaction in transactions]}), 200
    else:
        return jsonify({'error': 'No transactions found'})
        

# Get a specific Transaction based on ID
@account_routes.route('/transactions/<int:id>')
@login_required
def single_transaction(id):
    transaction = Transaction.query.get(id)

    # Validation / Error Handling
    if transaction and (transaction.senderId == current_user.id or transaction.receiverId == current_user.id):
        return jsonify({'message': 'Transaction retrieved successfully', 'data': transaction.to_dict()}), 200
    elif transaction:
        return jsonify({'error': 'Unauthorized'}), 403
    else:
        return jsonify({'error': 'Transaction not found'}), 404

#Create and Process a new transaction    
@account_routes.route('/transactions', methods=['POST'])
@login_required
def create_transaction():
    form = TransactionForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():

        sender_account = Account.query.filter_by(id=form.senderId.data, userId=current_user.id).first()
        if sender_account is None:
            return jsonify({'error': 'Unauthorized'}), 403
        if sender_account.status == 'Closed':
            return jsonify({'error': 'Transactions can not be processed for closed accounts.'})

        receiver_account = Account.query.get(form.receiverId.data)
        if receiver_account is None:
            return jsonify({'error': 'Receiver account not found'}), 404
        if receiver_account.status == 'Closed':
            return jsonify({'error': 'Transactions can not be processed for closed accounts.'})

        if sender_account.accountBalance < form.amount.data:
            return jsonify({'error': 'Insufficient funds'}), 400

        status = form.data.get('status')
        if status not in ['Pending', 'Processing']:
            return jsonify({'error': 'Invalid transaction status'}), 400
        if status == 'Processing':
            amount = Decimal(form.amount.data)
            sender_account.accountBalance -= amount
            receiver_account.accountBalance += amount
            status = 'Completed'
            completedAt = datetime.now()
            transaction = Transaction(
                senderId=sender_account.id,
                receiverId=receiver_account.id,
                amount=form.amount.data,
                message=form.message.data if 'message' in form.data and form.message.data else None,
                status=status,
                completed_at=completedAt,
                senderBalance=sender_account.accountBalance,
                receiverBalance=receiver_account.accountBalance
            )
        else:
            transaction = Transaction(
                senderId=sender_account.id,
                receiverId=receiver_account.id,
                amount=form.amount.data,
                message=form.message.data if 'message' in form.data and form.message.data else None,
                status=status,
            )

        db.session.add(transaction)
        db.session.commit()
        return jsonify({'message': 'Transaction created successfully', 'data': transaction.to_dict()}), 201

    else:
        return jsonify({'error': 'Invalid transaction data', 'errors': form.errors}), 400

#Update a PENDING Transaction
@account_routes.route('/transactions/<int:id>', methods=['PUT'])
@login_required
def update_transaction(id):

    #Transaction Error Handling / Validation
    transaction = Transaction.query.get(id)
    if transaction is None:
        return jsonify({'error': 'Transaction not found'}), 404
    
    sender_account = Account.query.get(transaction.senderId)
    if sender_account.userId != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    if transaction.status != 'Pending':
        return jsonify({'error': 'Only pending transactions can be updated'}), 400
    
    #Account Error Handling / Validation
    receiver_account = Account.query.get(transaction.receiverId)    
    if not sender_account or not receiver_account:
        return jsonify({'error': 'Invalid sender or receiver account'}), 404
    if sender_account.status == 'Closed' or receiver_account.status == 'Closed':
        return jsonify({'error': 'Transactions can not be processed for closed accounts.'}), 400

    # Update the transaction
    form = UpdateTransactionForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():

        if 'message' in form.data:
            transaction.message = form.message.data
        if 'status' in form.data and form.status.data in ['Pending', 'Processing', 'Cancelled']:
            transaction.status = form.status.data
            if form.status.data == 'Processing':
                    if sender_account.accountBalance >= transaction.amount:
                        amount = Decimal(transaction.amount)
                        sender_account.accountBalance -= amount
                        receiver_account.accountBalance += amount
                        transaction.status = 'Completed'
                        transaction.senderBalance = sender_account.accountBalance
                        transaction.receiverBalance = receiver_account.accountBalance
                        transaction.completed_at = datetime.now()
                    else:
                        return jsonify({'error': 'Insufficient funds'}), 400
        else:
            return jsonify({'error': 'Invalid status update'}), 400

        db.session.commit()
        return jsonify({'message': 'Transaction updated successfully', 'data': transaction.to_dict()}), 200
    else:
        return jsonify({'error': 'Invalid transaction data'}), 400

# Delete a Transaction (Admin Only)
@account_routes.route('/transactions/<int:id>', methods=['DELETE'])
@login_required
def delete_transaction(id):
   transaction = Transaction.query.get(id)

   # Validation / Error Handling
   if transaction is None:
    return jsonify({'error': 'Transaction not found'}), 404
   if current_user.type == 'Admin':
    db.session.delete(transaction)
    db.session.commit()
    return jsonify({'message': 'Transaction deleted successfully'}), 200
   else:
    return jsonify({'error': 'Unauthorized'}), 403
from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import Account, Transaction,  db
from ..forms import NewAccountForm, TransactionForm, UpdateTransactionForm
from decimal import Decimal
from sqlalchemy import or_, and_

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
    form = NewAccountForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        account = Account(
            accountName=form.accountName.data,
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

    form = NewAccountForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        targetAccount.accountName = form.accountName.data
        if form.status.data:
            targetAccount.status = form.status.data
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

# Get all Transactions associated with current Logged In User
@account_routes.route('/transactions')
@login_required
def get_transactions():
    transactions = Transaction.query.filter(
        and_(
            or_(
                Transaction.senderId == current_user.id,
                Transaction.receiverId == current_user.id
            )        )
    ).all()

    if transactions:
        return jsonify([transaction.to_dict() for transaction in transactions]), 200
    else:
        return jsonify({'error': 'No transactions found'})

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
        return jsonify([transaction.to_dict() for transaction in transactions]), 200
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
        receiver_account = Account.query.get(form.receiverId.data)

        # Validation / Error Handling
        if sender_account is None:
            return jsonify({'error': 'Unauthorized'}), 404
        if receiver_account is None:
            return jsonify({'error': 'Receiver account not found'}), 404
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

        transaction = Transaction(
            senderId=sender_account.id,
            receiverId=receiver_account.id,
            amount=form.amount.data,
            message=form.message.data if 'message' in form.data and form.message.data else None,
            status=status
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
    transaction = Transaction.query.get(id)
    sender_account = Account.query.get(transaction.senderId)
    receiver_account = Account.query.get(transaction.receiverId)

    # Validation / Error Handling
    if transaction is None:
        return jsonify({'error': 'Transaction not found'}), 404
    if transaction.senderId != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    if transaction.status != 'Pending':
        return jsonify({'error': 'Only pending transactions can be updated'}), 400
    if not sender_account or not receiver_account:
        return jsonify({'error': 'Invalid sender or receiver account'}), 404
    
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
                    else:
                        return jsonify({'error': 'Insufficient funds'}), 400
        else:
            return jsonify({'error': 'Invalid status update'}), 400

        db.session.commit()
        return jsonify({'message': 'Transaction updated successfully', 'data': transaction.to_dict()}), 200
    else:
        return jsonify({'error': 'Invalid transaction data', 'error': form.errors}), 400

# Delete a PENDING Transaction (Admin Only)
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
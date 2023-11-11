from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from sqlalchemy import or_
from app.models import Transaction, db, Account
from ..forms import TransactionForm, UpdateTransactionForm
from decimal import Decimal

transaction_routes = Blueprint('transactions', __name__)

# Get all Transactions associated with current Logged In User
@transaction_routes.route('/')
@login_required
def get_transactions():
    transactions = Transaction.query.filter(
        or_(
            Transaction.senderId == current_user.id,
            Transaction.receiverId == current_user.id
        )
    ).all()

    transactions_list = [transaction.to_dict() for transaction in transactions]
    return jsonify(transactions_list), 200

# Get a specific Transaction based on ID
@transaction_routes.route('/<int:id>')
@login_required
def single_transaction(id):
    transaction = Transaction.query.get(id)

    # Validation / Error Handling
    if transaction and (transaction.senderId == current_user.id or transaction.receiverId == current_user.id):
        return jsonify(transaction.to_dict()), 200
    elif transaction:
        return jsonify({'error': 'Unauthorized'}), 403
    else:
        return jsonify({'error': 'Transaction not found'}), 404

# Create and Process a new Transaction
@transaction_routes.route('/', methods=['POST'])
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
        return jsonify(transaction.to_dict()), 201
    
    else:
        return jsonify({'error': 'Invalid transaction data', 'form_errors': form.errors}), 400
    
# Update a PENDING Transaction
@transaction_routes.route('/<int:id>', methods=['PUT'])
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
        return jsonify(transaction.to_dict()), 200
    else:
        return jsonify({'error': 'Invalid transaction data', 'form_errors': form.errors}), 400

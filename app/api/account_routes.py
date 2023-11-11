from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import Account, db
from ..forms import NewAccountForm

account_routes = Blueprint('accounts', __name__)

# Retrieve all accounts for a user
@account_routes.route('/')
@login_required
def get_accounts():
    accounts = Account.query.filter_by(userId=current_user.id).all()
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
@account_routes.route('/', methods=['POST'])
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
    if targetAccount and targetAccount.userId == current_user.id:
        form = NewAccountForm()
        form['csrf_token'].data = request.cookies['csrf_token']
        if form.validate_on_submit():
            targetAccount.accountName = form.accountName.data
            db.session.commit()
            return jsonify(targetAccount.to_dict()), 200
        else:
            return jsonify({'error': 'Invalid form data', 'form_errors': form.errors}), 400
    else:
        return jsonify({'error': 'Account not found or not owned by current user'}), 404

# Delete an account
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

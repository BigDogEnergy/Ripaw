from flask import Blueprint, jsonify, session, request
from app.models import Account, db
from flask_login import current_user, login_required
from ..forms import newAccountForm
account_routes = Blueprint('accounts', __name__)

# Retreieve all accounts for a user
@account_routes.route('/')
@login_required
def get_accounts():
    accounts = Account.query.filter_by(userId=current_user.id)
    return {'accounts': [account.to_dict() for account in accounts]}, 200

# Retrieve details for a specific account
@account_routes.route('/<int:id>', methods=['GET'])
@login_required
def single_account(id):
    account = Account.query.get(id)
    if account:
        return account.to_dict(), 200
    
# Create an account for the signed in user
@account_routes.route('/', methods=['POST'])
@login_required
def create_account():
    form = newAccountForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        account = Account()
        form.populate_obj(account)
        
        if current_user.id:
            account.userId = current_user.id
            db.session.add(account)
            db.session.commit()
            return account.to_dict(), 201
        else:
            return jsonify({'error': 'No valid user logged in'}), 400
    else:
        return jsonify({'error': 'Invalid form data', 'form_errors': form.errors}), 400

from flask import Blueprint, jsonify, session, request
from app.models import Account, db
from flask_login import current_user, login_required
from ..forms import newAccountForm
account_routes = Blueprint('accounts', __name__)

# Retreieve all accounts for a user
@account_routes.route('/')
@login_required
def get_accounts():
    accounts = Account.query.filter_by(userId=current_user.id)
    return {'accounts': [account.to_dict() for account in accounts]}, 200

# Retrieve details for a specific account
@account_routes.route('/<int:id>', methods=['GET'])
@login_required
def single_account(id):
    account = Account.query.get(id)
    if account:
        return account.to_dict(), 200
    
# Create an account for the signed in user
@account_routes.route('/', methods=['POST'])
@login_required
def create_account():
    form = newAccountForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        account = Account()
        form.populate_obj(account)
        
        if current_user.id:
            account.userId = current_user.id
            db.session.add(account)
            db.session.commit()
            return account.to_dict(), 201
        else:
            return jsonify({'error': 'No valid user logged in'}), 400
    else:
        return jsonify({'error': 'Invalid form data', 'form_errors': form.errors}), 400

# Update an account for the signed in user
@account_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_account(id):
    targetAccount = Account.query.get(id)
    if targetAccount and targetAccount.userId == current_user.id:
        form = newAccountForm()
        form['csrf_token'].data = request.cookies['csrf_token']
        if form.validate_on_submit():
            form.populate_obj(targetAccount)
            db.session.commit()
            return targetAccount.to_dict(), 201
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
        return {
            'message': 'Account successfully deleted',
            'Status code': 302
        }, 302
    else:
        return {
            'errors': 'Account not found',
            'Status code': 404
        }, 404



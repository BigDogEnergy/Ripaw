from flask import Blueprint, jsonify, session, request
from app.models import Account, db
from flask_login import current_user, login_required

account_routes = Blueprint('account', __name__)



# Retrieve details for a specific account
@account_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_account():
    account = Account.query.get(id)
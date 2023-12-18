from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import Message, db

message_routes = Blueprint('messages', __name__)

# NOTE - FETCH ALL messages received for a specific user 
@message_routes.route('/<int:user_id>')
@login_required
def get_messages(user_id):
    if current_user.id==user_id:
        messages = Message.query.filter_by(receiver_id=user_id).all()
        if messages:
            return jsonify([message.to_dict() for message in messages]), 200
        else:
            return jsonify({'error': 'No messages found'}), 404
    else:
        return jsonify({'error': 'Unauthorized'})

# NOTE - FETCH messages received from a specific user
@message_routes.route('/<int:user_id>/<int:sender_id>')
@login_required
def get_conversation(user_id, sender_id):
    messages = Message.query.filter_by(receiver_id=user_id, sender_id=sender_id).all()
    if messages:
        return jsonify([message.to_dict() for message in messages]), 200
    else:
        return jsonify({'error': 'No conversation found'}), 404
    
# # NOTE - DELETE
@message_routes.route('/<int:message_id>')
@login_required
def delete_message(message_id):
    message = Message.query.get(int(message_id))
    if message:
        if message.sender_id == current_user.id or message.receiver_id == current_user.id:
            db.session.delete(message)
            db.session.commit()
            return jsonify({'message': 'Message deleted'}), 200
        else:
            return jsonify({'error': 'Unauthorized'}), 403

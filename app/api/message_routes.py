from flask import Blueprint, jsonify, request
from sqlalchemy import or_
from flask_login import login_required, current_user
from app.models import Message, db

message_routes = Blueprint('messages', __name__)

# NOTE - FETCH ALL messages received for a specific user 
@message_routes.route('/<int:user_id>')
@login_required
def get_messages(user_id):
    if current_user.id == user_id:
        messages = Message.query.filter(
            or_(
                Message.receiver_id == user_id,
                Message.sender_id == user_id
            )
        ).all()

        if messages:
            return jsonify([message.to_dict() for message in messages]), 200
        else:
            return jsonify({'error': 'No messages found'}), 404
    else:
        return jsonify({'error': 'Unauthorized'})

# NOTE - FETCH messages received from a specific user
@message_routes.route('/<int:user_id>/<int:target_id>')
@login_required
def get_conversation(user_id, target_id):
    messages = Message.query.filter(
        or_(
            (Message.receiver_id == user_id) & (Message.sender_id == target_id),
            (Message.receiver_id == target_id) & (Message.sender_id == user_id)
        )
    ).all()

    if messages:
        return jsonify([message.to_dict() for message in messages]), 200
    else:
        return jsonify({'error': 'No conversation found'}), 404

# NOTE - EDIT a messaged owned by the user
@message_routes.route('/<int:message_id>', methods=['PUT'])
@login_required
def edit_message(message_id):
    message = Message.query.get(int(message_id))

    if not message:
        return jsonify({'error': 'Message not found'}), 404

    if message.sender_id == current_user.id:
        data = request.get_json()
        new_content = data.get('content')

        if new_content is None:
            return jsonify({'error': 'No content provided'}), 400

        message.content = new_content
        db.session.commit()
        return jsonify({'message': 'Message updated', 'content': new_content}), 200
    
    else:
        return jsonify({'error': 'Unauthorized'}), 403

    
# NOTE - DELETE
@message_routes.route('/<int:message_id>', methods=['DELETE'])
@login_required
def delete_message(message_id):
    message = Message.query.get(int(message_id))

    if not message:
        return jsonify({'error': 'Message not found'}), 404
    
    if message.sender_id == current_user.id or message.receiver_id == current_user.id:
        db.session.delete(message)
        db.session.commit()
        return jsonify({'message': 'Message deleted'}), 200
    
    else:
        return jsonify({'error': 'Unauthorized'}), 403

from app.models.db import db
from app.models.messages import Message
from flask_socketio import SocketIO, emit, join_room
from flask_login import current_user, login_required, AnonymousUserMixin
from app import socketio

@socketio.on('connect')
def on_connect():
    print("Connection Established")

@socketio.on('join_room')
def handle_join_room(data):
    user_id = data.get('user_id')
    if user_id:
        join_room(user_id)
        print(f"User {user_id} has connected and joined their room.")

@socketio.on('message')
def handle_message(data):
    if 'content' in data and 'sender_id' in data and 'receiver_id' in data: 
        new_message = Message(
            content=data['content'], 
            sender_id=data['sender_id'],
            receiver_id=data['receiver_id'],
            )
        db.session.add(new_message)
        db.session.commit()
        emit('new_message', new_message.to_dict(), room=data['receiver_id'])
        emit('new_message', new_message.to_dict(), room=data['sender_id'])
        print(f"Message - Content: " + data['content'])
    else:
        print("Message Error - Invalid message data received")

# @socketio.on('edit_message')
# def edit_text(data):
#     if 'content' in data and 'id' in data: 
#         message_id = data['id']
#         new_content = data['content']
#         message = Message.query.get(data['id'])
#         if message:
#             message.content = new_content
#             db.session.commit()
#             updated_data = {
#                 'id': message.id, 
#                 'content': new_content
#             }
#             emit('message_updated', updated_data, room=message.receiver_id)
#             emit('message_updated', updated_data, room=message.sender_id)
#             print(f"Edit Message - Message with id {message.id} updated")

#         else:
#             print(f"Updated Failed - Message with id {message.id} not found")

@socketio.on('delete_message')
def deletion_request(data):
    print("Attempting Delete")
    if 'id' in data:
        message_id = data['id']
        message = Message.query.get(message_id)

        if message:
            emit('delete_message', message.to_dict(), room=message.receiver_id)
            emit('delete_message', message.to_dict(), room=message.sender_id)
            db.session.delete(message)
            db.session.commit()

            print(f"Delete Message - Message with id {message_id} deleted")
        # else:
        #     print(f"Delete Failed - Unauthorized user for message id {message.id}")
        else:
            print(f"Delete Failed - Message with id {message_id} not found")
    else:
        print("Delete Message Error - No message ID provided")

@socketio.on('disconnect')
def on_disconnect():
    if current_user.is_authenticated:
        print(f"User {current_user.id} has disconnected.")
    else:
        print("Anonymous user has disconnected.")

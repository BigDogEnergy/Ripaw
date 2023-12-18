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
    # if current_user.is_authenticated:
        if 'content' in data and 'sender_id' in data and 'receiver_id' in data: 
            new_message = Message(
                content=data['content'], 
                sender_id=data['sender_id'],
                receiver_id=data['receiver_id'],
                )
            db.session.add(new_message)
            db.session.commit()
            print(f"Inbound Message - Room {data['receiver_id']} - Content: " + data['content'])
            emit('new_message', data['content'], room=data['receiver_id'])
        else:
            print("Invalid message data received")

@socketio.on('disconnect')
def on_disconnect():
    if current_user.is_authenticated:
        print(f"User {current_user.id} has disconnected.")
    else:
        print("Anonymous user has disconnected.")

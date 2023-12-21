from app.models import db, Message, User, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime, timedelta
import random

def generate_lorem_ipsum():
    lorem_ipsum = (
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor "
        "incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud "
        "exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute "
        "irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
    )
    message_length = random.randint(3, 25) 
    return lorem_ipsum[:message_length]

def seed_messages():
    additional_messages = []
    user_ids = [user.id for user in User.query.all()]
    
    for _ in range(500):  
        sender_id = random.choice(user_ids)
        receiver_id = random.choice(user_ids)
        
        # Ensure sender and receiver are not the same
        while sender_id == receiver_id:
            receiver_id = random.choice(user_ids)

        content = generate_lorem_ipsum()
        created_at = datetime.utcnow() - timedelta(days=random.randint(1, 30))

        message = Message(
            sender_id=sender_id,
            receiver_id=receiver_id,
            content=content,
            created_at=created_at
        )

        additional_messages.append(message)

    db.session.add_all(additional_messages)
    db.session.commit()

def undo_messages():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.messages RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM messages"))
    db.session.commit()

from app.models import db, Transaction, environment, SCHEMA, Account
from sqlalchemy.sql import text
from decimal import Decimal
from datetime import datetime, timedelta
import random

def generate_lorem_ipsum():
    lorem_ipsum = (
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor "
        "incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud "
        "exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute "
        "irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
    )
    message_length = random.randint(20, 190) 
    return lorem_ipsum[:message_length]

def seed_transactions():
    additional_transactions = []

    for i in range(1, 61):
        sender_id = random.randint(1, 9)
        receiver_id = random.randint(1, 9)
        
        while sender_id == receiver_id:
            receiver_id = random.randint(1, 9)

        amount = Decimal(random.uniform(0.01, 100.00)).quantize(Decimal('0.01'))
        status = 'Completed'
        include_message = random.choice([True, False])

        message = generate_lorem_ipsum() if include_message else None

        if status == 'Completed':
            created_at = datetime.now() - timedelta(days=random.randint(1, 60))
            completed_at = created_at + timedelta(days=random.randint(1, 5))
            transaction = Transaction(senderId=sender_id, 
                                      receiverId=receiver_id, 
                                      amount=amount,
                                      status=status,
                                      created_at=created_at,
                                      completed_at=completed_at,
                                      message=message)
        else:
            transaction = Transaction(senderId=sender_id, 
                                      receiverId=receiver_id, 
                                      amount=amount,
                                      status=status,
                                      message=message)

        additional_transactions.append(transaction)

    db.session.add_all(additional_transactions)
    db.session.commit()

def undo_transactions():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.transactions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM transactions"))
    db.session.commit()

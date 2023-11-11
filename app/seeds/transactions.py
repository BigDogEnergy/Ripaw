from app.models import db, Transaction, environment, SCHEMA
from sqlalchemy.sql import text
from decimal import Decimal

def seed_transactions():

    transaction1 = Transaction(senderId=1, 
                               receiverId=2, 
                               amount=Decimal('3.82'),
                               status='Completed')
    transaction2 = Transaction(senderId=1,
                               receiverId=3,
                               amount=Decimal('5'),
                               status='Completed')
    transaction3 = Transaction(senderId=1,
                               receiverId=3,
                               amount=Decimal('7.49'),
                               status='Completed')
    transaction4 = Transaction(senderId=3,
                               receiverId=2,
                               amount=Decimal('1.99'),
                               status='Completed')


    db.session.add_all([transaction1,  transaction2, transaction3, transaction4])
    db.session.commit()

def undo_transactions():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.transactions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM transactions"))
    db.session.commit()

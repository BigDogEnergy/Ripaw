from app.models import db, Transaction, environment, SCHEMA
from sqlalchemy.sql import text
from decimal import Decimal
from datetime import datetime, timedelta

def seed_transactions():

    transaction1 = Transaction(senderId=1, 
                               receiverId=2, 
                               amount=Decimal('3.82'),
                               status='Pending')
    transaction2 = Transaction(senderId=1,
                               receiverId=3,
                               amount=Decimal('5'),
                               status='Pending')
    transaction3 = Transaction(senderId=1,
                               receiverId=3,
                               amount=Decimal('7.49'),
                               status='Pending')
    transaction4 = Transaction(senderId=3,
                               receiverId=2,
                               amount=Decimal('1.99'),
                               status='Pending')
    transaction5 = Transaction(senderId=2, 
                               receiverId=1, 
                               amount=Decimal('10.00'),
                               status='Pending')
    transaction6 = Transaction(senderId=2,
                               receiverId=3,
                               amount=Decimal('20.50'),
                               status='Pending')
    transaction7 = Transaction(senderId=3,
                               receiverId=1,
                               amount=Decimal('15.75'),
                               status='Pending')
    transaction8 = Transaction(senderId=3,
                               receiverId=2,
                               amount=Decimal('5.25'),
                               status='Pending')
    transaction9 = Transaction(senderId=1,
                               receiverId=2,
                               amount=Decimal('50.00'),
                               status='Pending')
    transaction10 = Transaction(senderId=2,
                                receiverId=3,
                                amount=Decimal('30.00'),
                                status='Pending')
    completed_transaction1 = Transaction(senderId=1, 
                                         receiverId=2, 
                                         amount=Decimal('8.99'),
                                         status='Completed',
                                         createdAt=datetime.now() - timedelta(days=10),
                                         completedAt=datetime.now() - timedelta(days=9))
    completed_transaction2 = Transaction(senderId=2,
                                         receiverId=1,
                                         amount=Decimal('12.50'),
                                         status='Completed',
                                         createdAt=datetime.now() - timedelta(days=20),
                                         completedAt=datetime.now() - timedelta(days=18))
    completed_transaction3 = Transaction(senderId=3,
                                         receiverId=2,
                                         amount=Decimal('23.75'),
                                         status='Completed',
                                         createdAt=datetime.now() - timedelta(days=30),
                                         completedAt=datetime.now() - timedelta(days=28))

    db.session.add_all([transaction1,  transaction2, transaction3, transaction4,
                        transaction5, transaction6, transaction7, transaction8, 
                        transaction9, transaction10, completed_transaction1, completed_transaction2, 
                        completed_transaction3])
    db.session.commit()

def undo_transactions():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.transactions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM transactions"))
    db.session.commit()

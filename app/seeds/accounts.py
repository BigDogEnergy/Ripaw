from app.models import db, Account, environment, SCHEMA
from decimal import Decimal

def seed_accounts():
    account1 = Account(accountName="Checking",
                       status='Open',
                       accountBalance=Decimal('150.47'),
                       userId=1)
    account2 = Account(accountName="Beau's Acorn Collection",
                       status='Open',
                       accountBalance=Decimal('999.99'),
                       userId=1)
    account3 = Account(accountName="Savings",
                       status='Open',
                       accountBalance=Decimal('3.21'),
                       userId=1)
    account4 = Account(accountName="Checking",
                       status='Open',
                       accountBalance=Decimal('143.00'),
                       userId=2)
    account5 = Account(accountName="Stray Backyard Cats College Fund",
                       status='Open',
                       accountBalance=Decimal('0.01'),
                       userId=2)
    account6 = Account(accountName="Savings",
                       status='Open',
                       accountBalance=Decimal('500.91'),
                       userId=2)
    account7 = Account(accountName="Checking",
                       status='Open',
                       accountBalance=Decimal('15.00'),
                       userId=3)
    account8 = Account(accountName="Vacation Fund",
                       status='Open',
                       accountBalance=Decimal('0.00'),
                       userId=3)
    account9 = Account(accountName="Savings",
                       status='Open',
                       accountBalance=Decimal('0.00'),
                       userId=3)

    

    db.session.add_all([account1, account2, account3, account4, account5, account6, account7, account8, account9])


    db.session.commit()

def undo_accounts():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.accounts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM accounts")
    db.session.commit()

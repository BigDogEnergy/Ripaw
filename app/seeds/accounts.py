from app.models import db, Account, environment, SCHEMA

def seed_accounts():
    account1 = Account(accountName="Checking",
                   accountBalance=150.47,
                   userId=1)
    account2 = Account(accountName="My Dog's Acorn Collection",
                       accountBalance=999.99,
                       userId=2)
    account3 = Account(accountName="Savings",
                       accountBalance=3.21,
                       userId=1)

    

    db.session.add_all([account1, account2, account3])


    db.session.commit()

def undo_accounts():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.accounts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM accounts")
    db.session.commit()

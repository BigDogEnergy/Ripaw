from app.models import db, Account, environment, SCHEMA

def seed_accounts():
    account1 = Account(accountName="Test",
                   accountBalance=150.47,
                   userId=1)
    account2 = Account(accountName="My Dog's Acorn Collection",
                       accountBalance=999.99,
                       userId=2)

    

    db.session.add_all([account1, account2])


    db.session.commit()

def undo_accounts():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.accounts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM accounts")
    db.session.commit()

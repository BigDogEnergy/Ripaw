from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    
    users = [
        User(username='Demo', email='demo@aa.io', password='password', type='Admin'),
        User(username='Beau', email='beau@aa.io', password='password'),
        User(username='David', email='david@aa.io', password='password'),
        User(username='Amber', email='amber@aa.io', password='password'),
        User(username='User5', email='user5@example.com', password='password'),
        User(username='User6', email='user6@example.com', password='password'),
        User(username='User7', email='user7@example.com', password='password'),
        User(username='User8', email='user8@example.com', password='password'),
        User(username='User9', email='user9@example.com', password='password'),
        User(username='User10', email='user10@example.com', password='password'),
    ]

    db.session.add_all(users)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))
        
    db.session.commit()

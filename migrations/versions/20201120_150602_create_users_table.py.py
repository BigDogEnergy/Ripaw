"""create_users_table
Revision ID: ffdc0a98111c
Revises:
Create Date: 2020-11-20 15:06:02.230689
"""
from alembic import op
import sqlalchemy as sa

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")


# revision identifiers, used by Alembic.
revision = 'ffdc0a98111c'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=40), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('hashed_password', sa.String(length=255), nullable=False),
    sa.Column('type', sa.String(length=40), default='Standard User'),
    sa.Column('profile_pic', sa.String(length=40)),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )

    if environment == "production":
        op.execute(f"ALTER TABLE users SET SCHEMA {SCHEMA};")

    op.create_table('messages',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('sender_id', sa.Integer(),  nullable=False),
    sa.Column('receiver_id', sa.Integer(),  nullable=False),
    sa.Column('content', sa.String(length=255), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.ForeignKeyConstraint(['sender_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['receiver_id'], ['users.id'], ),
    )

    if environment == "production":
        op.execute(f"ALTER TABLE messages SET SCHEMA {SCHEMA};")

    op.create_table('accounts',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('status', sa.String(), nullable=False),
    sa.Column('accountName', sa.String(length=40), nullable=False),
    sa.Column('accountBalance', sa.Float()),
    sa.Column('userId', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.ForeignKeyConstraint(['userId'], ['users.id'], ),
    )

    if environment == "production":
        op.execute(f"ALTER TABLE accounts SET SCHEMA {SCHEMA};")


    op.create_table('transactions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('senderId', sa.Integer(), nullable=False),
    sa.Column('receiverId', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime()),
    sa.Column('completed_at', sa.DateTime()),
    sa.Column('amount', sa.Float(), nullable=False),
    sa.Column('status', sa.String(), nullable=False),
    sa.Column('message', sa.String(200)),
    sa.Column('senderBalance', sa.Float()),
    sa.Column('receiverBalance', sa.Float()),
    sa.PrimaryKeyConstraint('id'),
    sa.ForeignKeyConstraint(['senderId'], ['users.id']),
    )

    if environment == "production":
        op.execute(f"ALTER TABLE transactions SET SCHEMA {SCHEMA};")



def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('transactions')
    op.drop_table('messages')
    # op.drop_table('conversations')
    op.drop_table('users'),
    op.drop_table('accounts')
    # ### end Alembic commands ###
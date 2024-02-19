from decimal import Decimal
from .db import db, environment, SCHEMA, add_prefix_for_prod

class Account(db.Model):
    __tablename__ = 'accounts'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer(), primary_key=True)
    status = db.Column(db.String, default='Open')
    accountName = db.Column(db.String(40), nullable=False)
    accountBalance = db.Column(db.Numeric(scale=2), default=Decimal('1000.00'))
    userId = db.Column(db.Integer(), db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)

    user = db.relationship('User', backref=db.backref('accounts'))

    def to_dict(self):
        return {
            "id": self.id,
            "status": self.status,
            "accountName": self.accountName,
            "accountBalance": self.accountBalance,
            "userId": self.userId
        }

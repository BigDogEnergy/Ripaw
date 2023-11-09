from .db import db, environment, SCHEMA, add_prefix_for_prod

class Account(db.Model):
    __tablename__ = 'accounts'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer(), primary_key=True)
    accountName = db.Column(db.String(40), nullable=False)
    accountBalance = db.Column(db.Float(), default=0.00)
    userId = db.Column(db.Integer(), db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)

    user = db.relationship('User', backref=db.backref('accounts'))

    def to_dict(self):
        return {
            "id": self.id,
            "accountName": self.accountName,
            "accountBalance": self.accountBalance,
            "userId": self.userId
        }

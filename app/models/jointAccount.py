from .db import db, environment, SCHEMA, add_prefix_for_prod

class Account(db.Model):
    __tablename__ = 'jointAccounts'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer(), primary_key=True)
    accountName = db.Column(db.String(40), nullable=False)
    accountBalance = db.Column(db.Decimale(scale=2), default=0.00)
    primaryOwner_id = db.Column(db.Integer(), db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    secondaryOwner_id = db.Column(db.String(40), nullable=True)
    

    owner = db.relationship('User', backref=db.backref('jointAccounts'))

    def to_dict(self):
        return {
            "id": self.id,
            "accountName": self.accountName,
            "accountBalance": self.accountBalance,
            "primaryOwner_id": self.primaryOwner_id,
            "secondaryOwner_id": self.secondaryOwner_id
        }

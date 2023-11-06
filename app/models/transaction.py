from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Transaction(db.Model):
    __tablename__ = 'transactions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    senderId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("accounts.id")), nullable=False)
    receiverId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("accounts.id")), nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.now())
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String, default="Pending")


    sender = db.relationship('Account', backref='sent_transactions', foreign_keys=[senderId])
    receiver = db.relationship('Account', backref='received_transactions', foreign_keys=[receiverId])


    def to_dict(self):
        return {
            "id": self.id,
            "senderId": self.senderId,
            "receiverId": self.receiverId,
            "createdAt": self.createdAt,
            "amount": self.amount,
            "status": self.status
        }

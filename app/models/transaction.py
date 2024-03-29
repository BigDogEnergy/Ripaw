from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timedelta

# Fixed PST offset
PST_OFFSET_HOURS = -8
PST_OFFSET = timedelta(hours=PST_OFFSET_HOURS)


class Transaction(db.Model):
    __tablename__ = 'transactions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    senderId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    receiverId = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow() + PST_OFFSET)
    completed_at = db.Column(db.DateTime, default=None)
    amount = db.Column(db.Numeric(scale=2), nullable=False)
    message = db.Column(db.String(200))
    status = db.Column(db.String(200))
    senderBalance = db.Column(db.Numeric(scale=2))
    receiverBalance = db.Column(db.Numeric(scale=2))



    sender = db.relationship('User', backref=db.backref('transactions'))


    def to_dict(self):
        return {
            "id": self.id,
            "senderId": self.senderId,
            "receiverId": self.receiverId,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "amount": self.amount,
            "message": self.message,
            "status": self.status,
            "senderBalance": self.senderBalance,
            "receiverBalance": self.receiverBalance
        }

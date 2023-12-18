from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Transaction(db.Model):
    __tablename__ = 'transactions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    senderId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    receiverId = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completedAt = db.Column(db.DateTime, default=None)
    amount = db.Column(db.Numeric(scale=2), nullable=False)
    message = db.Column(db.String(200))
    status = db.Column(db.String)


    sender = db.relationship('User', backref=db.backref('transactions'))


    def to_dict(self):
        return {
            "id": self.id,
            "senderId": self.senderId,
            "receiverId": self.receiverId,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "completedAt": self.completedAt.isoformat() if self.completedAt else None,
            "amount": self.amount,
            "message": self.message,
            "status": self.status
        }

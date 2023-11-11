from flask_wtf import FlaskForm
from wtforms import StringField, FloatField, IntegerField
from wtforms.validators import DataRequired


class TransactionForm(FlaskForm):

    amount=FloatField('amount', validators=[DataRequired()])
    receiverId=IntegerField('receiver', validators=[DataRequired()])
    senderId=IntegerField('sender', validators=[DataRequired()])
    message=StringField('message')
    status=StringField('status', validators=[DataRequired()])
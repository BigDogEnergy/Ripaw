from flask_wtf import FlaskForm
from wtforms import StringField, FloatField
from wtforms.validators import DataRequired


class NewAccountForm(FlaskForm):
    accountName= StringField(
        'name', validators=[DataRequired()])
    accountBalance=FloatField(
        'balance')
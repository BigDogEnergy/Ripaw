from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired


class UpdateTransactionForm(FlaskForm):

    message=StringField('message')
    status=StringField('status', validators=[DataRequired()])
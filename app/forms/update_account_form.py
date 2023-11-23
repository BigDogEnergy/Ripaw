from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import Optional

class UpdateAccountForm(FlaskForm):

    accountName = StringField('Account Name', validators=[Optional()])
    status = StringField('Account Status', validators=[Optional()])

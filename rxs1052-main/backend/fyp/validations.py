from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

WebModel = get_user_model()

def own_validate(data):
    email = data['email'].strip()
    username = data['username'].strip()
    password = data['password'].strip() 

    if not email or WebModel.objects.filter(email=email).exists():
        return ValidationError({'error': 'Email already exists'})

    if not password:
        return ValidationError({'error': 'pass'})
    
    if not username:
        return ValidationError({'error': 'user'})
    
    return data

## When logging in, checks whether the email and password and username exist
def email_validate(data):
    email = data['email'].strip()
    if not email:
        raise ValidationError({'error': 'Email already exists'})
    return True

def password_validate(data):
    password = data['password'].strip()
    if not password:
        raise ValidationError({'error': 'passsssss'})
    return True

def username_validate(data):
    username = data['username'].strip()
    if not username:
        raise ValidationError({'error': 'userrrrr'})
    return True



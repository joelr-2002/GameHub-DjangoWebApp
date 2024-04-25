# accounts/forms.py
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import AuthenticationForm
from django.core.exceptions import ValidationError

User = get_user_model()
class CustomUserCreationForm(UserCreationForm):

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'username', 'profile_picture', 'password1', 'password2']
        labels = {
            'email': ('Correo electrónico'),
            'first_name': ('Nombre'),
            'last_name': ('Apellidos'),
            'username': ('Nombre de usuario'),
            'profile_picture': ('Imagen de perfil'),
            'password1': ('Contraseña'),
            'password2': ('Confirmar contraseña'),
        }

    def clean_first_name(self):
        first_name = self.cleaned_data.get('first_name')
        if not first_name:
            raise ValidationError(('Nombre vacío. Por favor, introduce un nombre.'))
        return first_name

    def clean_last_name(self):
        last_name = self.cleaned_data.get('last_name')
        if not last_name:
            raise ValidationError(('Apellido vacío. Por favor, introduce un apellido.'))
        return last_name

    # def clean_first_name(self):
    #     first_name = self.cleaned_data.get('first_name')
    #     if not first_name:
    #         raise ValidationError(('Nombre vacío. Por favor, introduce un nombre.'))
    #     return first_name

    # def clean_last_name(self):
    #     last_name = self.cleaned_data.get('last_name')
    #     if not last_name:
    #         raise ValidationError(('Apellido vacío. Por favor, introduce un apellido.'))
    #     return last_name

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if not email:
            raise ValidationError(('Correo electrónico vacío. Por favor, introduce un correo electrónico.'))
        if User.objects.filter(email=email).exists():
            raise ValidationError(("Ya existe un usuario con este correo electrónico."))
        return email

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if not username:
            raise ValidationError(('Nombre de usuario vacío. Por favor, introduce un nombre de usuario.'))
        if User.objects.filter(username=username).exists():
            raise ValidationError(("Ya existe un usuario con este nombre de usuario."))
        return username

    def clean_password1(self):
        password1 = self.cleaned_data.get('password1')
        if not password1:
            raise ValidationError(('Contraseña vacía. Por favor, introduce una contraseña.'))
        return password1

    # def clean_password2(self):
    #     password2 = self.cleaned_data.get('password2')
    #     if not password2:
    #         raise ValidationError(('Por favor, confirma tu contraseña.'))
    #     if password1 and password2 and password1 != password2:
    #         raise ValidationError(('Las contraseñas no coinciden.'))
    #     return password2

    def clean_profile_picture(self):
        profile_picture = self.cleaned_data.get('profile_picture')
        if not profile_picture:
            raise ValidationError(('Por favor, proporciona un enlace para tu foto de perfil.'))
        return profile_picture











    # class Meta:
    #     model = User
    #     fields = ['email', 'first_name', 'last_name', 'username', 'profile_picture', 'password1', 'password2']
    #     labels = {
    #         'email': ('Correo electrónico'),
    #         'first_name': ('Nombre'),
    #         'last_name': ('Apellidos'),
    #         'username': ('Nombre de usuario'),
    #         'profile_picture': ('Imagen de perfil'),
    #         'password1': ('Contraseña'),
    #         'password2': ('Confirmar contraseña'),
    #     }

    # def clean_first_name(self):
    #     first_name = self.cleaned_data.get('first_name')
    #     if not first_name:
    #         raise ValidationError(('Nombre vacío. Por favor, introduce un nombre.'))
    #     return first_name

    # def clean_last_name(self):
    #     last_name = self.cleaned_data.get('last_name')
    #     if not last_name:
    #         raise ValidationError(('Apellido vacío. Por favor, introduce un apellido.'))
    #     return last_name

    # def clean_email(self):
    #     email = self.cleaned_data.get('email')
    #     if not email:
    #         raise ValidationError(('Correo electrónico vacío. Por favor, introduce un correo electrónico.'))
    #     if User.objects.filter(email=email).exists():
    #         raise ValidationError(("Ya existe un usuario con este correo electrónico."))
    #     return email

    # def clean_username(self):
    #     username = self.cleaned_data.get('username')
    #     if not username:
    #         raise ValidationError(('Nombre de usuario vacío. Por favor, introduce un nombre de usuario.'))
    #     if User.objects.filter(username=username).exists():
    #         raise ValidationError(("Ya existe un usuario con este nombre de usuario."))
    #     return username


      #############################  

class CustomAuthenticationForm(AuthenticationForm):
    # class Meta:
    #     model = get_user_model()
    #     fields = ['username', 'password']
    def __init__(self, *args, **kwargs):
        super(CustomAuthenticationForm, self).__init__(*args, **kwargs)
        self.fields['username'].label = 'Nombre de usuario o correo electrónico'
        self.fields['password'].label = 'Contraseña'

    class Meta:
        model = get_user_model()
        fields = ['username', 'password']

from django.shortcuts import render, redirect
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import messages
from .models import Role
from .forms import CustomUserCreationForm
from .forms import CustomAuthenticationForm
from django.contrib.auth import logout as auth_logout
from .models import Role



# User = get_user_model()

def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            default_role, created = Role.objects.get_or_create(name='Usuario', defaults={'description': 'Rol de usuario estándar'})
            user.role = default_role
            user.save()
            messages.success(request, 'Registro exitoso. Ahora puedes iniciar sesión.')
            return redirect('accounts:login')
        else:
            messages.error(request, 'Por favor corrige los errores en el formulario.')
    else:
        form = CustomUserCreationForm()
    return render(request, 'accounts/register.html', {'form': form})




def custom_login(request):
    if request.method == 'POST':
        form = CustomAuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            if user.is_banned:
                messages.error(request, 'Tu cuenta ha sido suspendida. Por favor contacta a los administradores.')
                return render(request, "accounts/login.html", {'form': form})
            auth_login(request, user)
            return redirect('home')
        else:
            messages.error(request, 'Por favor ingrese un nombre de usuario y contraseña válidos.')
    else:
        form = CustomAuthenticationForm()
    return render(request, "accounts/login.html", {'form': form})


def logout(request):
    auth_logout(request)
    return redirect('accounts:login')


# def ban_user(request, user_id):
#     if request.user.is_superuser:
#         try:
#             user = CustomUser.objects.get(id=user_id)
#             user.is_banned = True
#             user.save()
#             messages.success(request, 'El usuario ha sido baneado.')
#         except CustomUser.DoesNotExist:
#             messages.error(request, 'Usuario no encontrado.')
#     else:
#         messages.error(request, 'No tienes permisos para realizar esta acción.')
#     return redirect('home')

from django.urls import path
from .views import register, custom_login, logout
from django.contrib.auth.views import LoginView, LogoutView

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', custom_login, name='login'),
    path('login2/', LoginView.as_view(template_name='accouts/login2.html'), name='login2'),
    path('logout/', logout, name='logout'),
]

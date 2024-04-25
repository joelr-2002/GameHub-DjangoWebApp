from django.urls import path
from .views import buscaminas

urlpatterns = [
    path('', buscaminas, name='buscaminas'),
]
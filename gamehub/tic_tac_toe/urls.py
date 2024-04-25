from django.urls import path
from .views import tic, dice


urlpatterns = [
    path('', tic, name='tictactoeGame'),
    path('dice/', dice, name='dice'),
]

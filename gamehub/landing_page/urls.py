from django.urls import path
from .views import home, landing, handle_game_selection, digger

urlpatterns = [
    path('', landing, name='landing'),
    path('dashboard/', home, name='home'),  # Ruta de la landing page
    path('api/handle_game_selection/', handle_game_selection, name='handle_game_selection'),  # Ruta de la landing page
    # path('api/no/', handle_action, name='handle_action'),
    path('digger/', digger, name='digger'),
]

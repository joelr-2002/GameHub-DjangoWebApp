from django.urls import path
from .views import rank, history, createMatch, createMatchWS, createMatchBM
# from .views import word, get_categories_and_difficulties, handle_action


urlpatterns = [
    path('ranking/', rank, name='ranking'),
    path('history/', history, name='matchhistory'),
    path('match/', createMatch, name='match'),
    path('match/word_search', createMatchWS, name='matchWS'),
    path('match/buscaminas', createMatchBM, name='buscaminas')
]
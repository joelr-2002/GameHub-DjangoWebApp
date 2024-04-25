from django.urls import path, reverse
from .views import checkers, report, test

urlpatterns = [
    path('', checkers, name='checkers'),
    path('checkers/report/', report, name='report'),
    path('test/', test, name='test'),
]

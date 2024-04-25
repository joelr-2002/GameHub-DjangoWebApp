from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/checkers/<str:room_name>/', consumers.ChineseCheckersConsumer.as_asgi()),
    path('ws/checkers/online-rooms/', consumers.OnlineRoomConsumer.as_asgi())
]
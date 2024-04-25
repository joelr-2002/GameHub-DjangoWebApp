# routing.py
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import re_path
from django.core.asgi import get_asgi_application
import chat.routing as chat_routing

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": URLRouter(chat_routing.websocket_urlpatterns),
    }
)
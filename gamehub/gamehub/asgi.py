import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
import chat.routing
import chinese_checkers.routing
import bingo.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gamehub.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter(
        chat.routing.websocket_urlpatterns +
        chinese_checkers.routing.websocket_urlpatterns +
        bingo.routing.websocket_urlpatterns
    ),
})
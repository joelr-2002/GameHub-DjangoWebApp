from django.contrib import admin
from .models import Game, Season, Match, Badge, PlayerBadge
# Register your models here.


admin.site.register(Game)
admin.site.register(Season)
admin.site.register(Match)
admin.site.register(Badge)
admin.site.register(PlayerBadge)
from django.utils.deprecation import MiddlewareMixin
from .models import PlayerBadge, Season

class UserBadgesMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.user.is_authenticated:
            current_season = Season.objects.filter(current=True).first()
            user_badges = PlayerBadge.objects.filter(player=request.user, season=current_season)
            request.user_badges = user_badges

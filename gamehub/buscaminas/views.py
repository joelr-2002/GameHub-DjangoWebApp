from django.shortcuts import render
from match_core.models import Game, PlayerBadge, Season

# Create your views here.
def buscaminas(request):
  current_season = Season.objects.get(current=True)
  user_badges = PlayerBadge.objects.filter(player=request.user, season=current_season)
  return render(request, 'buscaminas.html',{'user_badges': user_badges,
        'current_season': current_season})
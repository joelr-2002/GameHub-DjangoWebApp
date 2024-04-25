from django.shortcuts import render
from match_core.models import Game, PlayerBadge, Season

def tic(request):
    current_season = Season.objects.get(current=True)
    user_badges = PlayerBadge.objects.filter(player=request.user, season=current_season)
    return render(request, "tic_tac_toe.html",{'active_view': 'game','user_badges': user_badges,
        'current_season': current_season})

def dice(request):
    return render(request, "dado.html")
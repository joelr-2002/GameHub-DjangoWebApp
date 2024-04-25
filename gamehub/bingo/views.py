from django.http import JsonResponse
from django.shortcuts import render
from .models import BingoRoom
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import re
from match_core.models import Game, PlayerBadge, Season
# Create your views here.

def CreateRoomView(request):
    current_season = Season.objects.get(current=True)
    user_badges = PlayerBadge.objects.filter(player=request.user, season=current_season)
    return render(request,'bingo/create_room.html',{'user_badges': user_badges,
        'current_season': current_season})

def bingoView(request,room_name):
    if not re.match(r'^[\w-]*$', room_name):
        return render(request,'bingo/error.html')
    
    current_season = Season.objects.get(current=True)
    user_badges = PlayerBadge.objects.filter(player=request.user, season=current_season)

    return render(request,'bingo/bingo.html', {'user_badges': user_badges,
        'current_season': current_season})

@csrf_exempt
def roomExist(request,room_name):
    print(room_name)
    
    return JsonResponse({
        "room_exist":BingoRoom.objects.filter(room_name=room_name).exists()
    })
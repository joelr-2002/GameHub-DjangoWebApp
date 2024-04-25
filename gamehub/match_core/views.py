from django.db.models import Sum
from django.shortcuts import render
from .models import Game, Season, Match
from accounts.models import CustomUser
from django.contrib.auth.decorators import login_required
import json
from django.http import JsonResponse
from datetime import timedelta
from .models import Badge, PlayerBadge



def asignar_insignias_temporada(current_season, jugador):
    # Obtener la suma de puntos ganados por el jugador en la temporada actual
    total_points = Match.objects.filter(season=current_season, winner=jugador).aggregate(total_points=Sum('points_awarded'))['total_points'] or 0
    # Obtener todas las insignias que el jugador podría ganar en función de los puntos ganados
    insignias_disponibles = Badge.objects.filter(min_points__lte=total_points)
    print(insignias_disponibles)
    print(insignias_disponibles)
    print(insignias_disponibles)
    print(insignias_disponibles)
    # Asignar las insignias al jugador
    for insignia in insignias_disponibles:
        PlayerBadge.objects.get_or_create(player=jugador, badge=insignia, season=current_season)



# Create your views here.
# @login_required
def rank(request):
    selected_game = request.GET.get('game')

    matches = Match.objects.all()
    user = CustomUser.objects.get(email=request.user)
    # user = CustomUser.objects.get(email=request.user)
    # print('user ', user)

    if selected_game and selected_game != 'Todos los juegos':
        matches = matches.filter(game=selected_game)

  
    player_points = {}
    for match in matches:
        if match.player1.username not in player_points:
            player_points[match.player1.username] = 0
        if match.player2 and match.player2.username not in player_points:
            player_points[match.player2.username] = 0

        if match.winner:
            if match.winner == match.player1:
                player_points[match.player1.username] += match.points_awarded
            else:
                player_points[match.player2.username] += match.points_awarded

    current_season = Season.objects.get(current=True)
    user_badges = PlayerBadge.objects.filter(player=request.user, season=current_season)

        
    sorted_players = sorted(player_points.items(), key=lambda x: x[1], reverse=True)[:20]
    user = {'first_name': user.first_name, 'last_name': user.last_name, 'img': user.profile_picture}
    infoRanking = {'sorted_players': sorted_players, 'user': user, 'active_view': 'position','user_badges': user_badges,
        'current_season': current_season}

    return render(request, "ranking.html", infoRanking)

# @login_required
def history(request):
    user = request.user
    userData = {'id': user.id, 'first_name': user.first_name, 'last_name': user.last_name, 'img': user.profile_picture}
    matches = Match.objects.filter(player1=user) | Match.objects.filter(player2=user)
    current_season = Season.objects.get(current=True)
    user_badges = PlayerBadge.objects.filter(player=request.user, season=current_season)
    return render(request, "matchHy.html", {"game_history": matches, "user": userData, 'active_view': 'history','user_badges': user_badges,
        'current_season': current_season})

# Tic Tac Toe
@login_required
def createMatch(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        currentSeason = Season.objects.latest('start_date')
        game = Game.objects.get(name=data.get('game'))
        user = CustomUser.objects.get(email=request.user)

        match = Match(
            game = game,
            season = currentSeason,
            duration = timedelta(hours=0, minutes=0, seconds=0),
            player1 = user,
            winner = user,
            player1_attempts = 1,
            points_awarded = data.get('points_awarded')
        )

        match.save()

        # GUARDAR INSIGNIAAAAAAAAAAAAA
        # asignar insignias
        # Asignar insignias después de guardar el juego
        asignar_insignias_temporada(currentSeason, user)

        responseData = {
            'message': 'Datos almacenados correctamente'
        }
        
        return JsonResponse(responseData)

# Word Search
@login_required
def createMatchWS(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        currentSeason = Season.objects.latest('start_date')
        game = Game.objects.get(name=data.get('game'))
        user = CustomUser.objects.get(email=request.user)

        hour, minute, second = map(int, data.get('duration').split(':'))
        duration = timedelta(hours=hour, minutes=minute, seconds=second)
        
        match = Match(
            game = game,
            season = currentSeason,
            duration = duration,
            player1 = user,
            winner = user,
            player1_attempts = data.get('player1_attempts'),
            points_awarded = data.get('points_awarded')
        )

        match.save()


        # Asignar insignias después de guardar el juego
        asignar_insignias_temporada(currentSeason, user)

        responseData = {
            'message': 'Datos almacenados correctamente'
        }
        
        return JsonResponse(responseData)
    
# Buscaminas
def createMatchBM(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        currentSeason = Season.objects.latest('start_date')
        game = Game.objects.get(name=data.get('game'))
        user = CustomUser.objects.get(email=request.user)

        match = Match(
            game = game,
            season = currentSeason,
            duration = timedelta(hours=0, minutes=0, seconds=0),
            player1 = user,
            winner = user,
            player1_attempts = 1,
            points_awarded = data.get('points_awarded')
        )

        match.save()

        # Asignar insignias después de guardar el juego
        asignar_insignias_temporada(currentSeason, user)

        responseData = {
            'message': 'Datos almacenados correctamente'
        }
        
        return JsonResponse(responseData)
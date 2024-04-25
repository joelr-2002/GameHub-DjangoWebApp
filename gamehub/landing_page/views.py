from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.urls import reverse
from match_core.models import Game, PlayerBadge, Season

import json
# from django.utils import timezone

def home(request):
    current_season = Season.objects.get(current=True)
    user_badges = PlayerBadge.objects.filter(player=request.user, season=current_season)
    games = Game.objects.all()

    # current_date = timezone.now().date()
    # current_season = Season.objects.filter(Q(current=True) | Q(start_date__lte=current_date, end_date__gte=current_date)).first()
    # if current_season is not None:
    #     user_badges = PlayerBadge.objects.filter(player=request.user, season=current_season)
    # else:
    #     user_badges = PlayerBadge.objects.filter(player=request.user)
    # games = Game.objects.all()
    context = {
        'games': games,
        'user_badges': user_badges,
        'current_season': current_season
    }

    """  
    context={
        'active_view': 'home',
        'title': 'Título personalizado',
        'main': 'Bienvenido a mi sitio web',
        'footer': 'Este es el contenido principal de la página',
        'aside': '© 2024 Mi Sitio Web',
        'main_content': 'Contenido principal específico de la página de inicio'
        user_badges': user_badges, 'current_season': current_season
    }
    """
    
    return render(request, "home.html",context)

def landing(request):   
    # context={
    #     'title': 'Título personalizado',
    #     'main': 'Bienvenido a mi sitio web',
    #     'footer': 'Este es el contenido principal de la página',
    #     'aside': '© 2024 Mi Sitio Web',
    #     'main_content': 'Contenido principal específico de la página de inicio'
    # }
    return render(request, "landing.html")

def handle_game_selection(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        category = data.get('category')
        difficulty = data.get('difficulty')
        request.session['category'] = category
        request.session['difficulty'] = difficulty

        print("Session category:", request.session.get('category'))
        print("Session difficulty:", request.session.get('difficulty'))


        # return redirect('words:word')
        redirect_url = reverse('words:word')
        return JsonResponse({'status': 'success', 'redirect_url': redirect_url})
        # return JsonResponse({'status': 'success', 'message': f'recibiendo, categoria: {category}, dificultad: {difficulty}, inicien!'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Solicitud invalida'}, status=400)

def digger(request):
    return render(request, "digger.html")
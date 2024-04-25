from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .forms import ReportsForm
from match_core.models import Game, PlayerBadge, Season

def checkers(request):   
    current_season = Season.objects.get(current=True)
    user_badges = PlayerBadge.objects.filter(player=request.user, season=current_season)
    return render(request, "chinese.html", {'active_view': 'game','user_badges': user_badges,
        'current_season': current_season})

def test(request):
    current_season = Season.objects.get(current=True)
    user_badges = PlayerBadge.objects.filter(player=request.user, season=current_season)
    return render(request, "test.html",{'user_badges': user_badges,
        'current_season': current_season})

@login_required
def report(request):
    print('HOLAMUNDO')
    if request.method == 'POST':
        form = ReportsForm(request.POST)
        if form.is_valid():
            form.instance.player = request.user 
            form.save()
            return redirect('/dashboard')
        else: 
            form = ReportsForm()
        current_season = Season.objects.get(current=True)
        user_badges = PlayerBadge.objects.filter(player=request.user, season=current_season)
        return render(request, 'game.html', {'active_view': 'game', 'form': form, 'active_view': 'game','user_badges': user_badges,
        'current_season': current_season})              

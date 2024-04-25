from django.shortcuts import render
from django.http import JsonResponse
from .models import Category, Word
import unicodedata
import random
from django.shortcuts import redirect
from match_core.models import Game, PlayerBadge, Season

# Normalización de palabras
def normalize_word(word):
    normalized_word = unicodedata.normalize('NFD', word)
    return ''.join([c for c in normalized_word if unicodedata.category(c) != 'Mn']).upper()

def word(request):   
    if request.method == 'POST':
        category_id = request.POST.get('category', None)
        difficulty = request.POST.get('difficulty', None)
        try:
            category = Category.objects.get(id=category_id)
            category_name = normalize_word(category.name)
        except Category.DoesNotExist:
            category_name = 'NO SELECCIONO UNA CATEGORIA'
            words = []
        else:
            if difficulty == 'easy':
                words = Word.objects.filter(category=category).order_by('?')[:10]
            elif difficulty == 'medium':
                words = Word.objects.filter(category=category).order_by('?')[:15]
            elif difficulty == 'hard':
                words = Word.objects.filter(category=category).order_by('?')[:20]
            else:
                words = []
        words_list = [normalize_word(word.word) for word in words]
        
    else:
        category_name = 'NO SELECCIONO UNA CATEGORIA'
        words_list = []
        difficulty = None  

    current_season = Season.objects.get(current=True)
    user_badges = PlayerBadge.objects.filter(player=request.user, season=current_season)
    



    categories_and_difficulties = get_categories_and_difficulties(request)

    context = {
        'active_view': 'game',
        'category': category_name,
        'difficulty': normalize_word(difficulty) if difficulty else 'NO SELECCIONO NINGUNA DIFICULTAD',
        'words': words_list,
        'categories': categories_and_difficulties['categories'],
        'difficulties': categories_and_difficulties['difficulties'],
        'user_badges': user_badges,
        'current_season': current_season
    }
    return render(request, "words.html", context)

def get_categories_and_difficulties(request):
    categories = list(Category.objects.values('name', 'id'))
    difficulties = Word.objects.order_by().values_list('difficulty', flat=True).distinct()
    return {'categories': categories, 'difficulties': list(difficulties)}

def get_words_by_category_and_difficulty(category_name, difficulty_level):
    words = Word.objects.filter(
        category__name=category_name,
        difficulty=difficulty_level
    )
    return words


def get_words(request):
    category_id = request.GET.get('category')
    difficulty = request.GET.get('difficulty')

    if not category_id or not difficulty:
        return JsonResponse({'error': 'Faltan parámetros necesarios.'}, status=400)

    try:
        category = Category.objects.get(id=category_id)
        words = Word.objects.filter(category=category, difficulty=difficulty).order_by('?')
        words_list = [word.word for word in words]
    except Category.DoesNotExist:
        return JsonResponse({'error': 'Categoría no encontrada.'}, status=404)

    return JsonResponse({
        'category': category.name,
        'difficulty': difficulty,
        'words': words_list
    })
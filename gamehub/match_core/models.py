# match_core/models.py

from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Game(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name

class Season(models.Model):
    start_date = models.DateField()
    end_date = models.DateField()
    current = models.BooleanField(default=False)

    def __str__(self):
        return f"Season from {self.start_date} to {self.end_date}"

class Match(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    season = models.ForeignKey(Season, related_name='matches', on_delete=models.CASCADE)
    start_time = models.DateTimeField(auto_now_add=True)
    duration = models.DurationField(null=True)
    player1 = models.ForeignKey(User, related_name='matches_as_player1', on_delete=models.CASCADE)
    player2 = models.ForeignKey(User, related_name='matches_as_player2', on_delete=models.CASCADE, null=True)
    winner = models.ForeignKey(User, related_name='matches_won', on_delete=models.CASCADE, null=True)
    player1_attempts = models.IntegerField()
    player2_attempts = models.IntegerField(null=True)
    points_awarded = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.game} between {self.player1} and {self.player2}"

class Reports(models.Model):
    player = models.ForeignKey(User, related_name='reports', on_delete=models.CASCADE)
    player_reported = models.ForeignKey(User, related_name='reports_filed', on_delete=models.CASCADE)
    report = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report from {self.player} on {self.match}"




class Badge(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    image_svg = models.TextField(default='URL_POR_DEFECTO') 
    min_points = models.IntegerField(default=0)  # Límite mínimo de puntos para otorgar esta insignia

    def __str__(self):
        return self.name

class PlayerBadge(models.Model):
    player = models.ForeignKey(User, related_name='badges', on_delete=models.CASCADE)
    badge = models.ForeignKey(Badge, related_name='players', on_delete=models.CASCADE)
    season = models.ForeignKey(Season, related_name='player_badges', on_delete=models.CASCADE, default=1)  # Temporada en la que se otorgó la insignia
    date_awarded = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.player}'s {self.badge} in {self.season}"
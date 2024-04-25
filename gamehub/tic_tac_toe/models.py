from django.db import models

# Create your models here.

class Score(models.Model):
    player = models.CharField(max_length=50)
    score = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)
    game = models.CharField(max_length=50, default='Tic Tac Toe')

    def __str__(self):
        return self.player
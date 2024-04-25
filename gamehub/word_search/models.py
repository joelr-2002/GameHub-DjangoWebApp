from django.db import models
from django.utils import timezone

class Category(models.Model):
    name = models.CharField(max_length=100)
    creation_date = models.DateTimeField(default=timezone.now)
    update_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Word(models.Model):
    word = models.CharField(max_length=100)
    length = models.IntegerField(editable=False)
    category = models.ForeignKey(Category, related_name='words', on_delete=models.CASCADE)
    difficulty = models.CharField(max_length=10, choices=[('easy', 'Easy'), ('medium', 'Medium'), ('hard', 'Hard')])
    creation_date = models.DateTimeField(default=timezone.now)
    update_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.word

    def save(self, *args, **kwargs):
        self.length = len(self.word)
        super().save(*args, **kwargs)
        
class Score(models.Model):
    player = models.CharField(max_length=50)
    score = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)
    game = models.CharField(max_length=50, default='Word Search')
    time = models.TimeField()
    tries = models.IntegerField()

    def __str__(self):
        return self.player
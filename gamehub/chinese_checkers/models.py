from django.db import models
from accounts.models import CustomUser as User

# Create your models here.
class CheckersRoom(models.Model):
    room_name = models.CharField(max_length=50)
    
    def __str__(self) -> str:
        return self.room_name
    
class CheckersPlayer(models.Model):
    username = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey(CheckersRoom, on_delete=models.CASCADE)
    color = models.CharField(max_length=50)
    is_host = models.BooleanField()
    
    def __str__(self) -> str:
        return self.username.username
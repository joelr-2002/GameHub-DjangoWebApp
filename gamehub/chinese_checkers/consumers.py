from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import async_to_sync, sync_to_async
import json
from .models import CheckersRoom, CheckersPlayer
import re


class ChineseCheckersConsumer(AsyncJsonWebsocketConsumer):
    
    # Connect to the websocket
    async def connect(self):
        self.url_route = self.scope['url_route']['kwargs']['room_name']
        await self.accept()
        self.room_name = f'checkers_{self.url_route}'
        await self.create_room()
        self.user_left = ''
        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name
        )
        
        
    # Creates a new CheckersRoom object or retrieves an existing one based on the room name
    @database_sync_to_async
    def creater_room(self):
        self.checkers_room, _ = CheckersRoom.objects.get_or_create(room_name=self.url_route)
        
    # Called when a message is received from the websocket
    async def receive_json(self, content):
        
        command = content.get("command", None)
        
        if command == "clicked":
            dataid = content.get("dataset", None)
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "websocket_info",
                    "dataid": dataid,
                    "user": content.get("user", None),
                    "datatry": content.get("dataid", None),
                }
            )
        if command == "joined" or command == "won":
            info = content.get("info", None)
            user = content.get("user", None)
            
            await self.create_players(user)
            
            self.user_left = content.get("user", None)
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "websocket_joined",
                    "info": info,
                    "user": user,
                    "command": command,
                    "CheckersCount": content.get("CheckersCount", 'none')
                }
            )
        if command == "chat":
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "websocket_chat",
                    "chat": content.get("chat", None),
                    "user": content.get("user", None),
                    "command": command,
                }
            )

    # Creates a new CheckersPlayer object or retrieves an existing one based on the player name
    @database_sync_to_async
    def create_players(self, name):
        
        CheckersPlayer.objects.get_or_create(username=name, room=self.checkers_room, color='red', is_host=False)
        
    # Retrieves the count of players in the room
    @database_sync_to_async
    def players_count(self):
        
        self.all_players_for_room = [x.username for x in self.checkers_room.checkersplayer_set.all()]
        self.players_count_all = self.checkers_room.checkersplayer_set.all().count()
        
        
    # Sends a websocket message to the client with information about a moved piece
    async def websocket_info(self, event):
        dataid = event['dataid']
        user = event['user']
        datatry = event['datatry']
        
        await self.send_json({
            'command': 'clicked',
            'dataid': dataid,
            'user': user,
            'datatry': datatry
        })
        
    # Sends a websocket message to the client with chat information.
    async def websocket_chat(self, event):
        chat = event['chat']
        user = event['user']
        
        await self.send_json({
            'command': 'chat',
            'chat': chat,
            'user': user
        })
        
    # Sends a websocket message to the client with information about a player joining or winning the game.
    async def websocket_joined(self, event):
        
        await self.players_count()
        await self.send_json({
            'command': event['command'],
            'info': event['info'],
            'user': event['user'],
            'CheckersCount': event['CheckersCount'],
            'users_count': self.players_count_all,
            'all_players': self.all_players_for_room,
        })
        
    # Called when the websocket is disconnected, performs cleanup and notifies the other players
    async def disconnect(self, close_code):
        
        await self.channel_layer.group_send(
            self.room_name,
            {
                "type": "websocket_joined",
                "command": "left",
                "info": f"{self.user_left} abandonó el juego",
                "user": self.user_left,
            }
        )
        await self.delete_player()
        
        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )
        
    # Deletes the player from the room, if there are no players left, the room is deleted
    @database_sync_to_async
    def delete_player(self):
        
        player = CheckersPlayer.objects.get(username=self.user_left)
        player.delete()
        
        if self.checkers_room.checkersplayer_set.all().count() == 0:
            self.checkers_room.delete()
            
    # Sends a websocket message to the client with information about a player leaving the game
    async def websocket_leave(self, event):
        await self.players_count()
        
        info = event['info']
        
        await self.send_json({
            'command': 'joined',
            'info': info,
            'users_count': self.players_count_all,
            'all_players': self.all_players_for_room
        })
        

class OnlineRoomConsumer(AsyncJsonWebsocketConsumer):
    
    async def connect(self):
        await self.accept()
        self.room_name = 'online_checkers_room'
        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name
        )
        await self.online_room()
        
        await self.channel_layer.group_send(
            self.room_name,
            {
                "type": "websocket_rooms",
                "online_rooms": self.online_rooms
            }
        )
        
    @database_sync_to_async
    def online_room(self):
        
        self.online_rooms = [x.room_name for x in CheckersRoom.objects.all()]
        
    async def websocket_rooms(self, event):
        await self.send_json(({
            'command': 'online_rooms',
            'online_rooms': self.online_rooms
        }))
        
    async def websocket_room_added(self, event):
        await self.send_json(({
            'command': event['command'],
            'room_name': event['room_name'],
            'room_id': event['room_id']
        }))
        
    async def websocket_room_deleted(self, event):
        await self.send_json(({
            'command': event['command'],
            'room_name': event['room_name'],
            'room_id': event['room_id']
        }))
    
    async def receive_json(self, content, **kwargs):
        return await super().receive_json(content, **kwargs)
    
    async def disconnect(self, code):
        return await super().disconnect(code)
        
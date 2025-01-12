from channels.generic.websocket import AsyncWebsocketConsumer
import json

class GenerationStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        self.room_name = f"user_{self.user.id}"
        
        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name
        )
        await self.accept()
    
    async def generation_status(self, event):
        await self.send(text_data=json.dumps({
            "type": "generation_status",
            "status": event["status"],
            "progress": event["progress"]
        })) 
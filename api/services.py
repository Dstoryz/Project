import secrets
from datetime import datetime, timedelta
from .models import APIKey

class APIKeyService:
    def create_key(self, user, name, expires_in_days=None):
        expires_at = None
        if expires_in_days:
            expires_at = datetime.now() + timedelta(days=expires_in_days)
            
        return APIKey.objects.create(
            user=user,
            name=name,
            expires_at=expires_at
        )
    
    def validate_key(self, key_string):
        try:
            key = APIKey.objects.get(
                key=key_string,
                active=True
            )
            
            if key.expires_at and key.expires_at < datetime.now():
                return None
                
            key.last_used = datetime.now()
            key.save()
            
            return key
            
        except APIKey.DoesNotExist:
            return None
    
    def revoke_key(self, key_id):
        key = APIKey.objects.get(id=key_id)
        key.active = False
        key.save() 
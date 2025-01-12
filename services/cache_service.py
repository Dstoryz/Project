from django.core.cache import cache
from django.conf import settings
import hashlib
import json

class CacheService:
    def __init__(self):
        self.default_timeout = settings.CACHE_TIMEOUT
        
    def get_or_set(self, key, callback, timeout=None):
        """Получает значение из кэша или вычисляет его"""
        value = cache.get(key)
        if value is None:
            value = callback()
            cache.set(key, value, timeout or self.default_timeout)
        return value
        
    def cache_key(self, *args, **kwargs):
        """Генерирует ключ кэша из аргументов"""
        key_parts = list(args)
        key_parts.extend(sorted(kwargs.items()))
        key_string = json.dumps(key_parts, sort_keys=True)
        return hashlib.md5(key_string.encode()).hexdigest()
        
    def invalidate_user_cache(self, user_id):
        """Инвалидирует весь кэш пользователя"""
        patterns = [
            f"user_{user_id}_*",
            f"history_{user_id}_*",
            f"stats_{user_id}_*"
        ]
        for pattern in patterns:
            cache.delete_pattern(pattern)
            
    def cache_user_data(self, user_id, data_type, data, timeout=None):
        """Кэширует данные пользователя определенного типа"""
        key = f"user_{user_id}_{data_type}"
        cache.set(key, data, timeout or self.default_timeout) 
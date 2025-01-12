class SecurityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Проверка rate limiting
        if not self.check_rate_limit(request):
            return HttpResponseTooManyRequests()
            
        # Проверка безопасности контента
        if not self.validate_content(request):
            return HttpResponseForbidden()
            
        response = self.get_response(request)
        return response 
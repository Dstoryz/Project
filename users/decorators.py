from functools import wraps
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

def csrf_exempt_for_token(view_func):
    @wraps(view_func)
    def wrapped_view(*args, **kwargs):
        return csrf_exempt(view_func)(*args, **kwargs)
    return wrapped_view 
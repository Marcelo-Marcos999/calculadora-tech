import os
import pickle
import time
from functools import wraps

def cache_dir_path():
    cache_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'cache')
    if not os.path.exists(cache_dir):
        os.makedirs(cache_dir)
    return cache_dir

def cache_result(ttl=60):
    cache_dir = cache_dir_path()
    cache_file = os.path.join(cache_dir, 'cache.pkl')

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            cache_key = str(args) + str(kwargs)
            try:
                with open(cache_file, 'rb') as f:
                    cache = pickle.load(f)
            except FileNotFoundError:
                cache = {}

            if cache_key in cache:
                result, timestamp = cache[cache_key]
                if time.time() - timestamp < ttl:
                    return result

            result = func(*args, **kwargs)
            with open(cache_file, 'wb') as f:
                cache[cache_key] = (result, time.time())
                pickle.dump(cache, f)
            return result
        return wrapper
    return decorator

def clear_cache():
    cache_dir = cache_dir_path()
    try:
        os.remove(os.path.join(cache_dir, 'cache.pkl'))
    except FileNotFoundError:
        pass

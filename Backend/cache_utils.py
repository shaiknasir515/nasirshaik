import time

CACHE = {}
CACHE_TTL = 60  # 60 seconds cache


def get_from_cache(symbol):
    """Fetch cached result if available & not expired."""
    if symbol in CACHE:
        saved_time, data = CACHE[symbol]
        if time.time() - saved_time < CACHE_TTL:
            return data
        else:
            del CACHE[symbol]  # expired
    return None


def save_to_cache(symbol, data):
    """Store new result with timestamp."""
    CACHE[symbol] = (time.time(), data)

import time
import yfinance as yf

def retry_fetch(func, retries=3, delay=1):
    """
    Retry wrapper for Yahoo Finance requests.
    """
    for attempt in range(retries):
        try:
            return func()
        except Exception:
            if attempt == retries - 1:
                raise
            time.sleep(delay)

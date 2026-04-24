import logging

# Create global logger
logger = logging.getLogger("stock_api")
logger.setLevel(logging.INFO)

# Log format
formatter = logging.Formatter("[%(asctime)s] %(levelname)s: %(message)s")

# Console handler
console = logging.StreamHandler()
console.setFormatter(formatter)
logger.addHandler(console)

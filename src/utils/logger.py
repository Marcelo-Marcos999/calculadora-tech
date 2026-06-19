import logging

# Create a logger
logger = logging.getLogger(__name__)

# Set the logging level to DEBUG
logger.setLevel(logging.DEBUG)

# Create a console handler
handler = logging.StreamHandler()

# Create a formatter and set it for the handler
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)

# Add the handler to the logger
logger.addHandler(handler)

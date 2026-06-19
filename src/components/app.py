from src.utils.config import Config
import logging

class AppComponent:
    def __init__(self, config):
        self.config = Config(config)
        self.logger = logging.getLogger(__name__)

    def render(self):
        log_level = self.config.get_log_level()
        self.logger.setLevel(log_level)
        self.logger.info("Rendering application component...")
        # Add your rendering logic here
        self.logger.info("Application component rendered successfully.")

    def start(self):
        self.render()
        self.logger.info("Application started successfully.")

if __name__ == "__main__":
    config = {
        'LOG_LEVEL': 'INFO'
    }
    app = AppComponent(config)
    app.start()

from src.utils.logger import logger

class Config:
    def __init__(self, config):
        self.config = config

    def get_config(self):
        return self.config

    def set_config(self, config):
        if not isinstance(config, dict):
            logger.error("Invalid config format. Expected a dictionary.")
            raise ValueError("Invalid config format. Expected a dictionary.")
        self.config = config

    def get_log_level(self):
        return self.config.get('LOG_LEVEL', 'DEBUG')

    def set_log_level(self, level):
        valid_levels = ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL']
        if level not in valid_levels:
            logger.error(f"Invalid log level. Expected one of {', '.join(valid_levels)}.")
            raise ValueError(f"Invalid log level. Expected one of {', '.join(valid_levels)}.")
        self.config['LOG_LEVEL'] = level

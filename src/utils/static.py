from src.utils.config import Config
import os
import mimetypes

class Static:
    def __init__(self, config):
        self.config = config
        self.base_dir = self.config.get_config().get('STATIC_DIR', 'static')

    def get_static_dir(self):
        return os.path.join(os.getcwd(), self.base_dir)

    def get_mime_type(self, file_path):
        return mimetypes.guess_type(file_path)[0]

    def serve_static_file(self, file_path):
        mime_type = self.get_mime_type(file_path)
        if mime_type:
            return f'Content-Type: {mime_type}\n\n{self.get_file_contents(file_path)}'
        else:
            return f'Content-Type: application/octet-stream\n\n{self.get_file_contents(file_path)}'

    def get_file_contents(self, file_path):
        with open(file_path, 'rb') as file:
            return file.read()

config = Config({
    'STATIC_DIR': 'static'
})

static = Static(config)

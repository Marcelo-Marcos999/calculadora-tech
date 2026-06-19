import unittest
from unittest.mock import patch
from src.components.app import AppComponent

class TestAppComponent(unittest.TestCase):

    @patch('src.components.app.logging')
    def test_render(self, mock_logging):
        app = AppComponent({
            'LOG_LEVEL': 'INFO'
        })
        app.render()
        mock_logging.getLogger.assert_called_once_with(__name__)
        mock_logging.getLogger.return_value.setLevel.assert_called_once_with('INFO')
        mock_logging.getLogger.return_value.info.assert_called_once_with("Rendering application component...")
        mock_logging.getLogger.return_value.info.assert_called_with("Application component rendered successfully.")

    @patch('src.components.app.logging')
    def test_start(self, mock_logging):
        app = AppComponent({
            'LOG_LEVEL': 'INFO'
        })
        app.start()
        app.render()
        mock_logging.getLogger.return_value.setLevel.assert_called_once_with('INFO')
        mock_logging.getLogger.return_value.info.assert_called_with("Rendering application component...")
        mock_logging.getLogger.return_value.info.assert_called_with("Application component rendered successfully.")
        mock_logging.getLogger.return_value.info.assert_called_with("Application started successfully.")

if __name__ == '__main__':
    unittest.main()

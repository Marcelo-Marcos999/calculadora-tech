import unittest
from unittest.mock import patch
from unittest.mock import MagicMock
from src.utils.browser_compat import get_browser_info, is_local_execution, is_cache_enabled, is_optimization_enabled, is_browser_version_supported, is_browser_supported, get_supported_browsers

class TestBrowserCompat(unittest.TestCase):

    def test_get_browser_info(self):
        browser_info = get_browser_info()
        self.assertIn('name', browser_info)
        self.assertIn('version', browser_info)
        self.assertIn('platform', browser_info)

    @patch('platform.system')
    def test_is_local_execution(self, mock_system):
        mock_system.return_value = 'Windows'
        self.assertTrue(is_local_execution())

    @patch('platform.system')
    def test_is_local_execution_not_windows(self, mock_system):
        mock_system.return_value = 'Linux'
        self.assertFalse(is_local_execution())

    def test_is_cache_enabled(self):
        self.assertFalse(is_cache_enabled())

    def test_is_optimization_enabled(self):
        self.assertFalse(is_optimization_enabled())

    def test_is_browser_version_supported(self):
        self.assertTrue(is_browser_version_supported('1.0', '0.0'))
        self.assertFalse(is_browser_version_supported('0.0', '1.0'))

    def test_is_browser_supported(self):
        self.assertTrue(is_browser_supported('Chrome', ['Chrome', 'Firefox']))
        self.assertFalse(is_browser_supported('Safari', ['Chrome', 'Firefox']))

    def test_get_supported_browsers(self):
        supported_browsers = get_supported_browsers()
        self.assertIn('Chrome', supported_browsers)
        self.assertIn('Firefox', supported_browsers)

if __name__ == '__main__':
    unittest.main()

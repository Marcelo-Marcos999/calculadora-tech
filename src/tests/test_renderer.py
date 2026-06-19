import unittest
from unittest.mock import patch, MagicMock
from src.components.renderer import Renderer, get_supported_browsers

class TestRenderer(unittest.TestCase):

    def setUp(self):
        self.renderer = Renderer()

    @patch('src.components.renderer.get_browser_info')
    @patch('src.components.renderer.is_browser_supported')
    @patch('src.components.renderer.is_browser_version_supported')
    @patch('src.components.renderer.load_asset')
    def test_render(self, mock_load_asset, mock_is_browser_version_supported, mock_is_browser_supported, mock_get_browser_info):
        mock_get_browser_info.return_value = {'name': 'Chrome', 'version': '90'}
        mock_is_browser_supported.return_value = True
        mock_is_browser_version_supported.return_value = True
        mock_load_asset.return_value = b'asset_content'

        result = self.renderer.render('asset_path')

        self.assertEqual(result, b'asset_content')
        mock_load_asset.assert_called_once_with('asset_path')

    @patch('src.components.renderer.get_browser_info')
    @patch('src.components.renderer.is_browser_supported')
    @patch('src.components.renderer.is_browser_version_supported')
    @patch('src.components.renderer.load_asset')
    def test_render_browser_not_supported(self, mock_load_asset, mock_is_browser_version_supported, mock_is_browser_supported, mock_get_browser_info):
        mock_get_browser_info.return_value = {'name': 'Chrome', 'version': '90'}
        mock_is_browser_supported.return_value = False
        mock_is_browser_version_supported.return_value = True
        mock_load_asset.return_value = b'asset_content'

        with self.assertRaises(ValueError):
            self.renderer.render('asset_path')

    @patch('src.components.renderer.get_browser_info')
    @patch('src.components.renderer.is_browser_supported')
    @patch('src.components.renderer.is_browser_version_supported')
    @patch('src.components.renderer.load_asset')
    def test_render_browser_version_not_supported(self, mock_load_asset, mock_is_browser_version_supported, mock_is_browser_supported, mock_get_browser_info):
        mock_get_browser_info.return_value = {'name': 'Chrome', 'version': '90'}
        mock_is_browser_supported.return_value = True
        mock_is_browser_version_supported.return_value = False
        mock_load_asset.return_value = b'asset_content'

        with self.assertRaises(ValueError):
            self.renderer.render('asset_path')

    @patch('src.components.renderer.get_browser_info')
    @patch('src.components.renderer.is_browser_supported')
    @patch('src.components.renderer.is_browser_version_supported')
    @patch('src.components.renderer.load_asset')
    def test_render_asset_not_found(self, mock_load_asset, mock_is_browser_version_supported, mock_is_browser_supported, mock_get_browser_info):
        mock_get_browser_info.return_value = {'name': 'Chrome', 'version': '90'}
        mock_is_browser_supported.return_value = True
        mock_is_browser_version_supported.return_value = True
        mock_load_asset.side_effect = FileNotFoundError('Asset not found')

        with self.assertRaises(FileNotFoundError):
            self.renderer.render('asset_path')

    @patch('src.components.renderer.get_browser_info')
    @patch('src.components.renderer.is_browser_supported')
    @patch('src.components.renderer.is_browser_version_supported')
    @patch('src.components.renderer.load_asset')
    def test_render_asset_path_empty(self, mock_load_asset, mock_is_browser_version_supported, mock_is_browser_supported, mock_get_browser_info):
        mock_get_browser_info.return_value = {'name': 'Chrome', 'version': '90'}
        mock_is_browser_supported.return_value = True
        mock_is_browser_version_supported.return_value = True
        mock_load_asset.return_value = b'asset_content'

        with self.assertRaises(FileNotFoundError):
            self.renderer.render('')

    @patch('src.components.renderer.get_browser_info')
    @patch('src.components.renderer.is_browser_supported')
    @patch('src.components.renderer.is_browser_version_supported')
    @patch('src.components.renderer.load_asset')
    def test_render_asset_path_none(self, mock_load_asset, mock_is_browser_version_supported, mock_is_browser_supported, mock_get_browser_info):
        mock_get_browser_info.return_value = {'name': 'Chrome', 'version': '90'}
        mock_is_browser_supported.return_value = True
        mock_is_browser_version_supported.return_value = True
        mock_load_asset.return_value = b'asset_content'

        with self.assertRaises(FileNotFoundError):
            self.renderer.render(None)

    def test_load_directory(self):
        result = self.renderer.load_directory('directory_path')

        self.assertIsInstance(result, list)

    def test_clear_cache(self):
        self.renderer.clear_cache()

    def test_get_supported_browsers(self):
        result = get_supported_browsers()

        self.assertIsInstance(result, list)

if __name__ == '__main__':
    unittest.main()

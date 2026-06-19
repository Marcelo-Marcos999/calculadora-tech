import unittest
from unittest.mock import patch
from pathlib import Path
from src.utils.file_loader import load_asset, load_directory

class TestFileLoader(unittest.TestCase):

    def test_load_asset(self):
        with patch('src.utils.file_loader.pathlib.Path') as mock_path:
            mock_path.return_value = Path('/path/to/asset.txt')
            mock_path.return_value.exists.return_value = True
            mock_path.return_value.is_file.return_value = True
            mock_path.return_value.read_text.return_value = 'Asset content'
            self.assertEqual(load_asset('/path/to/asset.txt'), 'Asset content')

    def test_load_asset_not_found(self):
        with patch('src.utils.file_loader.pathlib.Path') as mock_path:
            mock_path.return_value = Path('/path/to/asset.txt')
            mock_path.return_value.exists.return_value = False
            with self.assertRaises(FileNotFoundError):
                load_asset('/path/to/asset.txt')

    def test_load_asset_directory(self):
        with patch('src.utils.file_loader.pathlib.Path') as mock_path:
            mock_path.return_value = Path('/path/to/asset.txt')
            mock_path.return_value.exists.return_value = True
            mock_path.return_value.is_dir.return_value = True
            with self.assertRaises(ValueError):
                load_asset('/path/to/asset.txt')

    def test_load_asset_binary(self):
        with patch('src.utils.file_loader.pathlib.Path') as mock_path:
            mock_path.return_value = Path('/path/to/asset.jpg')
            mock_path.return_value.exists.return_value = True
            mock_path.return_value.is_file.return_value = True
            mock_path.return_value.read_bytes.return_value = b'Asset content'
            self.assertEqual(load_asset('/path/to/asset.jpg'), b'Asset content')

    def test_load_directory(self):
        with patch('src.utils.file_loader.pathlib.Path') as mock_path:
            mock_path.return_value = Path('/path/to/directory')
            mock_path.return_value.exists.return_value = True
            mock_path.return_value.is_dir.return_value = True
            mock_path.return_value.iterdir.return_value = [Path('/path/to/directory/file1.txt'), Path('/path/to/directory/file2.txt')]
            self.assertEqual(load_directory('/path/to/directory'), ['/path/to/directory/file1.txt', '/path/to/directory/file2.txt'])

    def test_load_directory_not_found(self):
        with patch('src.utils.file_loader.pathlib.Path') as mock_path:
            mock_path.return_value = Path('/path/to/directory')
            mock_path.return_value.exists.return_value = False
            with self.assertRaises(FileNotFoundError):
                load_directory('/path/to/directory')

    def test_load_directory_not_directory(self):
        with patch('src.utils.file_loader.pathlib.Path') as mock_path:
            mock_path.return_value = Path('/path/to/directory')
            mock_path.return_value.exists.return_value = True
            mock_path.return_value.is_dir.return_value = False
            with self.assertRaises(ValueError):
                load_directory('/path/to/directory')

if __name__ == '__main__':
    unittest.main()

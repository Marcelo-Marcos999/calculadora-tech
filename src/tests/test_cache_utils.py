import unittest
from unittest.mock import patch
from src.utils.cache_utils import cache_dir_path, cache_result, clear_cache

class TestCacheUtils(unittest.TestCase):

    def test_cache_dir_path(self):
        self.assertEqual(cache_dir_path(), os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'cache'))

    @patch('time.time')
    def test_cache_result(self, mock_time):
        mock_time.return_value = 1643723400
        @cache_result(ttl=60)
        def test_func():
            return 'test_result'
        self.assertEqual(test_func(), 'test_result')
        mock_time.return_value = 1643723401
        self.assertEqual(test_func(), 'test_result')

    def test_cache_result_expired(self):
        @cache_result(ttl=1)
        def test_func():
            return 'test_result'
        self.assertEqual(test_func(), 'test_result')
        time.sleep(2)
        self.assertEqual(test_func(), 'test_result')

    def test_clear_cache(self):
        cache_dir = cache_dir_path()
        with open(os.path.join(cache_dir, 'cache.pkl'), 'wb') as f:
            pickle.dump({'test_key': 'test_value'}, f)
        clear_cache()
        self.assertFalse(os.path.exists(os.path.join(cache_dir, 'cache.pkl')))

if __name__ == '__main__':
    unittest.main()

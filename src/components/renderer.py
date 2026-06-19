import os
import pathlib
from typing import Union, List
from src.utils.browser_compat import get_browser_info, is_browser_supported, is_browser_version_supported
from src.utils.cache_utils import cache_dir_path, cache_result, clear_cache
from src.utils.file_loader import load_asset, load_directory

class Renderer:
    def __init__(self):
        self.browser_info = get_browser_info()
        self.is_local = is_local_execution()

    @cache_result(ttl=60)
    def render(self, asset_path: str) -> Union[str, bytes]:
        if not is_browser_supported(self.browser_info['name'], get_supported_browsers()):
            raise ValueError(f"Browser {self.browser_info['name']} is not supported")

        if not is_browser_version_supported(self.browser_info['version'], '90'):
            raise ValueError(f"Browser version {self.browser_info['version']} is not supported")

        try:
            asset = load_asset(asset_path)
        except FileNotFoundError as e:
            raise FileNotFoundError(f"Asset not found: {asset_path}") from e

        return asset

    def load_directory(self, directory_path: str) -> List[str]:
        try:
            return load_directory(directory_path)
        except FileNotFoundError as e:
            raise FileNotFoundError(f"Directory not found: {directory_path}") from e

    def clear_cache(self):
        try:
            clear_cache()
        except Exception as e:
            raise Exception(f"Failed to clear cache: {e}")

def get_supported_browsers():
    return ['Chrome', 'Firefox', 'Safari', 'Edge']

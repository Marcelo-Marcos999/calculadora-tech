import os
import pathlib
from typing import Union, List

def load_asset(asset_path: str) -> Union[str, bytes]:
    """
    Loads an asset from the given path.

    Args:
    asset_path (str): The path to the asset.

    Returns:
    str or bytes: The loaded asset as a string or bytes object.
    """
    asset_path = pathlib.Path(asset_path)
    if not asset_path.exists():
        raise FileNotFoundError(f"Asset not found: {asset_path}")
    if asset_path.is_dir():
        raise ValueError(f"Asset path is a directory: {asset_path}")
    if asset_path.suffix in ['.jpg', '.png', '.gif', '.bmp']:
        with open(asset_path, 'rb') as file:
            return file.read()
    else:
        with open(asset_path, 'r') as file:
            return file.read()

def load_directory(directory_path: str) -> List[str]:
    """
    Loads all files in the given directory.

    Args:
    directory_path (str): The path to the directory.

    Returns:
    List[str]: A list of file paths.
    """
    directory_path = pathlib.Path(directory_path)
    if not directory_path.exists():
        raise FileNotFoundError(f"Directory not found: {directory_path}")
    if not directory_path.is_dir():
        raise ValueError(f"Path is not a directory: {directory_path}")
    return [str(file) for file in directory_path.iterdir() if file.is_file()]

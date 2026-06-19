import os
import pathlib
from typing import Union, List
from src.utils.file_loader import load_asset, load_directory

class FontLoader:
    @staticmethod
    def load_font(font_path: str) -> Union[str, bytes]:
        """
        Loads a font from the given path.

        Args:
        font_path (str): The path to the font.

        Returns:
        str or bytes: The loaded font as a string or bytes object.
        """
        return load_asset(font_path)

    @staticmethod
    def load_font_directory(directory_path: str) -> List[str]:
        """
        Loads all fonts in the given directory.

        Args:
        directory_path (str): The path to the directory.

        Returns:
        List[str]: A list of font paths.
        """
        return load_directory(directory_path)

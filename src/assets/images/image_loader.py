import os
import pathlib
from typing import Union, List
from src.utils.file_loader import load_asset, load_directory

class ImageLoader:
    @staticmethod
    def load_image(image_path: str) -> Union[str, bytes]:
        """
        Loads an image from the given path.

        Args:
        image_path (str): The path to the image.

        Returns:
        str or bytes: The loaded image as a string or bytes object.
        """
        return load_asset(image_path)

    @staticmethod
    def load_images(directory_path: str) -> List[str]:
        """
        Loads all images in the given directory.

        Args:
        directory_path (str): The path to the directory.

        Returns:
        List[str]: A list of image paths.
        """
        return load_directory(directory_path)

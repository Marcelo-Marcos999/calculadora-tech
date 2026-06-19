import sys
import platform

def get_browser_info():
    """
    Returns a dictionary containing information about the browser.
    
    Returns:
        dict: A dictionary containing the browser name, version, and platform.
    """
    browser_name = platform.system()
    browser_version = platform.release()
    return {
        'name': browser_name,
        'version': browser_version,
        'platform': platform.system()
    }

def is_local_execution():
    """
    Checks if the script is being executed locally.
    
    Returns:
        bool: True if the script is being executed locally, False otherwise.
    """
    return platform.system() not in ['Windows', 'Darwin']

def is_cache_enabled():
    """
    Checks if cache is enabled.
    
    Returns:
        bool: True if cache is enabled, False otherwise.
    """
    # This function should be implemented to check the actual cache settings
    return False

def is_optimization_enabled():
    """
    Checks if optimization is enabled.
    
    Returns:
        bool: True if optimization is enabled, False otherwise.
    """
    # This function should be implemented to check the actual optimization settings
    return False

def is_browser_version_supported(browser_version, min_supported_version):
    """
    Checks if the browser version is supported.
    
    Args:
        browser_version (str): The version of the browser.
        min_supported_version (str): The minimum supported version of the browser.
    
    Returns:
        bool: True if the browser version is supported, False otherwise.
    """
    try:
        browser_version = float(browser_version)
        min_supported_version = float(min_supported_version)
        return browser_version >= min_supported_version
    except ValueError:
        return False

def is_browser_supported(browser_name, supported_browsers):
    """
    Checks if the browser is supported.
    
    Args:
        browser_name (str): The name of the browser.
        supported_browsers (list): A list of supported browser names.
    
    Returns:
        bool: True if the browser is supported, False otherwise.
    """
    return browser_name in supported_browsers

def get_supported_browsers():
    """
    Returns a list of supported browser names.
    
    Returns:
        list: A list of supported browser names.
    """
    return ['Chrome', 'Firefox', 'Safari', 'Edge']

import os
import json
from src.utils.config import Config

def get_vercel_config():
    with open('src/config/vercel.json') as f:
        return json.load(f)

def update_build_command(vercel_config):
    vercel_config['builds'][0]['config']['buildCommand'] = 'npm run build -- --production'
    return vercel_config

def update_output_directory(vercel_config):
    vercel_config['builds'][0]['config']['outputDirectory'] = 'build'
    return vercel_config

def update_env_variables(vercel_config, config):
    vercel_config['env'] = config.get_config()
    return vercel_config

def update_routes(vercel_config):
    vercel_config['routes'] = [
        {
            "src": "/",
            "dest": "/index.html"
        }
    ]
    return vercel_config

def update_config(vercel_config, config):
    vercel_config = update_build_command(vercel_config)
    vercel_config = update_output_directory(vercel_config)
    vercel_config = update_env_variables(vercel_config, config)
    vercel_config = update_routes(vercel_config)
    return vercel_config

def save_vercel_config(vercel_config):
    with open('src/config/vercel.json', 'w') as f:
        json.dump(vercel_config, f, indent=4)

def deploy(config):
    vercel_config = get_vercel_config()
    vercel_config = update_config(vercel_config, config)
    save_vercel_config(vercel_config)
    print("Vercel configuration updated successfully.")

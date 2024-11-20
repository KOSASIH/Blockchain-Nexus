import json
import os

class Config:
    def __init__(self, config_file='config.json'):
        self.config_file = config_file
        self.config_data = self.load_config()

    def load_config(self):
        """Loads configuration from a JSON file."""
        if not os.path.exists(self.config_file):
            raise FileNotFoundError(f"Configuration file '{self.config_file}' not found.")
        
        with open(self.config_file, 'r') as file:
            return json.load(file)

    def get(self, key, default=None):
        """Retrieves a configuration value by key."""
        return self.config_data.get(key, default)

    def set(self, key, value):
        """Sets a configuration value by key."""
        self.config_data[key] = value
        self.save_config()

    def save_config(self):
        """Saves the current configuration back to the JSON file."""
        with open(self.config_file, 'w') as file:
            json.dump(self.config_data, file, indent=4)

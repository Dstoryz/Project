from django.conf import settings
from .models_config import MODEL_CONFIG
import torch
from diffusers import StableDiffusionPipeline
import logging

logger = logging.getLogger(__name__)

class ModelService:
    def __init__(self):
        self.loaded_models = {}
        self.default_model = "stable-diffusion-v1-5"
        
    def get_model(self, model_name=None):
        model_name = model_name or self.default_model
        
        if model_name not in self.loaded_models:
            self._load_model(model_name)
            
        return self.loaded_models[model_name]
    
    def _load_model(self, model_name):
        try:
            config = MODEL_CONFIG[model_name]
            model = StableDiffusionPipeline.from_pretrained(
                config["path"],
                torch_dtype=config["torch_dtype"],
                variant=config.get("variant"),
                use_safetensors=True
            )
            
            if torch.cuda.is_available():
                model = model.to("cuda")
                
            self.loaded_models[model_name] = model
            
        except Exception as e:
            logger.error(f"Error loading model {model_name}: {e}")
            raise
            
    def get_model_settings(self, model_name):
        return MODEL_CONFIG[model_name].get("default_settings", {})
        
    def cleanup_unused_models(self, max_models=2):
        """Выгружает неиспользуемые модели для экономии памяти"""
        if len(self.loaded_models) > max_models:
            # Оставляем только default_model и последнюю использованную модель
            models_to_unload = list(self.loaded_models.keys())[:-max_models]
            for model_name in models_to_unload:
                if model_name != self.default_model:
                    del self.loaded_models[model_name]
                    torch.cuda.empty_cache() 
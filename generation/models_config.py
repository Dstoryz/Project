import torch

MODEL_CONFIG = {
    "stable-diffusion-v1-5": {
        "path": "stable-diffusion-v1-5/stable-diffusion-v1-5",
        "torch_dtype": torch.float16,
        "variant": "fp16"
    },
    "stable-diffusion-2-1": {
        "path": "stabilityai/stable-diffusion-2-1",
        "torch_dtype": torch.float16,
        "variant": "fp16"
    },
    "openjourney-v4": {
        "path": "prompthero/openjourney-v4",
        "torch_dtype": torch.float16,
     },
}

#
# MODEL_CONFIG = {
#     "stable-diffusion-v1-5": {
#         "path": "stable-diffusion-v1-5/stable-diffusion-v1-5",
#         "torch_dtype": torch.float16,
#         "variant": "fp16",
#         "seed": -1,
#         "sampling_method": "DDIM",
#         "cfg_scale": 7.5,
#         "resolution": (512, 512),
#         "denoising_strength": 0.75,
#         "hires_fix": True,
#         "batch_size": 1,
#         "tiling": False,
#     },
#     "stable-diffusion-2-1": {
#         "path": "stabilityai/stable-diffusion-2-1",
#         "torch_dtype": torch.float16,
#         "variant": "fp16",
#         "seed": -1,
#         "sampling_method": "Euler",
#         "cfg_scale": 8.0,
#         "resolution": (512, 512),
#         "denoising_strength": 0.7,
#         "hires_fix": True,
#         "batch_size": 1,
#         "tiling": False,
#     },
#     "openjourney-v4": {
#         "path": "prompthero/openjourney-v4",
#         "torch_dtype": torch.float16,
#         "seed": -1,
#         "sampling_method": "LMS",
#         "cfg_scale": 9.0,
#         "resolution": (512, 512),
#         "denoising_strength": 0.8,
#         "hires_fix": True,
#         "batch_size": 1,
#         "tiling": False,
#     },
# }

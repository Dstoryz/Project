export const STYLE_OPTIONS = [
  { value: 'none', label: 'No Style' },
  { value: 'anime', label: 'Anime' },
  { value: 'digital-art', label: 'Digital Art' },
  { value: 'photographic', label: 'Photographic' },
  { value: 'cartoon', label: 'Cartoon' },
  { value: 'oil-painting', label: 'Oil Painting' },
  { value: 'watercolor', label: 'Watercolor' },
  { value: 'pixel-art', label: 'Pixel Art' }
];

export const MODEL_OPTIONS = [
  { 
    value: 'stable-diffusion-v1-5', 
    label: 'Stable Diffusion v1.5',
    description: 'Best for general purpose image generation'
  },
  { 
    value: 'stable-diffusion-2-1', 
    label: 'Stable Diffusion v2.1',
    description: 'Improved quality and coherence'
  },
  { 
    value: 'openjourney-v4', 
    label: 'OpenJourney v4',
    description: 'Specialized in artistic and creative styles'
  },
];

export const IMAGE_SIZES = [
  { value: '512x512', label: '512x512' },
  { value: '768x768', label: '768x768' },
  { value: '1024x1024', label: '1024x1024' },
];

export const QUALITY_PRESETS = [
  { value: 'draft', label: 'Draft', steps: 30, guidance: 7 },
  { value: 'normal', label: 'Normal', steps: 50, guidance: 7.5 },
  { value: 'quality', label: 'Quality', steps: 75, guidance: 8 },
  { value: 'max', label: 'Maximum', steps: 100, guidance: 8.5 },
]; 
export enum ArtStyle {
  NONE = 'None',
  VAN_GOGH = 'Van Gogh style, with bold brushstrokes and vibrant colors',
  FURRY = 'Furry art style, anthropomorphic animals with expressive features',
  PORTRAIT = 'Realistic portrait style, detailed and lifelike',
  CARTOON = 'Cartoon style, with bold outlines and simplified forms',
  WATERCOLOR = 'Watercolor painting style, with soft washes and fluid transitions',
  CYBERPUNK = 'Cyberpunk art style, futuristic cityscapes with neon lights and dark tones',
  IMPRESSIONISTIC = 'Impressionistic painting style, capturing light and atmosphere with visible brushstrokes',
  ABSTRACT = 'Abstract art style, non-representational forms and colors',
  STEAMPUNK = 'Steampunk art style, Victorian era industrial design with gears and brass',
  ANIME = 'Anime style, Japanese animation with exaggerated features and dynamic poses',
}

export interface GeneratedImage {
  url: string;
  alt: string;
}

export type MediaTags = {
  title?: string;
  artist?: string;
  album?: string;
  year?: string;
  genre?: string;
};

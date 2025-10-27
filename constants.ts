import { ArtStyle } from './types';

export const ART_STYLES: { label: string; value: ArtStyle }[] = [
  { label: 'None', value: ArtStyle.NONE },
  { label: 'Van Gogh', value: ArtStyle.VAN_GOGH },
  { label: 'Furry', value: ArtStyle.FURRY },
  { label: 'Portrait', value: ArtStyle.PORTRAIT },
  { label: 'Cartoon', value: ArtStyle.CARTOON },
  { label: 'Watercolor', value: ArtStyle.WATERCOLOR },
  { label: 'Cyberpunk', value: ArtStyle.CYBERPUNK },
  { label: 'Impressionistic', value: ArtStyle.IMPRESSIONISTIC },
  { label: 'Abstract', value: ArtStyle.ABSTRACT },
  { label: 'Steampunk', value: ArtStyle.STEAMPUNK },
  { label: 'Anime', value: ArtStyle.ANIME },
];

export const SLIDESHOW_INTERVAL_MS = 5000; // 5 seconds per slide
export const NUMBER_OF_SLIDES = 5; // Number of images to generate for the slideshow

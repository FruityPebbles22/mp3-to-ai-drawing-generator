import { GoogleGenAI } from '@google/genai';
import { GeneratedImage } from '../types';

// Declare the process.env object to avoid TypeScript errors if not already globally defined
declare var process: {
  env: {
    API_KEY: string;
  };
};

export const generateImages = async (
  basePrompt: string,
  style: string,
  count: number,
): Promise<GeneratedImage[]> => {
  if (!process.env.API_KEY) {
    throw new Error('API_KEY is not defined. Please ensure it is set as an environment variable.');
  }

  // Create a new GoogleGenAI instance right before making an API call
  // to ensure it always uses the most up-to-date API key from the dialog.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const images: GeneratedImage[] = [];
  const imagePrompts: string[] = [];

  // Generate varied prompts for more distinct images
  for (let i = 0; i < count; i++) {
    let specificPrompt = '';
    switch (i % 5) { // Cycle through a few variations
      case 0:
        specificPrompt = `A dynamic and vibrant scene illustrating the essence of "${basePrompt}".`;
        break;
      case 1:
        specificPrompt = `An emotional and expressive interpretation of the theme of "${basePrompt}".`;
        break;
      case 2:
        specificPrompt = `A surreal and dreamlike landscape inspired by the narrative of "${basePrompt}".`;
        break;
      case 3:
        specificPrompt = `A powerful abstract representation of the core feeling of "${basePrompt}".`;
        break;
      case 4:
        specificPrompt = `A character or creature embodying the mood and rhythm of "${basePrompt}".`;
        break;
    }
    imagePrompts.push(`${specificPrompt} ${style ? `, rendered in a ${style} style.` : ''}`);
  }

  // Use Promise.all to generate images concurrently
  const generationPromises = imagePrompts.map(async (prompt) => {
    try {
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001', // Using imagen-4.0-generate-001 for high-quality, stylistic images
        prompt: prompt,
        config: {
          numberOfImages: 1, // Generate one image per specific prompt
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9', // Landscape for slideshow
        },
      });

      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return {
        url: `data:image/jpeg;base64,${base64ImageBytes}`,
        alt: prompt,
      };
    } catch (error: any) {
      console.error(`Error generating image for prompt "${prompt}":`, error);
      // Check for specific API key related errors
      if (error.message && error.message.includes("Requested entity was not found.")) {
         // This typically means the API key is invalid or not correctly selected for the service.
         // In a real app, you might want to re-prompt the user to select an API key.
         throw new Error("API Key issue: Please ensure you have selected a valid API key for this service.");
      }
      return null; // Return null for failed generations to filter them out later
    }
  });

  const results = await Promise.all(generationPromises);
  results.forEach(result => {
    if (result) {
      images.push(result);
    }
  });

  if (images.length === 0 && count > 0) {
    throw new Error("No images could be generated. Please check your prompt or API key.");
  }

  return images;
};

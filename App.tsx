import React, { useState, useCallback, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import ArtStyleSelector from './components/ArtStyleSelector';
import ImageSlideshow from './components/ImageSlideshow';
import { ArtStyle, GeneratedImage, MediaTags } from './types';
import { generateImages } from './services/geminiService';
import { NUMBER_OF_SLIDES } from './constants';

declare var window: Window & {
  aistudio?: {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  };
};

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [mp3Title, setMp3Title] = useState<string | null>(null);
  const [selectedArtStyle, setSelectedArtStyle] = useState<ArtStyle>(ArtStyle.NONE);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);

  // Check API key status on mount
  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const keyStatus = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(keyStatus);
      } else {
        // Assume API key is available via process.env.API_KEY if aistudio methods are not present
        setHasApiKey(true);
      }
    };
    checkKey();
  }, []);

  const handleFileSelected = useCallback((file: File | null, tags: MediaTags | null) => {
    setSelectedFile(file);
    if (file) {
      setAudioUrl(URL.createObjectURL(file));
      setMp3Title(tags?.title || file.name.replace(/\.mp3$/i, '') || 'Untitled Song');
    } else {
      setAudioUrl(null);
      setMp3Title(null);
    }
    setGeneratedImages([]); // Clear previous images on new file selection
    setError(null);
  }, []);

  const handleStyleChange = useCallback((style: ArtStyle) => {
    setSelectedArtStyle(style);
  }, []);

  const handleSelectApiKey = useCallback(async () => {
    try {
      if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
        await window.aistudio.openSelectKey();
        setHasApiKey(true); // Assume success after opening dialog
        setError(null);
      } else {
        setError("API Key selection not available in this environment.");
      }
    } catch (err: any) {
      console.error("Error opening API key selection:", err);
      setError(`Failed to select API key: ${err.message || 'Unknown error'}`);
      setHasApiKey(false);
    }
  }, []);

  const handleGenerateSlideshow = useCallback(async () => {
    if (!selectedFile || !mp3Title) {
      setError("Please upload an MP3 file first.");
      return;
    }
    if (!hasApiKey) {
      setError("Please select an API key to generate images.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const images = await generateImages(mp3Title, selectedArtStyle, NUMBER_OF_SLIDES);
      setGeneratedImages(images);
    } catch (err: any) {
      console.error("Error generating slideshow:", err);
      if (err.message.includes("API Key issue") && window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
        setError(`${err.message} Please select your API key again.`);
        setHasApiKey(false); // Reset key status to prompt re-selection
      } else {
        setError(`Failed to generate slideshow: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile, mp3Title, selectedArtStyle, hasApiKey]); // Dependencies for useCallback

  return (
    <div className="container mx-auto p-6 bg-white rounded-xl shadow-2xl">
      <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-8 drop-shadow-md">
        MP3 to AI Drawing Slideshow
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg" role="alert">
          {error}
        </div>
      )}

      {!hasApiKey && (
        <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg flex items-center justify-between">
          <p>An API key is required for image generation.</p>
          <button
            onClick={handleSelectApiKey}
            className="px-6 py-2 bg-yellow-600 text-white font-semibold rounded-md hover:bg-yellow-700 transition-colors duration-300 shadow-lg"
            disabled={isLoading}
          >
            Select API Key
          </button>
        </div>
      )}

      <FileUpload
        onFileSelected={handleFileSelected}
        fileName={selectedFile?.name || null}
        fileTitle={mp3Title}
        isLoading={isLoading || !hasApiKey}
      />

      <ArtStyleSelector
        selectedStyle={selectedArtStyle}
        onStyleChange={handleStyleChange}
        isLoading={isLoading || !hasApiKey}
      />

      <button
        onClick={handleGenerateSlideshow}
        disabled={!selectedFile || !mp3Title || isLoading || !hasApiKey}
        className="w-full px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xl font-bold rounded-lg
                   hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 ease-in-out shadow-lg transform hover:scale-105
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 mb-8"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Slideshow...
          </div>
        ) : (
          'Generate AI Drawing Slideshow'
        )}
      </button>

      <ImageSlideshow images={generatedImages} audioUrl={audioUrl} />
    </div>
  );
};

export default App;
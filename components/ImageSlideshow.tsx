import React, { useState, useEffect, useRef } from 'react';
import { GeneratedImage } from '../types';
import { SLIDESHOW_INTERVAL_MS } from '../constants';

interface ImageSlideshowProps {
  images: GeneratedImage[];
  audioUrl: string | null;
}

const ImageSlideshow: React.FC<ImageSlideshowProps> = ({ images, audioUrl }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, SLIDESHOW_INTERVAL_MS);
      return () => clearInterval(interval);
    }
  }, [images]);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.load(); // Reload the audio element to play the new source
      audioRef.current.play().catch(e => console.error("Error playing audio:", e));
    }
  }, [audioUrl]);

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg shadow-md mt-8">
        <p className="text-xl text-gray-600 font-semibold mb-4">No slideshow generated yet.</p>
        <p className="text-gray-500">Upload an MP3 and select an art style to begin!</p>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-xl aspect-video bg-gray-200">
      <img
        src={currentImage.url}
        alt={currentImage.alt}
        className="w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
        style={{ opacity: 1 }} // Always 1 for the current image
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white text-center">
        <p className="text-lg font-semibold">{currentImage.alt}</p>
        <p className="text-sm opacity-80 mt-1">{`Slide ${currentIndex + 1} of ${images.length}`}</p>
      </div>

      {audioUrl && (
        <audio ref={audioRef} controls loop className="w-full mt-4 bg-gray-800 rounded-b-lg">
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default ImageSlideshow;
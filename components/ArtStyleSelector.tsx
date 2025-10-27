import React from 'react';
import { ArtStyle } from '../types';
import { ART_STYLES } from '../constants';

interface ArtStyleSelectorProps {
  selectedStyle: ArtStyle;
  onStyleChange: (style: ArtStyle) => void;
  isLoading: boolean;
}

const ArtStyleSelector: React.FC<ArtStyleSelectorProps> = ({ selectedStyle, onStyleChange, isLoading }) => {
  return (
    <div className="mb-6 p-4 border border-purple-200 rounded-lg bg-purple-50 shadow-inner">
      <label htmlFor="art-style-select" className="block text-lg font-semibold text-purple-800 mb-2">
        Choose Art Style
      </label>
      <select
        id="art-style-select"
        value={selectedStyle}
        onChange={(e) => onStyleChange(e.target.value as ArtStyle)}
        disabled={isLoading}
        className="block w-full p-3 border border-purple-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500
                   bg-white text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {ART_STYLES.map((styleOption) => (
          <option key={styleOption.value} value={styleOption.value}>
            {styleOption.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ArtStyleSelector;
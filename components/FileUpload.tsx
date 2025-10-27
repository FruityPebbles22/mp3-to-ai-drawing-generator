import React from 'react';
import { MediaTags } from '../types';

interface FileUploadProps {
  onFileSelected: (file: File | null, tags: MediaTags | null) => void;
  fileName: string | null;
  fileTitle: string | null;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected, fileName, fileTitle, isLoading }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      // Use the global `jsmediatags` object
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      jsmediatags.read(file, {
        onSuccess: (tag: { tags: MediaTags }) => {
          onFileSelected(file, tag.tags);
        },
        onError: (error: Error) => {
          console.error("Error reading MP3 tags:", error);
          onFileSelected(file, null); // Still pass the file even if tags fail
        },
      });
    } else {
      onFileSelected(null, null);
    }
  };

  return (
    <div className="mb-6 p-4 border border-indigo-200 rounded-lg bg-indigo-50 shadow-inner">
      <label htmlFor="mp3-upload" className="block text-lg font-semibold text-indigo-800 mb-2">
        Upload MP3 File
      </label>
      <input
        id="mp3-upload"
        type="file"
        accept="audio/mpeg"
        onChange={handleFileChange}
        disabled={isLoading}
        className="block w-full text-sm text-gray-700
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-indigo-500 file:text-white
                   hover:file:bg-indigo-600
                   disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {fileName && (
        <p className="mt-3 text-sm text-gray-600">
          Selected: <span className="font-medium text-indigo-700">{fileName}</span>
        </p>
      )}
      {fileTitle && (
        <p className="mt-1 text-sm text-gray-600">
          Detected Title: <span className="font-medium text-indigo-700">{fileTitle}</span>
        </p>
      )}
      {!fileName && !isLoading && (
         <p className="mt-3 text-sm text-red-500">
            Please upload an MP3 file to get started.
         </p>
      )}
    </div>
  );
};

export default FileUpload;
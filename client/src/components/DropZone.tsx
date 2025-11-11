import React, { useCallback, useState } from 'react';
import { isValidImageFile } from '../utils/imageProcessing';

interface DropZoneProps {
  onImageSelect: (file: File) => void;
  disabled?: boolean;
}

const DropZone: React.FC<DropZoneProps> = ({ onImageSelect, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (isValidImageFile(file)) {
          onImageSelect(file);
        } else {
          alert('Please upload a valid image file (JPEG, PNG, or WebP)');
        }
      }
    },
    [onImageSelect, disabled]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;

      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (isValidImageFile(file)) {
          onImageSelect(file);
        } else {
          alert('Please upload a valid image file (JPEG, PNG, or WebP)');
        }
      }
    },
    [onImageSelect, disabled]
  );

  return (
    <div
      onDrag={handleDrag}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`
        relative border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300
        ${isDragging ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 scale-105 shadow-xl' : 'border-gray-300 bg-gradient-to-br from-gray-50 to-slate-50'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 cursor-pointer hover:shadow-lg'}
      `}
    >
      <input
        type="file"
        id="fileInput"
        className="hidden"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileInput}
        disabled={disabled}
      />

      <label
        htmlFor="fileInput"
        className={`cursor-pointer ${disabled ? 'cursor-not-allowed' : ''}`}
      >
        <div className="flex flex-col items-center space-y-6">
          {/* Icon with gradient background */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-xl opacity-50"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-xl">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
          </div>

          <div>
            <p className="text-2xl font-bold text-gray-800 mb-2">
              {isDragging ? 'Drop it here!' : 'Drop your image here'}
            </p>
            <p className="text-base text-gray-600">
              atau <span className="text-blue-600 font-semibold">klik untuk memilih</span>
            </p>
          </div>

          <div className="flex gap-2 flex-wrap justify-center">
            <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-600 border border-gray-200 shadow-sm">
              📸 JPEG
            </span>
            <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-600 border border-gray-200 shadow-sm">
              🖼️ PNG
            </span>
            <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-600 border border-gray-200 shadow-sm">
              ✨ WebP
            </span>
          </div>
        </div>
      </label>
    </div>
  );
};

export default DropZone;

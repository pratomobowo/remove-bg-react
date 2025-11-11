import React from 'react';

interface ImagePreviewProps {
  originalImage: string | null;
  processedImage: string | null;
  backgroundColor: string;
  isProcessing: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  originalImage,
  processedImage,
  backgroundColor,
  isProcessing,
}) => {
  if (!originalImage) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {/* Original Image */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">Original</h3>
        <div className="rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
          <img
            src={originalImage}
            alt="Original"
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Processed Image */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">
          {isProcessing ? 'Processing...' : 'Result'}
        </h3>
        <div
          className="rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 relative"
          style={{
            backgroundColor: backgroundColor === 'transparent' ? '#f0f0f0' : backgroundColor,
            backgroundImage: backgroundColor === 'transparent'
              ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
              : 'none',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          }}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : processedImage ? (
            <img
              src={processedImage}
              alt="Processed"
              className="w-full h-auto"
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <p>Click "Remove Background" to start</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;

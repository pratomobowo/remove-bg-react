import { useState, useEffect } from 'react';
import DropZone from './components/DropZone';
import ImagePreview from './components/ImagePreview';
import ColorSelector from './components/ColorSelector';
import LoadingScreen from './components/LoadingScreen';
import ConfirmModal from './components/ConfirmModal';
import {
  removeImageBackground,
  fileToBase64,
  applyBackgroundColor,
  downloadImage,
  ProgressInfo,
} from './utils/imageProcessing';
import { ProcessingStatus } from './types';

function App() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [transparentImage, setTransparentImage] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>('transparent');
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<ProgressInfo | undefined>(undefined);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  // Apply background color when it changes
  useEffect(() => {
    if (transparentImage && backgroundColor) {
      applyBackgroundColor(transparentImage, backgroundColor)
        .then(setProcessedImage)
        .catch((error) => {
          console.error('Error applying background color:', error);
        });
    }
  }, [backgroundColor, transparentImage]);

  const handleImageSelect = async (file: File) => {
    setSelectedFile(file);
    setStatus('uploading');
    setProcessedImage(null);
    setTransparentImage(null);

    try {
      const base64 = await fileToBase64(file);
      setOriginalImage(base64);
      setStatus('idle');
    } catch (error) {
      console.error('Error reading file:', error);
      setStatus('error');
      alert('Failed to read image file');
    }
  };

  const handleRemoveBackground = () => {
    if (!selectedFile) return;
    setShowConfirmModal(true);
  };

  const handleConfirmRemoval = async () => {
    setShowConfirmModal(false);

    if (!selectedFile) return;

    setStatus('processing');
    setProgress(undefined);

    try {
      const blob = await removeImageBackground(selectedFile, (progressInfo) => {
        setProgress(progressInfo);
      });

      const url = URL.createObjectURL(blob);
      setTransparentImage(url);

      // Apply current background color
      const finalImage = await applyBackgroundColor(url, backgroundColor);
      setProcessedImage(finalImage);

      setStatus('completed');
      setProgress(undefined);
    } catch (error) {
      console.error('Error processing image:', error);
      setStatus('error');
      setProgress(undefined);
      alert('Failed to remove background. Please try again.');
    }
  };

  const handleCancelRemoval = () => {
    setShowConfirmModal(false);
  };

  const handleDownload = () => {
    if (!processedImage) return;

    const filename = `removed-bg-${Date.now()}.png`;
    downloadImage(processedImage, filename);
  };

  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setTransparentImage(null);
    setSelectedFile(null);
    setBackgroundColor('transparent');
    setStatus('idle');
  };

  const isProcessing = status === 'processing' || status === 'uploading';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onConfirm={handleConfirmRemoval}
        onCancel={handleCancelRemoval}
      />

      {/* Loading Screen */}
      {isProcessing && <LoadingScreen progress={progress} />}

      {/* Simple Modern Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                BG-REMOVER
              </h1>
              <p className="text-blue-100 text-sm">Remove background from photos with AI</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-6xl">

        {/* Main Content */}
        <div className="space-y-8">
          {/* Upload Section */}
          {!originalImage && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Your Photo</h2>
                  <p className="text-gray-600">Drag & drop or click to select image</p>
                </div>
                <DropZone onImageSelect={handleImageSelect} disabled={isProcessing} />
              </div>
            </div>
          )}

          {/* Image Preview */}
          {originalImage && (
            <>
              <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100">
                <ImagePreview
                  originalImage={originalImage}
                  processedImage={processedImage}
                  backgroundColor={backgroundColor}
                  isProcessing={isProcessing}
                />
              </div>

              {/* Controls */}
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Color Selector - Only show after background removal */}
                {processedImage && (
                  <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100">
                    <ColorSelector
                      selectedColor={backgroundColor}
                      onColorChange={setBackgroundColor}
                      disabled={isProcessing}
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center">
                  {!processedImage && (
                    <button
                      onClick={handleRemoveBackground}
                      disabled={isProcessing}
                      className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:scale-105 transform"
                    >
                      {isProcessing ? (
                        <span className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Processing...</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                          </svg>
                          <span>Remove Background</span>
                        </span>
                      )}
                    </button>
                  )}

                  {processedImage && (
                    <>
                      <button
                        onClick={handleDownload}
                        disabled={isProcessing}
                        className="px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:scale-105 transform"
                      >
                        <span className="flex items-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          <span>Download Image</span>
                        </span>
                      </button>

                      <button
                        onClick={handleReset}
                        disabled={isProcessing}
                        className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:scale-105 transform"
                      >
                        <span className="flex items-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          <span>Upload New Image</span>
                        </span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-20 pb-12">
          <div className="inline-block px-6 py-3 bg-white rounded-full shadow-lg border border-gray-100">
            <p className="text-gray-600 text-sm font-medium">
              Aplikasi ini dibuat dengan <span className="text-red-500">❤️</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;

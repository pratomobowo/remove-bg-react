import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  message?: string;
  progress?: {
    key: string;
    current: number;
    total: number;
  };
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress }) => {
  const [smoothProgress, setSmoothProgress] = useState(0);
  const targetPercentage = progress
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  // Smooth progress animation
  useEffect(() => {
    // Start from 0 and smoothly increment
    const startProgress = smoothProgress;
    const diff = targetPercentage - startProgress;

    if (diff === 0) return;

    const duration = 1000; // 1 second for smooth transition
    const steps = 20;
    const increment = diff / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;

      if (currentStep >= steps) {
        setSmoothProgress(targetPercentage);
        clearInterval(timer);
      } else {
        setSmoothProgress(prev => Math.min(100, prev + increment));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [targetPercentage]);

  // Auto-increment to simulate realistic loading when no real progress
  useEffect(() => {
    if (!progress) {
      // Simulate progress from 0 to 90% in steps
      const phases = [
        { target: 30, duration: 1000 },
        { target: 60, duration: 2000 },
        { target: 85, duration: 2000 },
      ];

      let currentPhase = 0;

      const runPhase = () => {
        if (currentPhase >= phases.length) return;

        const phase = phases[currentPhase];
        const steps = 20;
        const increment = (phase.target - smoothProgress) / steps;
        const stepDuration = phase.duration / steps;

        let step = 0;
        const timer = setInterval(() => {
          step++;
          if (step >= steps) {
            clearInterval(timer);
            currentPhase++;
            setTimeout(runPhase, 100);
          } else {
            setSmoothProgress(prev => Math.min(phase.target, prev + increment));
          }
        }, stepDuration);
      };

      runPhase();
    }
  }, []);

  const getLoadingMessage = () => {
    if (progress) {
      // Map progress key to specific phase messages
      const phaseMessages: Record<string, string> = {
        'upload': 'Mengupload gambar...',
        'model_loading': 'Memuat model AI...',
        'inference': 'Memproses dengan AI...',
        'post_processing': 'Menyempurnakan hasil...',
        'completed': 'Selesai!',
      };
      return phaseMessages[progress.key] || 'Memproses...';
    }

    // Fallback to percentage-based messages when no real progress
    if (smoothProgress < 30) return 'Memulai proses...';
    if (smoothProgress < 60) return 'Menganalisis gambar...';
    if (smoothProgress < 85) return 'Memproses dengan AI...';
    return 'Hampir selesai...';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="flex flex-col items-center space-y-6">
          {/* Animated Logo/Icon */}
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-blue-500"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Loading Message */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-gray-800">
              {getLoadingMessage()}
            </h3>
            <p className="text-sm text-gray-500">
              Please wait, this may take a moment...
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.round(smoothProgress)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>{Math.round(smoothProgress)}%</span>
              <span>Processing...</span>
            </div>
          </div>

          {/* Loading Animation Dots */}
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

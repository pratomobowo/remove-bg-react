/**
 * Get API base URL from environment or construct from current window location
 * In development: uses http://localhost:3001/api (proxied by Vite)
 * In production: uses /api (relative path to same domain) or full URL from env
 */
const getApiBaseUrl = (): string => {
  // Check if VITE_API_URL is set in environment
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl;
  }

  // In development, use localhost:3001 (Vite proxy)
  if (import.meta.env.DEV) {
    return 'http://localhost:3001/api';
  }

  // In production, use relative path (same domain)
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

export interface ProgressInfo {
  key: string;
  current: number;
  total: number;
}

/**
 * Remove background from image using server-side API
 */
export async function removeImageBackground(
  imageFile: File,
  onProgress?: (progress: ProgressInfo) => void
): Promise<Blob> {
  try {
    console.log('Uploading image to server for processing...');

    const formData = new FormData();
    formData.append('image', imageFile);

    // Simulate realistic phases while waiting for server response
    const phases = [
      { name: 'upload', duration: 500 },
      { name: 'model_loading', duration: 800 },
      { name: 'inference', duration: 3000 },
      { name: 'post_processing', duration: 800 },
    ];

    const phaseTimers: NodeJS.Timeout[] = [];

    // Start simulating phases
    const startPhaseSimulation = () => {
      let elapsedTime = 0;
      let phaseIndex = 0;

      const progressInterval = setInterval(() => {
        if (phaseIndex >= phases.length) {
          clearInterval(progressInterval);
          return;
        }

        const phase = phases[phaseIndex];
        const phaseSteps = 20;

        elapsedTime += 50; // Simulate every 50ms
        const phaseProgress = Math.min(
          phaseSteps,
          Math.floor((elapsedTime / phase.duration) * phaseSteps)
        );

        if (onProgress) {
          onProgress({
            key: phase.name,
            current: phaseProgress,
            total: phaseSteps,
          });
        }

        if (elapsedTime >= phase.duration) {
          elapsedTime = 0;
          phaseIndex++;
        }
      }, 50);

      phaseTimers.push(progressInterval);
    };

    // Start phase simulation in background
    startPhaseSimulation();

    const response = await fetch(`${API_BASE_URL}/remove-background`, {
      method: 'POST',
      body: formData,
    });

    // Clear phase timers
    phaseTimers.forEach(timer => clearInterval(timer));

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || 'Failed to remove background');
    }

    // Send completion progress
    if (onProgress) {
      onProgress({ key: 'completed', current: 100, total: 100 });
    }

    const blob = await response.blob();
    console.log('Background removal completed successfully');
    return blob;
  } catch (error) {
    console.error('Error removing background:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to remove background: ${error.message}`);
    }
    throw new Error('Failed to remove background');
  }
}

/**
 * Convert File to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Apply background color to transparent image
 */
export function applyBackgroundColor(
  imageUrl: string,
  backgroundColor: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      // Fill background with color (skip if transparent)
      if (backgroundColor !== 'transparent') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw image on top
      ctx.drawImage(img, 0, 0);

      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}

/**
 * Download image as file
 */
export function downloadImage(dataUrl: string, filename: string = 'image.png') {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Validate if file is an image
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return validTypes.includes(file.type);
}

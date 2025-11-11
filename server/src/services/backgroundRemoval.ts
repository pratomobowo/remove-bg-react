import { removeBackground } from '@imgly/background-removal-node';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface ProcessImageOptions {
  backgroundColor?: string;
}

/**
 * Remove background from image buffer
 */
export async function removeImageBackground(
  imageBuffer: Buffer
): Promise<Buffer> {
  try {
    console.log('Starting background removal on server...');

    // Convert buffer to PNG format using Sharp (ensure compatibility)
    const pngBuffer = await sharp(imageBuffer)
      .png()
      .toBuffer();

    // Convert Buffer to Blob
    const imageBlob = new Blob([pngBuffer], { type: 'image/png' });

    // Find the correct path to resources and convert to file:// URI
    const resourcesPath = path.join(__dirname, '../../../node_modules/@imgly/background-removal-node/dist');
    const resourcesUri = `file://${resourcesPath}/`;

    console.log('Using resources path:', resourcesUri);
    console.log('Processing image blob, size:', imageBlob.size);

    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Background removal timeout')), 30000);
    });

    const resultBlob = await Promise.race([
      removeBackground(imageBlob, {
        publicPath: resourcesUri,
        model: 'small', // Use small model for faster processing
      }),
      timeoutPromise
    ]) as Blob;

    const arrayBuffer = await resultBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log('Background removal completed');
    return buffer;
  } catch (error) {
    console.error('Error removing background:', error);
    if (error instanceof Error && error.message.includes('timeout')) {
      throw new Error('Background removal timed out - please try again');
    }
    throw new Error(`Failed to remove background: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Apply background color to transparent image
 */
export async function applyBackgroundColor(
  transparentImageBuffer: Buffer,
  backgroundColor: string
): Promise<Buffer> {
  try {
    if (backgroundColor === 'transparent') {
      return transparentImageBuffer;
    }

    // Parse hex color to RGB
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Get image metadata
    const metadata = await sharp(transparentImageBuffer).metadata();

    // Create a background with the specified color
    const background = sharp({
      create: {
        width: metadata.width!,
        height: metadata.height!,
        channels: 4,
        background: { r, g, b, alpha: 1 }
      }
    });

    // Composite the transparent image on top of the colored background
    const result = await background
      .composite([{ input: transparentImageBuffer }])
      .png()
      .toBuffer();

    return result;
  } catch (error) {
    console.error('Error applying background color:', error);
    throw new Error('Failed to apply background color');
  }
}

/**
 * Process image: remove background and optionally apply color
 */
export async function processImage(
  imageBuffer: Buffer,
  options: ProcessImageOptions = {}
): Promise<Buffer> {
  try {
    // Remove background
    const transparentImage = await removeImageBackground(imageBuffer);

    // Apply background color if specified
    if (options.backgroundColor) {
      return await applyBackgroundColor(
        transparentImage,
        options.backgroundColor
      );
    }

    return transparentImage;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}

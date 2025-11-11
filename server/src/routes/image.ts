import express, { Request, Response } from 'express';
import multer from 'multer';
import { processImage, removeImageBackground, applyBackgroundColor } from '../services/backgroundRemoval.js';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  },
});

/**
 * POST /api/remove-background
 * Remove background from uploaded image
 */
router.post('/remove-background', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    console.log(`Processing image: ${req.file.originalname}, size: ${req.file.size} bytes`);

    // Remove background
    const resultBuffer = await removeImageBackground(req.file.buffer);

    // Send back as PNG
    res.set('Content-Type', 'image/png');
    res.send(resultBuffer);
  } catch (error) {
    console.error('Error in /remove-background:', error);
    res.status(500).json({
      error: 'Failed to process image',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/apply-background
 * Apply background color to transparent image
 */
router.post('/apply-background', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const backgroundColor = req.body.backgroundColor || 'transparent';

    console.log(`Applying background color: ${backgroundColor}`);

    // Apply background color
    const resultBuffer = await applyBackgroundColor(req.file.buffer, backgroundColor);

    // Send back as PNG
    res.set('Content-Type', 'image/png');
    res.send(resultBuffer);
  } catch (error) {
    console.error('Error in /apply-background:', error);
    res.status(500).json({
      error: 'Failed to apply background color',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/process-image
 * Remove background and optionally apply color in one request
 */
router.post('/process-image', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const backgroundColor = req.body.backgroundColor;

    console.log(`Processing image with background: ${backgroundColor || 'transparent'}`);

    // Process image
    const resultBuffer = await processImage(req.file.buffer, {
      backgroundColor: backgroundColor || 'transparent'
    });

    // Send back as PNG
    res.set('Content-Type', 'image/png');
    res.send(resultBuffer);
  } catch (error) {
    console.error('Error in /process-image:', error);
    res.status(500).json({
      error: 'Failed to process image',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;

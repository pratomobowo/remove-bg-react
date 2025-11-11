import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import imageRoutes from './routes/image.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve client static files in production
const clientDistPath = path.join(__dirname, '../../client/dist');
console.log('Client dist path:', clientDistPath);

// Check if client dist exists before serving static files
import { existsSync } from 'fs';
if (existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  console.log('Serving static files from:', clientDistPath);
} else {
  console.warn('Client dist directory not found:', clientDistPath);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Routes
app.use('/api', imageRoutes);

// Fallback to index.html for React Router (SPA)
app.get('*', (req, res) => {
  const indexPath = path.join(clientDistPath, 'index.html');
  if (existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'Client application not found' });
  }
});

// Start server - listen on all interfaces (0.0.0.0) for Docker/container compatibility
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📸 Image processing API available at http://localhost:${PORT}/api`);
});

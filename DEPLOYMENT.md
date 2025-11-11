# Deployment Guide - Remove Background React App

## Overview
This is a full-stack application with a React client and Node.js/Express server. Both are containerized and deployed together.

## Prerequisites

### Local Development
- Node.js 20+
- npm 10+
- For testing: `npm run dev` (runs both client and server)

### Production Deployment
- Docker container runtime
- Port 3001 available
- Sufficient memory for Node.js process (recommended: 512MB+)

## Deployment to Coolify

### 1. Repository Setup
- Push code to GitHub: `https://github.com/pratomobowo/remove-bg-react.git`
- Ensure Dockerfile is in repository root

### 2. Coolify Configuration

#### Application Settings
- **Source**: GitHub repository URL
- **Branch**: `main` (or your preferred branch)
- **Dockerfile**: Select "Dockerfile" from root directory
- **Port**: 3001
- **Build Command**: Leave empty (uses Dockerfile)
- **Start Command**: Leave empty (uses Dockerfile)

#### Environment Variables
In Coolify dashboard, set:

```bash
# Server port (optional, defaults to 3001)
PORT=3001
```

**Optional Environment Variables:**
```bash
# Custom API URL (only if API is on different domain)
# VITE_API_URL=https://your-api-domain.com
```

### 3. Deployment Steps

1. **Connect Repository**
   - Add GitHub repository to Coolify
   - Select branch (main)
   - Authenticate with GitHub

2. **Configure Docker Build**
   - Dockerfile path: `Dockerfile` (from root)
   - Build context: `.` (root directory)

3. **Set Port Mapping**
   - Container port: 3001
   - External port: 3001 (or your preferred port)
   - Protocol: HTTP

4. **Deploy**
   - Click "Deploy"
   - Monitor build logs
   - Application should be available at: `https://your-domain.coolify:3001`

### 4. Domain/URL Configuration

After deployment, configure your domain:

1. **Coolify Domain Settings**
   - Add domain in Coolify application settings
   - Example: `remove-bg.yourdomain.com`
   - Enable HTTPS (automatic with Let's Encrypt)

2. **DNS Configuration**
   - Point your domain to Coolify server IP
   - Wait for DNS propagation (5-30 minutes)

## Architecture

### What Happens During Deployment

```
GitHub Repository
        ↓
   Dockerfile (Multi-stage build)
        ↓
   Build Stage 1: Build client and server
   ├─ Install dependencies
   ├─ Build React client → dist/
   └─ Build Express server → dist/
        ↓
   Build Stage 2: Production runtime
   ├─ Copy runtime files only
   ├─ Serve client from Express static middleware
   └─ API routes at /api/*
        ↓
   Container starts Node.js server on port 3001
```

### How It Works

1. **Client Build** (Vite)
   - React app compiled to static HTML/CSS/JS
   - Placed in `client/dist/`

2. **Server Build** (TypeScript)
   - Express server compiled to JavaScript
   - Placed in `server/dist/`

3. **Runtime**
   - Express server serves static files from client
   - API routes available at `/api/`
   - React handles client-side routing

### API Communication

- **Development**: Client proxies to `http://localhost:3001` (configured in Vite)
- **Production**: Client uses relative path `/api` (same domain)

This means:
- No CORS issues in production
- Single domain for both frontend and backend
- Better performance (no cross-origin requests)

## File Structure

```
remove-bg/
├── Dockerfile              # Multi-stage production build
├── .env.example           # Environment variables template
├── DEPLOYMENT.md          # This file
├── client/
│   ├── src/               # React source
│   ├── dist/              # Built client (created during build)
│   ├── package.json
│   └── tsconfig.json
├── server/
│   ├── src/               # Express server source
│   ├── dist/              # Built server (created during build)
│   ├── package.json
│   └── tsconfig.json
└── package.json           # Root workspace config
```

## Troubleshooting

### "No available server" Error

**Cause**: API requests are failing to reach the server.

**Solutions**:

1. **Check Port Mapping**
   ```bash
   # Verify port 3001 is exposed
   # In Coolify: Settings → Port Mapping → Check 3001
   ```

2. **Check Environment Variables**
   ```bash
   # Ensure PORT is set correctly (or use default 3001)
   # In Coolify: Settings → Environment Variables
   ```

3. **Verify API URL**
   - In production, client should use relative path `/api`
   - Not hardcoded `http://localhost:3001`
   - Check `client/src/utils/imageProcessing.ts`

4. **Check Server Logs**
   - In Coolify dashboard, view application logs
   - Look for errors starting the Node.js server

5. **Test Health Endpoint**
   ```bash
   # Try accessing the health endpoint
   curl https://your-domain.coolify:3001/api/health
   ```

### Build Fails

**Check build logs** in Coolify:
- TypeScript compilation errors
- Missing dependencies
- Disk space issues

**Common fixes**:
- Clear build cache and rebuild
- Ensure all required dependencies in package.json
- Check Node.js version (requires 20+)

### Slow Image Processing

**Causes**:
- Large image files
- Server insufficient memory
- Model loading overhead

**Solutions**:
- Allocate more memory to container
- Limit image file size (default 10MB)
- Use smaller AI model (already using 'small')

## Performance Optimization

### Memory Usage
- Default: ~200-300MB at idle
- Peak during processing: ~500-800MB
- Coolify recommendation: 1GB allocation

### Image Processing Limits
- Max file size: 10MB
- Supported formats: JPEG, PNG, WebP
- Processing time: 5-15 seconds per image

### Scaling
For high-traffic scenarios:
- Increase container memory
- Use Coolify's replication/scaling features
- Consider separate API server for processing-heavy tasks

## Monitoring

### Health Check
Coolify provides automated health checks:
- Endpoint: `/api/health`
- Interval: 30 seconds
- Timeout: 10 seconds
- Retries: 3

### Logs
Monitor application logs in Coolify dashboard:
- Build logs: View build process
- Runtime logs: View server output
- Error logs: Diagnose issues

## Updates & Redeployment

To update your application:

1. **Push changes to GitHub**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **In Coolify**
   - Dashboard shows new commits available
   - Click "Redeploy" or "Deploy"
   - Wait for build and deployment to complete

## Security Notes

1. **HTTPS**: Enabled automatically via Coolify + Let's Encrypt
2. **CORS**: Configured to allow all origins in development (can be restricted in production)
3. **File Upload**: Limited to 10MB and image files only
4. **Environment Variables**: Use Coolify's secure variable storage (not in .env)

## Support & Issues

If you encounter deployment issues:

1. Check application logs in Coolify
2. Verify Docker image builds locally: `docker build -t remove-bg .`
3. Test server locally: `npm run dev`
4. Review this deployment guide
5. Check GitHub repository issues

## Additional Resources

- [Coolify Documentation](https://coolify.io/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Express.js Documentation](https://expressjs.com/)
- [Vite Documentation](https://vitejs.dev/)

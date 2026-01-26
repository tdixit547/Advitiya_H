# Smart Link Hub - Frontend Deployment

## Prerequisites
- Node.js 18+ 
- npm or yarn

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

## Deployment Steps

### For Vercel (Recommended)
1. Push this folder to a Git repository
2. Connect to Vercel
3. Set environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy

### For Other Platforms
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

## Build Output
The build creates an optimized production bundle in `.next/` folder.

### Static Export (Optional)
If you need static files:
```bash
npm run build
# Output will be in 'out/' folder
```

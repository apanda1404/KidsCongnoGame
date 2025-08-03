# Kids Educational Games - Local Setup Guide

## Prerequisites

Before running this application locally, make sure you have the following installed:

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - Check if installed: `node --version`

2. **npm** (comes with Node.js)
   - Check if installed: `npm --version`

## Installation Steps

### 1. Extract and Navigate to Project
```bash
# Extract the downloaded files to a folder
# Navigate to the project directory
cd your-project-folder-name
```

### 2. Install Dependencies
```bash
# Install all required packages
npm install
```

### 3. Environment Setup (Optional)
The app works without a database in local mode, but if you want full functionality:

Create a `.env` file in the root directory:
```bash
# Database (optional - app works without it)
DATABASE_URL="your-postgresql-url-here"
NODE_ENV="development"
```

### 4. Start the Application
```bash
# Start both the server and client
npm run dev
```

This will:
- Start the Express server on port 5000
- Start the Vite development server for the React client
- Automatically open your browser to the application

### 5. Access the Application
Once running, open your browser and go to:
```
http://localhost:5173
```

The educational games should load with all 6 games available.

## Available Games

1. **Shape Sorting** - Match shapes with their homes
2. **Count & Fun** - Count cute animals
3. **Color Match** - Find matching colors
4. **Pattern Fun** - Complete visual patterns
5. **Memory Game** - Remember and match pairs
6. **Match Pairs** - Find items that go together

## Features

- 6 educational games for kids ages 3-5
- Progressive difficulty levels
- Background music with 4 different styles
- Fullscreen mode support
- Mobile-friendly responsive design
- Game progress tracking (saved locally)

## Troubleshooting

### Common Issues:

**Port already in use:**
```bash
# If port 5173 is busy, Vite will automatically use the next available port
# Check the terminal output for the correct URL
```

**Missing dependencies:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Audio not working:**
- Ensure your browser allows audio autoplay
- Click the music toggle button to enable sound
- Some browsers require user interaction before playing audio

### Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run database migrations (if using database)
npm run db:push
```

## File Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Game components
│   │   ├── lib/           # Utilities and stores
│   │   └── pages/         # Page components
│   └── public/            # Static assets (sounds, textures)
├── server/                # Express backend
├── shared/                # Shared types and schemas
└── package.json          # Dependencies and scripts
```

## Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

For the best experience, use a modern browser with WebGL support.

## Need Help?

If you encounter any issues:
1. Check that Node.js and npm are properly installed
2. Ensure all dependencies are installed (`npm install`)
3. Verify no other applications are using ports 5000 or 5173
4. Check the terminal for any error messages

The application should work offline once loaded, as all assets are bundled locally.
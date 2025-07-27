# REST Express Kids Educational Games Application

## Overview

This is a full-stack web application built with React and Express, designed to provide educational games for children ages 3-5. The application features three different games - shape sorting, counting, and color matching - with a modern, child-friendly interface using 3D graphics, interactive elements, and engaging background music. The app is currently in sandbox mode for future enhancements.

## User Preferences

Preferred communication style: Simple, everyday language.
Current status: Keep app in sandbox for potential future enhancements.

## System Architecture

The application follows a modern full-stack architecture with a clear separation between client and server:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **3D Graphics**: React Three Fiber with Drei helpers for interactive 3D elements
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with custom styling
- **State Management**: Zustand for client-side state management
- **Data Fetching**: React Query for server state management

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API structure (currently minimal implementation)

## Key Components

### Game System
- **Game Types**: Three educational games (shapes, counting, colors)
- **Progress Tracking**: Persistent progress storage using local storage
- **Audio System**: Sound effects and background music with mute functionality
- **Game States**: Ready, playing, and ended phases with proper state transitions

### UI/UX Design
- **Child-Friendly Interface**: Large buttons, bright colors, emoji icons
- **Responsive Design**: Mobile-first approach with touch-friendly interactions
- **3D Elements**: Interactive 3D graphics using WebGL
- **Accessibility**: High contrast colors and large interactive elements

### Data Layer
- **Local Storage**: Game progress and user preferences
- **Database Schema**: User management system (prepared but not actively used)
- **Type Safety**: Full TypeScript coverage with Zod validation

## Data Flow

1. **Game State Management**: Zustand stores manage game phase, progress, and audio state
2. **Component Communication**: Props and context for component interaction
3. **Persistence**: Local storage for game progress, with database readiness for user data
4. **3D Rendering**: React Three Fiber handles WebGL rendering and animations

## External Dependencies

### Core Framework Dependencies
- React 18 ecosystem (React, React DOM, React Three Fiber)
- Vite build system with development server
- Express.js server framework

### UI and Styling
- Tailwind CSS for utility-first styling
- Radix UI for accessible component primitives
- Fontsource Inter for consistent typography

### Database and Validation
- Drizzle ORM for database operations
- Neon Database for serverless PostgreSQL
- Zod for runtime type validation

### Development Tools
- TypeScript for type safety
- ESBuild for server bundling
- PostCSS for CSS processing

## Deployment Strategy

### Development Environment
- **Client**: Vite development server with HMR
- **Server**: tsx for TypeScript execution in development
- **Database**: Neon Database with connection pooling

### Production Build
- **Client**: Vite builds optimized static assets to `dist/public`
- **Server**: ESBuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations for schema management

### Build Process
1. Client assets are built using Vite
2. Server code is bundled with ESBuild
3. Database schema is pushed using Drizzle Kit
4. Static files are served from the Express server

### Environment Configuration
- DATABASE_URL for PostgreSQL connection
- NODE_ENV for environment detection
- Static file serving for production builds

The application is designed to be deployed on platforms supporting Node.js with PostgreSQL databases, with the current setup optimized for Neon Database's serverless architecture.
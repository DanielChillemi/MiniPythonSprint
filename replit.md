# Voice Inventory Management System

## Overview

This is a full-stack voice-enabled inventory management application built with React, Express, and PostgreSQL. The system allows users to conduct inventory counts using voice recognition technology, with integration to MarginEdge for restaurant/retail inventory management. The application features a mobile-first design optimized for warehouse and kitchen environments.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized builds
- **Voice Recognition**: Web Speech API with Google Cloud Speech integration

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL-based session storage
- **API Design**: RESTful endpoints with JSON responses

### Key Components

#### Database Schema
- **Users**: Authentication and user management
- **Products**: SKU-based product catalog with pricing and categorization
- **Inventory Sessions**: Time-bounded inventory counting sessions
- **Inventory Items**: Individual item counts with voice recognition confidence scores

#### Voice Recognition System
- Web Speech API for real-time voice-to-text conversion
- Google Cloud Speech API for enhanced accuracy
- Confidence scoring for each voice recognition result
- Audio processing with noise suppression and echo cancellation

#### Product Management
- SKU-based product lookup system
- Category-based organization (wine, beer, spirits, etc.)
- Par level tracking for inventory optimization
- Unit pricing and total value calculations

## Data Flow

1. **Session Initialization**: User starts an inventory session, creating a database record
2. **Product Lookup**: User scans/enters product SKU to load product details
3. **Voice Counting**: User speaks quantity, system processes audio and extracts numerical values
4. **Data Validation**: System validates quantity and allows manual correction
5. **Item Recording**: Confirmed quantities are stored with confidence scores
6. **Session Management**: Real-time session statistics and item tracking
7. **External Sync**: Session data can be synchronized to MarginEdge platform

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM with schema validation
- **@google-cloud/speech**: Enhanced voice recognition capabilities
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI component primitives

### UI Framework
- **shadcn/ui**: Pre-built component library built on Radix UI
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundling for production
- **vite**: Development server and build tool

## Deployment Strategy

### Development Environment
- Local development using Vite dev server on port 5000
- PostgreSQL database provisioned through Replit's integrated database service
- Hot module replacement for rapid development cycles

### Production Build
- **Build Process**: Vite builds client assets, esbuild bundles server code
- **Deployment Target**: Replit Autoscale for automatic scaling
- **Database**: Neon Database for production PostgreSQL hosting
- **Environment Variables**: DATABASE_URL for database connection

### Infrastructure
- **Hosting**: Replit platform with autoscaling capabilities
- **Database**: Serverless PostgreSQL through Neon or Replit database
- **CDN**: Static assets served through Vite's optimized build output
- **Session Storage**: PostgreSQL-based session management for scalability

## Changelog

- June 14, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.
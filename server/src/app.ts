import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path';
import passport from 'passport';

import './config/passport.js';
import { corsOptions } from './config/deployment.js';

import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import postRoutes from './routes/postRoutes.js';
import followRoutes from './routes/followRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

import { errorHandler } from './middleware/error.js';

export const app = express();

app.use(helmet({ contentSecurityPolicy: false }));

app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use(passport.initialize());

app.use(
  '/uploads',
  express.static(path.join(process.cwd(), 'uploads'))
);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/follows', followRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/uploads', uploadRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    name: 'DevisHub API Engine',
    timestamp: new Date(),
  });
});

// Compatibility route
app.use('/auth', authRoutes);

// API 404
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Error handler
app.use(errorHandler);
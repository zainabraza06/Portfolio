import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes        from './routes/auth.js';
import projectRoutes     from './routes/projects.js';
import experienceRoutes  from './routes/experience.js';
import testimonialRoutes from './routes/testimonials.js';
import contactRoutes     from './routes/contact.js';
import certificateRoutes from './routes/certificates.js';
import hackathonRoutes   from './routes/hackathons.js';
import kaggleRoutes      from './routes/kaggle.js';

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }));
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth',         authRoutes);
app.use('/api/projects',     projectRoutes);
app.use('/api/experience',   experienceRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contact',      contactRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/hackathons',   hackathonRoutes);
app.use('/api/kaggle',       kaggleRoutes);

// ── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// ── Global error handler ────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// ── Database + Server ───────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅  MongoDB connected');
    app.listen(PORT, () => console.log(`🚀  Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌  MongoDB connection error:', err.message);
    process.exit(1);
  });

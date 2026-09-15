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
import researchRoutes   from './routes/research.js';
import { cloudinary }   from './config/cloudinary.js';

const app = express();

// ── CORS: localhost for dev; add deployed SPA origins via CORS_ORIGINS (comma-separated) on Render
const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://portfolio-zainab06.vercel.app',
];
const extraOrigins = (process.env.CORS_ORIGINS ?? '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
const allowedOrigins = [...defaultOrigins, ...extraOrigins];

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({ origin: allowedOrigins, credentials: true }));
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
app.use('/api/research',     researchRoutes);

// ── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({
  status: 'ok',
  timestamp: new Date(),
  // Presence only, never values: lets a deploy be checked for upload config
  // without anyone reading the dashboard.
  uploads: {
    cloudName: Boolean(process.env.CLOUDINARY_CLOUD_NAME),
    apiKey: Boolean(process.env.CLOUDINARY_API_KEY),
    apiSecret: Boolean(process.env.CLOUDINARY_API_SECRET),
  },
}));

// Validates the Cloudinary credentials on the host itself, so they never need
// to be copied anywhere to be checked. Cached, because the Admin API is
// rate-limited; key numbers are scrubbed from any error before it is returned.
let uploadCheck = { at: 0, result: null };
app.get('/api/health/uploads', async (_req, res) => {
  if (!uploadCheck.result || Date.now() - uploadCheck.at > 10 * 60 * 1000) {
    try {
      await cloudinary.api.ping();
      uploadCheck.result = { ok: true };
    } catch (err) {
      const detail = err?.error ?? err;
      const reason = String(detail?.message ?? 'Cloudinary rejected the credentials')
        .replace(/\d{8,}/g, '[key]');
      uploadCheck.result = { ok: false, reason };
    }
    uploadCheck.at = Date.now();
  }
  res.json({ ...uploadCheck.result, checkedAt: new Date(uploadCheck.at) });
});

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

import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Experience from './models/Experience.js';
import Certificate from './models/Certificate.js';
import Research from './models/Research.js';

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅  Connected to MongoDB');

  // Admin user
  const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (!existing) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    await User.create({ email: process.env.ADMIN_EMAIL, passwordHash });
    console.log(`👤  Admin created: ${process.env.ADMIN_EMAIL}`);
  }

  // Clear existing data to avoid duplicates on re-run
  await Experience.deleteMany({});
  await Certificate.deleteMany({});

  // ── Projects ───────────────────────────────────────────
  // Projects come from the GitHub sync (POST /api/projects/sync), not from
  // this file. Seeding them here would duplicate the synced repos.

  // ── Experience & Education ─────────────────────────────
  await Experience.insertMany([
    {
      company: 'NESCOM',
      role: 'AI / ML Intern',
      duration: 'February 2026 – Present',
      // Newlines render as bullets in the experience timeline.
      description: [
        'Currently building thrust-specific fuel consumption (TSFC) prediction models for turbofan engines.',
        'Designed GAUGE-Net, a dual-path causal-attention architecture that runs unmodified across all four NASA C-MAPSS subsets (FD001–FD004), where prior state-of-the-art needs subset-specific changes.',
        'Added a geometry-aware feature channel (Riemannian + Wasserstein distance from a learned healthy state); a 5-stage ablation confirmed it as the largest single driver of accuracy.',
        'Beat STARNet by 16.2% / 11.3% NASA Score and 12.0% / 15.9% RMSE on FD002 / FD004 — lowest published Score on both — at 745,984 parameters and sub-12 ms inference.',
      ].join('\n'),
      type: 'work',
      order: 1,
    },
    {
      company: 'Murrabi',
      role: 'AI Intern — EdTech',
      duration: 'June 2025 – August 2025',
      description: [
        'Built a multimodal fusion pipeline: a frozen Whisper speech encoder and MediaPipe skeletal landmarks joined by bidirectional cross-attention, classifying phoneme–gesture pairs for early-literacy teaching.',
        'Benchmarked 4 audio backbones (MFCC, wav2vec 2.0, HuBERT, Whisper) and 5 video encoders on a self-collected classroom set of 413 samples from 120 participants.',
        "92.3% ± 1.63% accuracy over 5 seeds — 9.7 points above the audio-only baseline (McNemar's test, p = 0.046).",
      ].join('\n'),
      type: 'work',
      order: 2,
    },
    {
      company: 'NUST, SEECS',
      role: 'BS Artificial Intelligence',
      duration: '2024 – Present',
      description: 'CGPA: 3.91',
      type: 'education',
      order: 3,
    },
    {
      company: 'Bakhtawar Cadet College',
      role: 'Intermediate (FSc)',
      duration: '2022 – 2024',
      description: 'Grade: A',
      type: 'education',
      order: 4,
    },
    {
      company: 'Bakhtawar Cadet College',
      role: 'Matriculation (SSC)',
      duration: '2020 – 2022',
      description: 'Grade: A',
      type: 'education',
      order: 5,
    },
  ]);
  console.log('\U0001f4bc  Experience seeded');

  // ── Research ───────────────────────────────────────
  await Research.deleteMany({});
  await Research.insertMany([
    {
      title: 'FICNet — Subject-Independent Fall & Activity Recognition',
      context: '4th semester ML project',
      status: 'ongoing',
      order: 1,
      summary: 'Quantifying how much smartphone-based activity recognition degrades when it is evaluated across subjects rather than across random splits.',
      method: 'Measures the CV-to-LOSO generalisation gap on the MobiAct dataset, then introduces Feature-Invariance-Conditioned (FIC) pooling with SAM to improve cross-subject performance.',
      tags: ['Activity Recognition', 'Fall Detection', 'MobiAct', 'LOSO Evaluation'],
      link: 'https://github.com/zainabraza06/FICNet-HAR',
    },
  ]);
  console.log('🔬  Research seeded');

  // ── Certificates ───────────────────────────────────────
  await Certificate.insertMany([
    { title: 'IBM JavaScript Backend Developer', issuer: 'IBM', date: 'Recent' },
    { title: 'Machine Learning Specialization', issuer: 'DeepLearning.AI, Stanford University', date: 'Recent' },
    { title: 'Microsoft AI & ML Engineering', issuer: 'Microsoft', date: 'Recent' },
    { title: 'Meta Front-End Developer', issuer: 'Meta', date: 'Recent' },
    { title: 'Ultimate TypeScript Course 2024 – Learn, Build & Excel', issuer: 'Packt', date: 'Recent' },
    { title: 'WebSockets Protocols Explained', issuer: 'Packt', date: 'Recent' },
    { title: 'Introduction to Next.js', issuer: 'Next.js', date: 'Recent' },
  ]);
  console.log('🏅  Certificates seeded');

  console.log('🌱  Seed complete!');
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('❌  Seed error:', err.message);
  process.exit(1);
});

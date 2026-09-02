import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Project from './models/Project.js';
import Experience from './models/Experience.js';
import Certificate from './models/Certificate.js';

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
  await Project.deleteMany({});
  await Experience.deleteMany({});
  await Certificate.deleteMany({});

  // ── Projects ───────────────────────────────────────────
  await Project.insertMany([
    {
      title: 'Healix – Hospital Management System',
      description: 'Full-stack MERN application for remote patient-doctor consultations with real-time chat, appointment scheduling, medical records management, and secure payment processing.',
      techStack: ['MERN Stack', 'TypeScript', 'Tailwind CSS'],
      featured: true,
      order: 1,
    },
    {
      title: 'EpiVirus – Pandemic Simulation Platform',
      description: 'Network-based disease spread simulator built with Python and React to model outbreaks and test intervention strategies. Includes demographic modeling and visualization modules.',
      techStack: ['FastAPI', 'React', 'Python'],
      featured: true,
      order: 2,
    },
    {
      title: 'Gesture Web',
      description: 'Interactive web application using webcam gesture recognition via MediaPipe to control website UI elements with 8 gestures.',
      techStack: ['React', 'MERN', 'MediaPipe'],
      featured: true,
      order: 3,
    },
    {
      title: 'NUST Hostel Management System (NHMS)',
      description: 'Digitized hostel operations with role-driven dashboards for admins, managers, staff, and hostelites. Features task automation, resource requests, and optimized workflows.',
      techStack: ['MERN Stack', 'TypeScript'],
      featured: true,
      order: 4,
    },
    {
      title: 'Early Care Monitoring System (Ongoing)',
      description: 'AI-based human activity and fall detection system. Uses Mobiact, UHR, and gait recognition datasets. Classifies activities and detects falls using a meta-classifier.',
      techStack: ['React Native', 'FastAPI', 'Python', 'ML'],
      featured: true,
      order: 5,
    },
    {
      title: 'AI Fashion Stylist (Ongoing)',
      description: 'Intelligent fashion recommendation system. Users input clothing preferences via text, scrapes top Pakistani fashion brands and suggests best matches.',
      techStack: ['MERN Stack', 'TypeScript'],
      featured: true,
      order: 6,
    },
  ]);
  console.log('📁  Projects seeded');

  // ── Experience & Education ─────────────────────────────
  await Experience.insertMany([
    {
      company: 'NESCOM',
      role: 'AI / ML Intern',
      duration: 'February 2026 – Present',
      // Newlines render as bullets in the experience timeline.
      description: [
        'Currently developing thrust-specific fuel consumption (TSFC) prediction models for turbofan engines, following the remaining-useful-life work below.',
        'Designed GAUGE-Net, a dual-path causal-attention architecture deployed without structural modification across all four NASA C-MAPSS turbofan subsets (FD001–FD004) — prior state-of-the-art models require subset-specific architecture changes for the harder multi-regime subsets, weakening their generalization claims.',
        'Introduced a geometry-aware feature channel — Riemannian and Wasserstein distance from a learned healthy-reference state — as direct model input; a 5-stage component ablation confirmed it as the single largest driver of accuracy gains.',
        'Versus the strongest published baseline (STARNet): NASA Score improved 16.2% (FD002) and 11.3% (FD004) and RMSE 12.0% and 15.9% on the two hardest multi-regime subsets — the lowest published Score on both — with near-parity on FD001 and a documented regression on FD003, at 745,984 parameters and sub-12 ms inference.',
      ].join('\n'),
      type: 'work',
      order: 1,
    },
    {
      company: 'Murrabi',
      role: 'AI Intern — EdTech',
      duration: 'June 2025 – August 2025',
      description: [
        'Built a multimodal fusion pipeline combining a frozen Whisper speech encoder with MediaPipe skeletal landmarks via bidirectional cross-attention, classifying paired phoneme–gesture productions for early-literacy instruction.',
        'Benchmarked 4 audio backbones (MFCC, wav2vec 2.0, HuBERT, Whisper) and 5 video encoder architectures in isolation to select the final configuration, on a self-collected classroom dataset of 413 samples across 120 participants.',
        "Reached 92.3% ± 1.63% accuracy across 5 random seeds — a 9.7-percentage-point gain over the audio-only baseline, confirmed by McNemar's test (p = 0.046) and non-overlapping seed-level accuracy distributions.",
      ].join('\n'),
      type: 'work',
      order: 2,
    },
    {
      company: 'NUST, SEECS',
      role: 'BS Artificial Intelligence',
      duration: '2024 – Present',
      description: 'CGPA: 3.94',
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
  console.log('💼  Experience seeded');

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

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
      role: 'AI Intern',
      duration: 'Current',
      description: 'Working on Turbo Engine Remaining Useful Life (RUL) prediction. Applying machine learning techniques for predictive maintenance. Handling time-series data and model optimization.',
      type: 'work',
      order: 1,
    },
    {
      company: 'Murrabi',
      role: 'AI Intern',
      duration: '16 June 2025 - 16 August 2025',
      description: 'Developed Jolly Phoneme Classification model using Whisper + BiLSTM. Achieved 0.97 F1 score and 96% test accuracy. Gained hands-on experience in audio processing, model training, and evaluation.',
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

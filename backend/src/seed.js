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
      company: 'Zyra',
      role: 'AI Automation Developer',
      duration: 'August 2026',
      description: [
        'Built an AI customer-support agent for a client store - 12 tools exposed over the Model Context Protocol, so one tool layer serves the website, WhatsApp and Instagram.',
        'Enforced security in code rather than prompts: identity taken from the auth token, orders requiring explicit confirmation and a tamper-proof quote token, and a human escalation queue behind every handover promise.',
        'Integrated WhatsApp Cloud API and Instagram Messaging webhooks with HMAC-SHA256 validation, message-id deduplication and OTP phone verification - built and tested, pending Meta business credentials.',
        'Shipped a loyalty programme of 15 config-driven earning rules with a unique-index ledger against double-crediting, and a measurement-based size recommendation engine.',
      ].join('\n'),
      type: 'work',
      order: 0,
    },
    {
      company: 'NESCOM',
      role: 'AI / ML Intern',
      duration: 'February 2026 – August 2026',
      // Newlines render as bullets in the experience timeline.
      description: [
        'Deep learning research on turbofan engine prognostics: remaining useful life, and now thrust-specific fuel consumption.',
        'Designed GAUGE-Net, which improved on the strongest published baseline for the hardest C-MAPSS subsets.',
      ].join('\n'),
      type: 'work',
      order: 1,
    },
    {
      company: 'Murrabi',
      role: 'AI Intern — EdTech',
      duration: 'June 2025 – August 2025',
      description: [
        'Built a multimodal speech-and-gesture classification pipeline for early-literacy instruction.',
        'Collected and curated the classroom dataset behind it, and contributed to the company summer-camp content.',
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
      title: 'GAUGE-Net â€” Turbofan Remaining Useful Life',
      context: 'NESCOM internship',
      period: '2026',
      status: 'complete',
      featured: true,
      order: 1,
      summary: 'A remaining-useful-life model for turbofan engines that runs unmodified across all four NASA C-MAPSS subsets, where prior state-of-the-art requires subset-specific changes.',
      architecture: 'Dual-path causal-attention network, deployed without structural modification across FD001â€“FD004.',
      novelty: 'A geometry-aware feature channel â€” Riemannian and Wasserstein distance from a learned healthy-reference state â€” used as direct model input. A five-stage ablation confirmed it as the largest driver of the accuracy gains.',
      method: 'Benchmarked against STARNet, the strongest published baseline, on all four C-MAPSS subsets using NASA Score and RMSE.',
      results: [
        'NASA Score improved 16.2% on FD002 and 11.3% on FD004.',
        'RMSE improved 12.0% and 15.9% on the same two subsets.',
        'Lowest published Score on both hard multi-regime subsets; near-parity on FD001, one regression on FD003.',
        '745,984 parameters with sub-12 ms inference.',
      ].join('\n'),
      tags: ['Causal Attention', 'Time-Series', 'C-MAPSS', 'Predictive Maintenance'],
    },
    {
      title: 'Multimodal Phonemeâ€“Gesture Classification',
      context: 'Murrabi internship',
      period: '2025',
      status: 'complete',
      order: 2,
      summary: 'Classifying paired phoneme and gesture productions in early-literacy instruction by fusing speech and skeletal motion.',
      architecture: 'A frozen Whisper speech encoder and MediaPipe skeletal landmarks joined by bidirectional cross-attention.',
      method: 'Benchmarked 4 audio backbones (MFCC, wav2vec 2.0, HuBERT, Whisper) and 5 video encoders in isolation before final training, on a self-collected classroom dataset of 413 samples across 120 participants and 5 schools.',
      results: [
        '92.3% Â± 1.63% accuracy across 5 random seeds.',
        '9.7 percentage points over the audio-only baseline.',
        "Confirmed by McNemar's test (p = 0.046) and non-overlapping seed-level distributions.",
      ].join('\n'),
      tags: ['Multimodal Fusion', 'Whisper', 'MediaPipe', 'Cross-Attention'],
    },
    {
      title: 'Revisiting Subject-Independent Evaluation for Smartphone-Based Fall and Activity Recognition: A Lightweight Benchmark',
      context: '4th semester ML project',
      status: 'complete',
      order: 3,
      summary: 'Quantifying how much smartphone-based activity recognition degrades when it is evaluated across subjects rather than across random splits.',
      method: 'Measures the CV-to-LOSO generalisation gap on the MobiAct dataset, then introduces Feature-Invariance-Conditioned (FIC) pooling with SAM to improve cross-subject performance.',
      tags: ['Activity Recognition', 'Fall Detection', 'MobiAct', 'LOSO Evaluation'],
      link: 'https://github.com/zainabraza06/FICNet-HAR',
    },
    {
      title: 'Detecto â€” Real-Time CCTV Threat Detection',
      context: 'Independent research',
      period: 'Ongoing',
      status: 'ongoing',
      order: 4,
      summary: 'Threat detection for live CCTV streams, joining weapon and violence detection and aimed at low-cost everyday hardware.',
      novelty: 'A structured literature review and dataset survey identified a gap around joint weapon-and-violence fusion detection for live video.',
      method: 'A pipeline built on visual cues that generalise across event types â€” a weapon entering frame, sudden violent motion, forcible grabbing, a person falling, rapid grab-and-flee motion â€” with a human-verification step before any alert is escalated.',
      tags: ['Computer Vision', 'Video Analytics', 'Real-Time'],
    },
    {
      title: 'Thrust-Specific Fuel Consumption Prediction',
      context: 'NESCOM internship',
      period: '2026',
      status: 'ongoing',
      order: 5,
      summary: 'Extending the turbofan work from remaining useful life to thrust-specific fuel consumption on the same engine sensor data.',
      tags: ['Time-Series', 'Turbofan', 'Regression'],
    },
  ]);
  console.log('🔬  Research seeded');

  // ── Certificates ───────────────────────────────────────
  await Certificate.insertMany([
    {
      title: 'Apache Kafka Specialization',
      issuer: 'LearnKartS',
      date: 'Oct 2025',
      credentialId: '7DN6PYYKX9H2',
      credentialUrl: 'https://www.coursera.org/account/accomplishments/specialization/7DN6PYYKX9H2',
      order: 1,
    },
    {
      title: 'Machine Learning Specialization',
      issuer: 'DeepLearning.AI · Stanford Online',
      date: 'Dec 2025',
      credentialId: 'NIO29VDJY3VW',
      credentialUrl: 'https://www.coursera.org/account/accomplishments/specialization/NIO29VDJY3VW',
      order: 2,
    },
    {
      title: 'Microsoft AI & ML Engineering Professional Certificate',
      issuer: 'Microsoft',
      date: 'Dec 2025',
      credentialId: '52EEGDGTG0ZJ',
      credentialUrl: 'https://www.coursera.org/account/accomplishments/specialization/52EEGDGTG0ZJ',
      order: 3,
    },
    {
      title: 'GraphQL Mastery: From Fundamentals to Production Specialization',
      issuer: 'Board Infinity',
      date: 'Sep 2025',
      credentialId: '61MHDJ3OBMVB',
      credentialUrl: 'https://www.coursera.org/account/accomplishments/specialization/61MHDJ3OBMVB',
      order: 4,
    },
    {
      title: 'IBM JavaScript Backend Specialization',
      issuer: 'IBM',
      date: 'Sep 2025',
      credentialId: 'NMUIPX5CWE2X',
      credentialUrl: 'https://www.coursera.org/account/accomplishments/specialization/NMUIPX5CWE2X',
      order: 5,
    },
    {
      title: 'Meta Front-End Developer',
      issuer: 'Meta',
      date: 'Aug 2025',
      credentialId: 'O061412S2TM4',
      credentialUrl: 'https://www.coursera.org/account/accomplishments/specialization/O061412S2TM4',
      order: 6,
    },
  ]);
  console.log('🏅  Certificates seeded');

  console.log('🌱  Seed complete!');
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('❌  Seed error:', err.message);
  process.exit(1);
});

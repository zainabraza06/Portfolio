import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Project from './models/Project.js';
import Experience from './models/Experience.js';
import Testimonial from './models/Testimonial.js';

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅  Connected to MongoDB');

  // Admin user
  const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (!existing) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    await User.create({ email: process.env.ADMIN_EMAIL, passwordHash });
    console.log(`👤  Admin created: ${process.env.ADMIN_EMAIL}`);
  } else {
    console.log('👤  Admin already exists – skipping');
  }

  // Sample Projects
  const projCount = await Project.countDocuments();
  if (projCount === 0) {
    await Project.insertMany([
      {
        title: 'AI Fashion Stylist',
        description: 'A MERN-stack AI fashion recommendation engine for the Pakistani market with Gemini API integration, JWT auth, and live product scraping.',
        techStack: ['React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'Gemini API', 'TypeScript'],
        liveUrl: '',
        githubUrl: 'https://github.com/zainabraza06',
        imageUrl: '',
        featured: true,
        order: 1,
      },
      {
        title: 'Portfolio Website',
        description: 'A full-stack dynamic portfolio with glassmorphism design, smooth animations, and a JWT-protected admin panel to manage content live.',
        techStack: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'TailwindCSS'],
        liveUrl: '',
        githubUrl: 'https://github.com/zainabraza06',
        imageUrl: '',
        featured: true,
        order: 2,
      },
    ]);
    console.log('📁  Sample projects seeded');
  }

  // Sample Experience
  const expCount = await Experience.countDocuments();
  if (expCount === 0) {
    await Experience.insertMany([
      {
        company: 'Your University',
        role: 'BS Computer Science',
        duration: '2022 – Present',
        description: 'Pursuing Computer Science with a focus on MERN stack development and Machine Learning / Deep Learning research.',
        type: 'education',
        order: 1,
      },
    ]);
    console.log('🎓  Sample experience seeded');
  }

  // Sample Testimonial
  const testCount = await Testimonial.countDocuments();
  if (testCount === 0) {
    await Testimonial.create({
      name: 'John Doe',
      role: 'Senior Developer',
      company: 'TechCorp',
      text: 'Zainab delivered exceptional work — clean code, great communication, and delivered ahead of schedule. Highly recommended!',
      rating: 5,
      approved: true,
    });
    console.log('💬  Sample testimonial seeded');
  }

  console.log('🌱  Seed complete!');
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('❌  Seed error:', err.message);
  process.exit(1);
});

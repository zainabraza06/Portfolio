import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  company:     { type: String, required: true },
  role:        { type: String, required: true },
  duration:    { type: String, required: true },
  description: { type: String, required: true },
  logo:        { type: String, default: '' },
  type:        { type: String, enum: ['work', 'education'], default: 'work' },
  order:       { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Experience', experienceSchema);

import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  role:     { type: String, required: true },
  company:  { type: String, required: true },
  avatar:   { type: String, default: '' },
  text:     { type: String, required: true },
  rating:   { type: Number, min: 1, max: 5, default: 5 },
  // Where it was left, e.g. "Upwork", and the profile or review it links to.
  source:   { type: String, default: '' },
  sourceUrl:{ type: String, default: '' },
  approved: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Testimonial', testimonialSchema);

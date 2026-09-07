import mongoose from 'mongoose';

const researchSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  context:  { type: String, default: '' },   // where the work happened, e.g. "NESCOM"
  period:   { type: String, default: '' },   // e.g. "2025" or "2026 – present"
  status:   { type: String, enum: ['ongoing', 'complete'], default: 'ongoing' },
  summary:  { type: String, required: true },
  method:   { type: String, default: '' },
  // One result per line; the site renders them as bullets.
  results:  { type: String, default: '' },
  tags:     [{ type: String }],
  link:     { type: String, default: '' },
  featured: { type: Boolean, default: false },
  order:    { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Research', researchSchema);

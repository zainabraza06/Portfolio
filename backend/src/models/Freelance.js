import mongoose from 'mongoose';

const freelanceSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  url:      { type: String, required: true },
  handle:   { type: String, default: '' },
  order:    { type: Number, default: 0 },
  active:   { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Freelance', freelanceSchema);

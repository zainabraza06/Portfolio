import mongoose from 'mongoose';

const hackathonSchema = new mongoose.Schema({
  title:          { type: String, required: true },
  description:    { type: String, default: '' },
  date:           { type: String, default: '' },
  projectUrl:     { type: String, default: '' },
  certificateUrl: { type: String, default: '' },
  imageUrl:       { type: String, default: '' },
  order:          { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Hackathon', hackathonSchema);

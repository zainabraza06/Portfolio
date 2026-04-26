import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  techStack:   [{ type: String }],
  liveUrl:     { type: String, default: '' },
  githubUrl:   { type: String, default: '' },
  githubId:    { type: String, default: null, sparse: true },
  imageUrl:    { type: String, default: '' },
  featured:    { type: Boolean, default: false },
  order:       { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);

import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  issuer:      { type: String, required: true },
  date:        { type: String, default: '' },
  linkedInUrl: { type: String, default: '' },
  credentialUrl:{ type: String, default: '' },
  imageUrl:    { type: String, default: '' },
  order:       { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Certificate', certificateSchema);

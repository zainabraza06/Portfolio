import mongoose from 'mongoose';

const kaggleSchema = new mongoose.Schema({
  title:          { type: String, required: true },
  description:    { type: String, default: '' },
  competitionUrl: { type: String, default: '' },
  rank:           { type: String, default: '' },
  date:           { type: String, default: '' },
  imageUrl:       { type: String, default: '' },
  order:          { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Kaggle', kaggleSchema);

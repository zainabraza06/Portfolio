import Research from '../models/Research.js';

const normalise = (body) => {
  const data = { ...body };
  if (typeof data.tags === 'string') {
    data.tags = data.tags.split(',').map(s => s.trim()).filter(Boolean);
  }
  return data;
};

export const getResearch = async (_req, res) => {
  try {
    const items = await Research.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createResearch = async (req, res) => {
  try {
    const saved = await new Research(normalise(req.body)).save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateResearch = async (req, res) => {
  try {
    const updated = await Research.findByIdAndUpdate(req.params.id, normalise(req.body), {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: 'Research entry not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteResearch = async (req, res) => {
  try {
    const deleted = await Research.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Research entry not found' });
    res.json({ message: 'Research entry deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

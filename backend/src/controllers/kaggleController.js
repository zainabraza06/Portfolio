import Kaggle from '../models/Kaggle.js';

export const getKaggle = async (req, res) => {
  try {
    const list = await Kaggle.find().sort({ order: 1, createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createKaggle = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.imageUrl = req.file.path;
    const kaggle = new Kaggle(data);
    const saved = await kaggle.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateKaggle = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.imageUrl = req.file.path;
    const updated = await Kaggle.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Kaggle competition not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteKaggle = async (req, res) => {
  try {
    const deleted = await Kaggle.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Kaggle competition not found' });
    res.json({ message: 'Kaggle competition deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

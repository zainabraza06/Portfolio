import Freelance from '../models/Freelance.js';
import { reorderHandler } from '../utils/reorder.js';

export const getFreelance = async (req, res) => {
  try {
    const list = await Freelance.find().sort({ order: 1, createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createFreelance = async (req, res) => {
  try {
    const item = new Freelance(req.body);
    const saved = await item.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateFreelance = async (req, res) => {
  try {
    const updated = await Freelance.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after', runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Freelance link not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteFreelance = async (req, res) => {
  try {
    const deleted = await Freelance.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Freelance link not found' });
    res.json({ message: 'Freelance link deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const reorderFreelance = reorderHandler(Freelance);

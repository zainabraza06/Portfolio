import Hackathon from '../models/Hackathon.js';

export const getHackathons = async (req, res) => {
  try {
    const list = await Hackathon.find().sort({ order: 1, createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createHackathon = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.imageUrl = req.file.path;
    const hackathon = new Hackathon(data);
    const saved = await hackathon.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateHackathon = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.imageUrl = req.file.path;
    const updated = await Hackathon.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Hackathon not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteHackathon = async (req, res) => {
  try {
    const deleted = await Hackathon.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Hackathon not found' });
    res.json({ message: 'Hackathon deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

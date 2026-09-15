import mongoose from 'mongoose';

/**
 * Builds a handler that persists a drag-and-drop arrangement. The body lists
 * ids in display order; each document's `order` becomes its position. One
 * bulk write rather than a request per row.
 */
export const reorderHandler = (Model) => async (req, res) => {
  const { ids } = req.body ?? {};
  if (!Array.isArray(ids) || ids.length === 0 || !ids.every(id => mongoose.isValidObjectId(id))) {
    return res.status(400).json({ message: 'Expected { ids: [...] } listing every item in display order' });
  }
  try {
    await Model.bulkWrite(ids.map((id, index) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order: index + 1 } } },
    })));
    res.json({ message: 'Order saved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

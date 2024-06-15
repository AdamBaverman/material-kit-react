import { Schema, model } from 'mongoose';
import Counter from './counter';

const rowSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  cid: { type: Number, required: true, unique: true },
  extraFields: { type: Map, of: String }, // Динамические поля
}, { timestamps: true });

// Генерация cid
rowSchema.pre('save', async function preSave(next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'rowId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.cid = counter.seq;
  }
  next();
});

const Row = model('Row', rowSchema);

export default Row;

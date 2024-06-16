import { Schema, model, models } from 'mongoose';
import Counter from './counter';

const rowSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  cid: { type: Number, required: false, unique: true },
  fields: { type: Map, of: Schema.Types.Mixed }, // Поля персонажа в виде объекта ключ-значение
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

const Row = models.cards || model('cards', rowSchema);

export default Row;

import { Schema, model, models} from 'mongoose';

const counterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = models.counters || model('counters', counterSchema);

export default Counter;
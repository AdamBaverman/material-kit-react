import { Schema, model } from 'mongoose';

const columnSchema = new Schema({
  field: { type: String, required: true },
  headerName: { type: String, required: true },
  width: { type: Number, required: true },
});

const Column = model('Column', columnSchema);

export default Column;

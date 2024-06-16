import { Schema, model, models } from 'mongoose';

const columnSchema = new Schema({
  field: { type: String, required: true },
  headerName: { type: String, required: true },
  width: { type: Number, required: true },
});

const Column = models.columns || model('columns', columnSchema);

export default Column;

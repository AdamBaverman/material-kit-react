import { Schema, model, models} from 'mongoose';

const templateSchema = new Schema({
    _id: { type: String, required: true },
    id: { type: Number, default: 0 },
    name: { type: String, required: true },
    fields: { type: Map, of: String },
});

const Template = models.templates || model('templates', templateSchema);

export default Template;
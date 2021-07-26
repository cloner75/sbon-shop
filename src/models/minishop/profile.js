// Packages
import { set, model, Schema } from 'mongoose';
import paginate from 'mongoose-paginate';
import timestamp from 'mongoose-timestamp';

// Setting mongoose
set('useFindAndModify', false);
set('useCreateIndex', true);

const schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    description: { type: String, required: true },
    title: { type: String, required: true },
    categoryIds: { type: Array, required: true },
    phone: { type: String, required: true },
    domain: { type: String, required: true },
    address: { type: String, required: false },
    nationalCode: { type: String, required: true },
    documents: { type: Array, required: true }
  },
  {
    minimize: false,
    versionKey: false,
  },
);

// Add plugins
schema.plugin(paginate);
schema.plugin(timestamp);

const modelSchema = model('minishops', schema);

// Index fields
modelSchema.ensureIndexes((err) => {
  if (err) {
    console.error('minishops model error :', err.message);
  }
});

export default modelSchema;

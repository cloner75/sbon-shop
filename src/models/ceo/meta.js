import { Schema, model } from 'mongoose';
import timestamp from 'mongoose-timestamp';
import paginate from 'mongoose-paginate';

// define schema
const metaSchema = new Schema({
  page: { type: String, required: true, index: true },
  metas: [
    {
      name: { type: String, required: true },
      value: { type: String, required: true }
    }
  ]
});

// use of plugin
metaSchema.plugin(timestamp);
metaSchema.plugin(paginate);

// create model
const metaModel = model('metas', metaSchema);

// index fields
metaModel.ensureIndexes((err) => {
  if (err) {
    console.error('metas model error :', err.message);
  }
});

export default metaModel;
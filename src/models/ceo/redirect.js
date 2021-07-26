import { Schema, model } from 'mongoose';
import timestamp from 'mongoose-timestamp';
import paginate from 'mongoose-paginate';

// define schema
const schema = new Schema({
  page: { type: String, required: true, index: true },
  target: { type: String, required: true },
  code: { type: Number, required: true }
});

// use of plugin
schema.plugin(timestamp);
schema.plugin(paginate);

// create model
const RedirectModel = model('redirects', schema);

// index fields
RedirectModel.ensureIndexes((err) => {
  if (err) {
    console.error('redirect model error :', err.message);
  }
});

export default RedirectModel;
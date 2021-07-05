// Packages
import { set, model, Schema } from 'mongoose';
import paginate from 'mongoose-paginate';
import timestamp from 'mongoose-timestamp';

// Setting mongoose
set('useFindAndModify', false);
set('useCreateIndex', true);

const schema = new Schema(
  {
    categoryId: { type: ObjectId, required: true },
    plans: [{
      checkCount: { type: Number, required: true },
      prepayment: { type: Number, required: true },
      interest: { type: Number, required: true },
    }],
    ownerId: { type: Schema.Types.ObjectId, required: false }
  },
  {
    minimize: false,
    versionKey: false,
  },
);

// Add plugins
schema.plugin(paginate);
schema.plugin(timestamp);

const modelSchema = model('installment', schema);

// Index fields
modelSchema.ensureIndexes((err) => {
  if (err) {
    console.error('installment model error :', err.message);
  }
});

export default modelSchema;

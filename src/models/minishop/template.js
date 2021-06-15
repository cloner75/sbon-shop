// Packages
import { set, model, Schema } from 'mongoose';
import paginate from 'mongoose-paginate';
import timestamp from 'mongoose-timestamp';

// Setting mongoose
set('useFindAndModify', false);
set('useCreateIndex', true);

const schema = new Schema(
  {
    profileId: { type: Schema.Types.ObjectId, required: true },
    logo: { type: String, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    header: {
      menu: { type: String, required: true },
      value: { type: Schema.Types.Mixed, required: false }
    },
    body: {
      slider: { type: String, required: true },
      value: { type: Schema.Types.Mixed, required: false }
    },
    footer: {
      socials: [{
        name: { type: String, required: true },
        link: { type: String, required: true }
      }],
    },
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
    console.error('option model error :', err.message);
  }
});

export default modelSchema;

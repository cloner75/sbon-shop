// Packages
import { set, model, Schema } from 'mongoose';
import paginate from 'mongoose-paginate';
import timestamp from 'mongoose-timestamp';

// Setting mongoose
set('useFindAndModify', false);
set('useCreateIndex', true);

const schema = new Schema(
    {
        key: { type: String, required: true, index: true, unique: true },
        value: { type: Schema.Types.Mixed, required: true },
        userId: { type: Schema.Types.ObjectId, required: true }
    },
    {
        minimize: false,
        versionKey: false,
    },
);

// Add plugins
schema.plugin(paginate);
schema.plugin(timestamp);

const modelSchema = model('options', schema);

// Index fields
modelSchema.ensureIndexes((err) => {
    if (err) {
        console.error('option model error :', err.message);
    }
});

export default modelSchema;

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
        name: { type: String, required: true },
        products: { type: Array, required: true, }
    },
    {
        minimize: false,
        versionKey: false,
    },
);

// Add plugins
schema.plugin(paginate);
schema.plugin(timestamp);

const modelSchema = model('list', schema);

// Index fields
modelSchema.ensureIndexes((err) => {
    if (err) {
        console.error('wallet model error :', err.message);
    }
});

export default modelSchema;

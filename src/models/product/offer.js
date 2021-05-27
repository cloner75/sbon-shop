// Packages
import { set, model, Schema } from 'mongoose';
import paginate from 'mongoose-paginate';
import timestamp from 'mongoose-timestamp';

// Setting mongoose
set('useFindAndModify', false);
set('useCreateIndex', true);

const schema = new Schema(
    {
        code: { type: String, required: true, index: true, unique: true },
        title: { type: String, required: true },
        expirationTime: { type: String, required: true },
        categoryIds: { type: Array, required: false },
        amount: { type: Number, required: true },
        type: { type: Number, required: true },
        status: { type: Number, required: true },
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

const modelSchema = model('offer', schema);

// Index fields
modelSchema.ensureIndexes((err) => {
    if (err) {
        console.error('offer model error :', err.message);
    }
});

export default modelSchema;

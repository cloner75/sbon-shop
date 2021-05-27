// Packages
import { set, model, Schema } from 'mongoose';
import paginate from 'mongoose-paginate';
import timestamp from 'mongoose-timestamp';

// Setting mongoose
set('useFindAndModify', false);
set('useCreateIndex', true);

const schema = new Schema(
    {
        name: {
            fa: { type: String, required: true },
            en: { type: String, required: true },
        },
        slug: { type: String, required: true },
        icon: { type: String, required: true },
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

const modelSchema = model('brand', schema);

// Index fields
modelSchema.ensureIndexes((err) => {
    if (err) {
        console.error('brand model error :', err.message);
    }
});

export default modelSchema;

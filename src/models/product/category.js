// Packages
import { set, model, Schema } from 'mongoose';
import paginate from 'mongoose-paginate';
import timestamp from 'mongoose-timestamp';

// Setting mongoose
set('useFindAndModify', false);
set('useCreateIndex', true);

const schema = new Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true },
        image: { type: String, required: false },
        banner: { type: String, required: false },
        description: { type: String, required: false },
        sub: [
            {
                name: { type: String, required: true },
                slug: { type: String, required: true },
                image: { type: String, required: false },
                description: { type: String, required: false },
                banner: { type: String, required: false },
                sub: [
                    {
                        name: { type: String, required: true },
                        description: { type: String, required: false },
                        slug: { type: String, required: true },
                        image: { type: String, required: false },
                        banner: { type: String, required: false },
                    }
                ],
            }
        ],
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

const modelSchema = model('category', schema);

// Index fields
modelSchema.ensureIndexes((err) => {
    if (err) {
        console.error('catgegory model error :', err.message);
    }
});

export default modelSchema;

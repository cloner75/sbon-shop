// Packages
import { set, model, Schema } from 'mongoose';
import paginate from 'mongoose-paginate';
import timestamp from 'mongoose-timestamp';

// Setting mongoose
set('useFindAndModify', false);
set('useCreateIndex', true);

const schema = new Schema(
    {
        titleFa: { type: String, required: true, index: true },
        titleEn: { type: String, required: true, index: true },
        brandId: { type: Schema.Types.ObjectId, required: true, index: true },
        description: { type: String, required: false },
        keyWords: { type: Array, required: false },
        categoriesId: { type: Array, required: true, index: true },
        body: { type: String, required: true },
        slug: { type: String, required: true },
        isShow: { type: Boolean, default: false, required: true },
        type: { type: Number, default: 0, required: true },
        status: { type: Number, default: 0, required: true },
        images: { type: Array, required: true },
        attributes: [
            {
                name: { type: String, required: true },
                items: [{
                    default: { type: Boolean, required: true, default: false },
                    value: { type: String, required: false },
                    key: { type: String, required: false },
                }]
            }
        ],
        skus: [
            {
                key: { type: String, required: true },
                name: { type: String, required: true },
                default: { type: Boolean, required: false, default: false },
                image: { type: String, required: false },
                price: { type: Number, required: false },
                discount: { type: Number, required: false },
                sbon: { type: Number, required: false },
                stock: { type: Number, required: false },
                options: [
                    {
                        key: { type: String, required: false },
                        value: { type: String, required: false },
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

const modelSchema = model('product', schema);

// Index fields
modelSchema.ensureIndexes((err) => {
    if (err) {
        console.error('product model error :', err.message);
    }
});

export default modelSchema;

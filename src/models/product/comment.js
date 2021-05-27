// Packages
import { set, model, Schema } from 'mongoose';
import paginate from 'mongoose-paginate';
import timestamp from 'mongoose-timestamp';

// Setting mongoose
set('useFindAndModify', false);
set('useCreateIndex', true);

const ObjectId = Schema.Types.ObjectId;

const schema = new Schema(
    {
        userId: { type: ObjectId, required: true },
        referId: { type: ObjectId, required: false },
        productId: { type: ObjectId, required: true },
        skuId: { type: ObjectId, required: false },
        ratings: [
            {
                key: { type: String, required: false },
                value: { type: Number, required: false, }
            },

        ],
        offer: { type: Number, requird: false, default: 0 },
        addvantages: { type: Array, required: false },
        disAddvantages: { type: Array, required: false },
        message: { type: String, required: true },
        status: { type: Number, required: true, default: 0 },
    },
    {
        minimize: false,
        versionKey: false,
    },
);

// Add plugins
schema.plugin(paginate);
schema.plugin(timestamp);

const modelSchema = model('comment', schema);

// Index fields
modelSchema.ensureIndexes((err) => {
    if (err) {
        console.error('comment model error :', err.message);
    }
});

export default modelSchema;

// Packages
import { set, model, Schema } from 'mongoose';
import paginate from 'mongoose-paginate';
import timestamp from 'mongoose-timestamp';

// Setting mongoose
set('useFindAndModify', false);
set('useCreateIndex', true);

const schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, required: true, unique: true },
        amount: { type: Number, required: true, default: 0 },
        logs: [{
            action: { type: String, required: true },
            toId: { type: Schema.Types.ObjectId, required: false },
            createdAt: { type: Date, required: true, default: Date.now() }
        }]
    },
    {
        minimize: false,
        versionKey: false,
    },
);

// Add plugins
schema.plugin(paginate);
schema.plugin(timestamp);

const modelSchema = model('wallet', schema);

// Index fields
modelSchema.ensureIndexes((err) => {
    if (err) {
        console.error('wallet model error :', err.message);
    }
});

export default modelSchema;

// Packages
import { set, model, Schema } from 'mongoose';
import paginate from 'mongoose-paginate';
import timestamp from 'mongoose-timestamp';

// Setting mongoose
set('useFindAndModify', false);
set('useCreateIndex', true);

const schema = new Schema(
  {
    token: { type: String, required: false },
    userId: { type: Schema.Types.ObjectId, required: true },
    products: [
      {
        productId: { type: Schema.Types.ObjectId, required: true },
        skuId: { type: Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        count: { type: Number, required: true },
        discount: { type: Number, required: true, default: 0 },
        price: { type: Number, required: true },
        sum: { type: Number, required: true },
        sbon: { type: Number, required: true },
      }
    ],
    location: {
      lat: { type: String, required: true },
      lng: { type: String, required: true },
      originalAddress: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: false },
      city: { type: String, required: false },
      village: { type: String, required: false },
      zipCode: { type: String, required: true },
      plaque: { type: String, required: false },
      hasReceiver: { type: Boolean, required: true },
      receiver: {
        firstName: { type: String, required: false },
        lastName: { type: String, required: false },
        nationalId: { type: String, required: false },
        phoneNumber: { type: String, required: false },
      },
    },
    RRN: { type: String, required: false },
    postPrice: { type: Number, required: true },
    sum: { type: Number, required: true },
    typePayment: { type: Number, required: true },
    payment: { type: Number, rqeuired: true },
    orderId: { type: String, required: true },
    status: { type: Number, required: true, default: 0 },
    sbon: { type: Number, required: true, default: 0 }
  },
  {
    minimize: false,
    versionKey: false,
  },
);

// Add plugins
schema.plugin(paginate);
schema.plugin(timestamp);

const modelSchema = model('order', schema);

// Index fields
modelSchema.ensureIndexes((err) => {
  if (err) {
    console.error('order model error :', err.message);
  }
});

export default modelSchema;

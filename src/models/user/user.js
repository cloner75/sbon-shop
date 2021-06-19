// Packages
import { set, model, Schema } from 'mongoose';
import paginate from 'mongoose-paginate';
import timestamp from 'mongoose-timestamp';

// Setting mongoose
set('useFindAndModify', false);
set('useCreateIndex', true);

const schema = new Schema(
  {
    phone: { type: String, required: true, unique: true, index: true },
    salt: { type: String, required: false },
    password: { type: String, required: false },
    status: { type: Number, required: false, default: 0 },
    type: { type: Number, required: false, default: 0 },
    email: { type: String, required: false },
    username: { type: String, required: false, min: 8 },
    name: { type: String, required: false },
    family: { type: String, required: false },
    avatar: { type: String, required: false, default: null },
    nationalCode: { type: String, required: false },
    offerCodes: { type: Array, required: false, default: [] },
    secret: { type: String, required: false },
    locations: [{
      default: { type: Boolean, required: true, default: false },
      lat: { type: String, required: true },
      lng: { type: String, required: true },
      originalAddress: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: false },
      city: { type: String, required: true },
      village: { type: String, required: true },
      zipCode: { type: String, required: true },
      plaque: { type: String, required: true },
      hasReceiver: { type: Boolean, required: true },
      receiver: {
        firstName: { type: String, required: false },
        lastName: { type: String, required: false },
        nationalId: { type: String, required: false },
        phoneNumber: { type: String, required: false },
      },
    }],
    telegram: {
      id: { type: String, required: false },
      first_name: { type: String, required: false },
      username: { type: String, required: false },
      type: { type: String, required: false },
    },
    Installment: {
      check: { type: String, required: false },
      turnover: { type: String, required: false },
      nationalCard: { type: String, required: false },
    },
    bio: {
      description: { type: String, required: false },
      files: { type: Array, required: false },
    }
  },
  {
    minimize: false,
    versionKey: false,
  },
);

// Add plugins
schema.plugin(paginate);
schema.plugin(timestamp);

const modelSchema = model('users', schema);

// Index fields
modelSchema.ensureIndexes((err) => {
  if (err) {
    console.error('user model error :', err.message);
  }
});

export default modelSchema;

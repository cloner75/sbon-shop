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
    family: { type: String, required: true },
    lastCertificate: { type: String, required: true },
    gender: { type: String, required: true },
    birthday: { type: String, required: true },
    placeOfBirthday: { type: String, required: true },
    picture: { type: String, required: false },
    maritalStatus: { type: String, required: false },
    countChild: { type: String, required: false },
    doubleChance: { type: Boolean, required: true, default: false },
    amount: { type: String, required: true, default: 1500000 },
    spouse: {
      name: { type: String, required: false },
      family: { type: String, required: false },
      lastCertificate: { type: String, required: false },
      birthday: { type: String, required: false },
      address: { type: String, required: false },
      passport: {
        picture: { type: String, required: false },
        number: { type: String, required: false },
        expired: { type: String, required: false }
      },
    },
    childs: [{
      name: { type: String, required: false },
      family: { type: String, required: false },
      lastCertificate: { type: String, required: false },
      gender: { type: String, required: false },
      birthday: { type: String, required: false },
      placeOfBirthday: { type: String, required: false },
      picture: { type: String, required: false },
      maritalStatus: { type: String, required: false },
    }],
    passport: {
      number: { type: String, rqeuired: false },
      expired: { type: String, rqeuired: false },
      picture: { type: String, rqeuired: false },
    },
    status: { type: Number, required: false, default: 0 },// 0 => not Pay , 1 => Payeid
    userId: { type: Schema.Types.ObjectId, required: false },
    orderId: { type: String, rqeuired: false },
    RRN: { type: String, rqeuired: false },
    token: { type: String, rqeuired: false },
    email: { type: String, required: true }
  },
  {
    minimize: false,
    versionKey: false,
  },
);

// Add plugins
schema.plugin(paginate);
schema.plugin(timestamp);

const modelSchema = model('mrlottory', schema);

// Index fields
modelSchema.ensureIndexes((err) => {
  if (err) {
    console.error('mrlottory model error :', err.message);
  }
});

export default modelSchema;

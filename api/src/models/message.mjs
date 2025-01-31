import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  text: { type: String, required: true },
  times: { type: String, required: true },
  idconv: { type: String, required: true },
  author: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true }
  }
}, {
  collection: 'messages',
  minimize: false,
  versionKey: false
}).set('toJSON', {
  transform: (doc, ret) => {
    const retUpdated = ret;
    retUpdated.id = ret._id;

    delete retUpdated._id;

    return retUpdated;
  }
});

export default Schema;

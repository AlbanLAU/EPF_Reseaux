import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  idgroup: Number,
  namegroup: String
}, {
  collection: 'groups',
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

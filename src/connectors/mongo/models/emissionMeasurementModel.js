import mongoose from 'mongoose';

import counter from './counterModel';

const emissionMeasurementSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  emissionStation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmissionStation',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  particles: {
    type: Number,
    required: true,
  },
  nox: {
    type: Number,
    required: true,
  },
  so2: {
    type: Number,
    required: true,
  },
  no2: {
    type: Number,
    required: true,
  },
  no: {
    type: Number,
    required: true,
  },
  co: {
    type: Number,
    required: true,
  },
});

emissionMeasurementSchema.pre('save', async function () { // eslint-disable-line
  const count = await counter.findOneAndUpdate({ _id: 'emissionCounter' }, { $inc: { seq: 1 } });
  this.id = count.seq;
});

const emissionMeasurementModel = mongoose.model('EmissionMeasurement', emissionMeasurementSchema);

export default emissionMeasurementModel;

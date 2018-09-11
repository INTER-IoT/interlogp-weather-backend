import mongoose from 'mongoose';

import counter from './counterModel';

const soundMeasurementSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  soundStation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SoundStation',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  minLevel: {
    type: Number,
    required: true,
  },
  maxLevel: {
    type: Number,
    required: true,
  },
  avgLevel: {
    type: Number,
    required: true,
  },
});

soundMeasurementSchema.pre('save', async function () { // eslint-disable-line
  const count = await counter.findOneAndUpdate({ _id: 'soundCounter' }, { $inc: { seq: 1 } });
  this.id = count.seq;
});

const soundMeasurementModel = mongoose.model('SoundMeasurement', soundMeasurementSchema);

export default soundMeasurementModel;

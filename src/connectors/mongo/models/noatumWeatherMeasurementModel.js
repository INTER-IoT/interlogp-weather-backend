import mongoose from 'mongoose';

import counter from './counterModel';

const noatumWeatherMeasurementSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  noatumWeatherStation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NoatumWeatherStation',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  windSpeed: {
    type: Number,
    required: true,
  },
});

noatumWeatherMeasurementSchema.pre('save', async function () { // eslint-disable-line
  const count = await counter.findOneAndUpdate({ _id: 'noatumWeatherCounter' }, { $inc: { seq: 1 } });
  this.id = count.seq;
});

const noatumWeatherMeasurementModel = mongoose.model('NoatumWeatherMeasurement', noatumWeatherMeasurementSchema);

export default noatumWeatherMeasurementModel;

import mongoose from 'mongoose';

import counter from './counterModel';

const weatherMeasurementSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  weatherStation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WeatherStation',
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
  precipitation: {
    type: Number,
    required: true,
  },
  solarRadiation: {
    type: Number,
    required: true,
  },
  pressure: {
    type: Number,
    required: true,
  },
  humidity: {
    type: Number,
    required: true,
  },
  seaTemperature: {
    type: Number,
    required: true,
  },
  averageTemperature: {
    type: Number,
    required: true,
  },
  windDirection: {
    type: Number,
    required: true,
  },
});

weatherMeasurementSchema.pre('save', async function () { // eslint-disable-line
  const count = await counter.findOneAndUpdate({ _id: 'weatherCounter' }, { $inc: { seq: 1 } });
  this.id = count.seq;
});

const weatherMeasurementModel = mongoose.model('WeatherMeasurement', weatherMeasurementSchema);

export default weatherMeasurementModel;

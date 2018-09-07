import mongoose from 'mongoose';

import counter from './counterModel';

const weatherMeasurementSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
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

weatherMeasurementSchema.pre('save', function pre(next) {
  const doc = this;
  counter.findOneAndUpdate({ _id: 'weatherCounter' }, { $inc: { seq: 1 } }, (error, count) => {
    if (error) return next(error);
    doc.testvalue = count.seq;
    next();
  });
});

const weatherMeasurementModel = mongoose.model('WeatherMeasurement', weatherMeasurementSchema);

export default weatherMeasurementModel;

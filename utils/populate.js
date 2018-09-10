/* eslint-disable no-underscore-dangle */

import mongoose from 'mongoose';

import { WeatherStationModel, WeatherMeasurementModel } from '../src/connectors/mongo/models';

import {
  generateMeasurements,
} from './fake-data';

const mongourl = process.argv[2];
const numMeasurements = process.argv[3];

mongoose.connect(mongourl, {
  useNewUrlParser: true,
});

mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.on('error', () => {
  console.error.bind(console, 'connection error:');
  process.exit(1);
});

const run = async () => {
  process.stdout.write('Saving weather measurements...');
  const weatherStations = await WeatherStationModel.find();

  await Promise.all(weatherStations.reduce((weatherMeasurements, weatherStation) => {
    const weatherStationMeasurements = generateMeasurements('weatherMeasurement', numMeasurements)
      .map((measurement) => {
        measurement.weatherStation = weatherStation._id;
        return measurement;
      });
    weatherMeasurements.push(...weatherStationMeasurements);
    return weatherMeasurements;
  }, []).map(weatherMeasurement => new WeatherMeasurementModel(weatherMeasurement).save()));

  process.stdout.write('done\n');
  process.exit(0);
};

db.once('open', run);

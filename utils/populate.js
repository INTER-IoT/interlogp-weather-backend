/* eslint-disable no-underscore-dangle */

import mongoose from 'mongoose';

import { PortModel, WeatherStationModel, WeatherMeasurementModel, CounterModel } from '../src/models';

import {
  fakeGenerator,
  Ports,
  WeatherStations,
  WeatherMeasurements,
} from './fake-connector';

const mongourl = process.argv[2];
const numMeasurements = process.argv[3];

fakeGenerator(numMeasurements);

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
  await new CounterModel({ _id: 'weatherCounter' }).save();
  process.stdout.write('Saving ports...');
  await PortModel.remove({});
  const ports = await Promise.all(Ports.ports().map(port => new PortModel(port).save()));
  process.stdout.write('done\n');

  process.stdout.write('Saving weather stations...');
  await WeatherStationModel.remove({});
  const weatherStations = await Promise.all(WeatherStations.weatherStations().map((weatherStation) => {
    weatherStation.port = ports.find(port => port.id === weatherStation.port.id)._id;
    return weatherStation;
  }).map(weatherStation => new WeatherStationModel(weatherStation).save()));
  process.stdout.write('done\n');

  process.stdout.write('Saving weather measurements...');
  await WeatherMeasurementModel.remove({});
  await Promise.all(WeatherMeasurements.weatherMeasurements().map((weatherMeasurement) => {
    weatherMeasurement.weatherStation = weatherStations
      .find(weatherStation => weatherStation.id === weatherMeasurement.weatherStation.id)._id;
    return weatherMeasurement;
  }).map(weatherMeasurement => new WeatherMeasurementModel(weatherMeasurement).save()));
  process.stdout.write('done\n');
  process.exit(0);
};

db.once('open', run);

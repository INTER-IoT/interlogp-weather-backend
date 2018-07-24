/* eslint-disable no-underscore-dangle */

import mongoose from 'mongoose';
import config from './config';

import { PortModel, WeatherStationModel, WeatherMeasurementModel } from './models';

import {
  fakeGenerator,
  Ports,
  WeatherStations,
  WeatherMeasurements,
} from './fake-connector';

fakeGenerator(10, 100);

const user = process.env.MONGODB_USER;
const pwd = process.env.MONGODB_PASSWORD;

const userString = user ? pwd ? `${user}:${pwd}@` : `${user}@` : ''; // eslint-disable-line no-nested-ternary

mongoose.connect(`mongodb://${userString}${config.mongo.host}:${config.mongo.port}/${config.mongo.database}`, {
  useNewUrlParser: true,
});

mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.on('error', () => {
  console.error.bind(console, 'connection error:');
  process.exit(1);
});

const run = async () => {
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

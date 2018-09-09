/* eslint-disable no-underscore-dangle */

import mongoose from 'mongoose';

import {
  PortModel,
  WeatherStationModel,
  CounterModel,
  WeatherMeasurementModel,
} from '../src/connectors/mongo/models';

import portData from './data/ports';

import weatherStationData from './data/weatherStations';

const mongourl = process.argv[2];

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
  await CounterModel.remove({});
  await PortModel.remove({});
  await WeatherStationModel.remove({});
  await WeatherMeasurementModel.remove({});

  await new CounterModel({ _id: 'weatherCounter' }).save();

  process.stdout.write('Saving ports...');
  const ports = await Promise.all(portData.map(port => new PortModel(port).save()));
  process.stdout.write('done\n');

  process.stdout.write('Saving weather stations...');
  await Promise.all(weatherStationData.map((weatherStation) => {
    weatherStation.port = ports.find(port => port.id === weatherStation.portId)._id;
    return weatherStation;
  }).map(weatherStation => new WeatherStationModel(weatherStation).save()));
  process.stdout.write('done\n');

  process.exit(0);
};

db.once('open', run);

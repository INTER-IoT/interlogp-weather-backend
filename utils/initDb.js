/* eslint-disable no-underscore-dangle */

import mongoose from 'mongoose';

import {
  PortModel,
  WeatherStationModel,
  EmissionStationModel,
  SoundStationModel,
  NoatumWeatherStationModel,
  CounterModel,
  WeatherMeasurementModel,
  EmissionMeasurementModel,
  SoundMeasurementModel,
  NoatumWeatherMeasurementModel,
  AlertModel,
  RuleModel,
  IntermwMessageModel,
  StatisticModel,
} from '../src/connectors/mongo/models';

import portData from './data/ports';
import weatherStationData from './data/weatherStations';
import emissionStationData from './data/emissionStations';
import soundStationData from './data/soundStations';
import noatumStationData from './data/noatumWeatherStations';

const mongourl = process.argv[2];

mongoose.connect(mongourl, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.on('error', () => {
  console.error.bind(console, 'connection error:');
  process.exit(1);
});

const run = async () => {
  process.stdout.write('Removing existing data...');
  await CounterModel.deleteMany({});
  await PortModel.deleteMany({});
  await WeatherStationModel.deleteMany({});
  await EmissionStationModel.deleteMany({});
  await SoundStationModel.deleteMany({});
  await NoatumWeatherStationModel.deleteMany({});
  await WeatherMeasurementModel.deleteMany({});
  await EmissionMeasurementModel.deleteMany({});
  await SoundMeasurementModel.deleteMany({});
  await NoatumWeatherMeasurementModel.deleteMany({});
  await AlertModel.deleteMany({});
  await RuleModel.deleteMany({});
  await IntermwMessageModel.deleteMany({});
  await StatisticModel.deleteMany({});
  process.stdout.write('done\n');

  process.stdout.write('Saving counters...');
  await new CounterModel({ _id: 'weatherCounter' }).save();
  await new CounterModel({ _id: 'emissionCounter' }).save();
  await new CounterModel({ _id: 'soundCounter' }).save();
  await new CounterModel({ _id: 'noatumWeatherCounter' }).save();
  await new CounterModel({ _id: 'alertCounter' }).save();
  await new CounterModel({ _id: 'ruleCounter' }).save();
  process.stdout.write('done\n');

  process.stdout.write('Saving ports...');
  const ports = await Promise.all(portData.map(port => new PortModel(port).save()));
  process.stdout.write('done\n');

  process.stdout.write('Saving weather stations...');
  await Promise.all(weatherStationData.map((weatherStation) => {
    weatherStation.port = ports.find(port => port.id === weatherStation.portId)._id;
    return weatherStation;
  }).map(weatherStation => new WeatherStationModel(weatherStation).save()));
  process.stdout.write('done\n');

  process.stdout.write('Saving emission stations...');
  await Promise.all(emissionStationData.map((emissionStation) => {
    emissionStation.port = ports.find(port => port.id === emissionStation.portId)._id;
    return emissionStation;
  }).map(emissionStation => new EmissionStationModel(emissionStation).save()));
  process.stdout.write('done\n');

  process.stdout.write('Saving sound stations...');
  await Promise.all(soundStationData.map((soundStation) => {
    soundStation.port = ports.find(port => port.id === soundStation.portId)._id;
    return soundStation;
  }).map(soundStation => new SoundStationModel(soundStation).save()));
  process.stdout.write('done\n');

  process.stdout.write('Saving noatumWeather stations...');
  await Promise.all(noatumStationData.map((noatumWeatherStation) => {
    noatumWeatherStation.port = ports.find(port => port.id === noatumWeatherStation.portId)._id;
    return noatumWeatherStation;
  }).map(noatumWeatherStation => new NoatumWeatherStationModel(noatumWeatherStation).save()));
  process.stdout.write('done\n');

  process.exit(0);
};

db.once('open', run);

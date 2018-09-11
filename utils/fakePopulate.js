/* eslint-disable no-underscore-dangle */

import mongoose from 'mongoose';

import {
  WeatherStationModel,
  WeatherMeasurementModel,
  EmissionStationModel,
  EmissionMeasurementModel,
  SoundStationModel,
  SoundMeasurementModel,
} from '../src/connectors/mongo/models';

import fakeData from './fake-data';

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
  const weatherStations = await WeatherStationModel.find();
  const emissionStations = await EmissionStationModel.find();
  const soundStations = await SoundStationModel.find();

  process.stdout.write(`Generating ${numMeasurements} fake measurements per weather station...`);
  const weatherMeasurements = weatherStations.reduce((measurements, weatherStation) => {
    const weatherStationMeasurements = fakeData.generateWeatherMeasurements(numMeasurements)
      .map((measurement) => {
        measurement.weatherStation = weatherStation._id;
        return measurement;
      });
    measurements.push(...weatherStationMeasurements);
    return measurements;
  }, []);
  process.stdout.write('done\n');

  process.stdout.write(`Generating ${numMeasurements} fake measurements per emission station...`);
  const emissionMeasurements = emissionStations.reduce((measurements, emissionStation) => {
    const emissionStationMeasurements = fakeData.generateEmissionMeasurements(numMeasurements)
      .map((measurement) => {
        measurement.emissionStation = emissionStation._id;
        return measurement;
      });
    measurements.push(...emissionStationMeasurements);
    return measurements;
  }, []);
  process.stdout.write('done\n');

  process.stdout.write(`Generating ${numMeasurements} fake measurements per sound station...`);
  const soundMeasurements = soundStations.reduce((measurements, soundStation) => {
    const soundStationMeasurements = fakeData.generateSoundMeasurements(numMeasurements)
      .map((measurement) => {
        measurement.soundStation = soundStation._id;
        return measurement;
      });
    measurements.push(...soundStationMeasurements);
    return measurements;
  }, []);
  process.stdout.write('done\n');

  process.stdout.write('Saving generated weather measurements...');
  await Promise.all(weatherMeasurements.map(weatherMeasurement => new WeatherMeasurementModel(weatherMeasurement).save()));
  process.stdout.write('done\n');

  process.stdout.write('Saving generated emission measurements...');
  await Promise.all(emissionMeasurements.map(emissionMeasurement => new EmissionMeasurementModel(emissionMeasurement).save()));
  process.stdout.write('done\n');

  process.stdout.write('Saving generated sound measurements...');
  await Promise.all(soundMeasurements.map(soundMeasurement => new SoundMeasurementModel(soundMeasurement).save()));
  process.stdout.write('done\n');

  process.exit(0);
};

db.once('open', run);

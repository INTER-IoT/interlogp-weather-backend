import mongoose from 'mongoose';
import config from './config';

import { PortModel, WeatherStationModel, WeatherMeasurementModel } from './models';

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

const Ports = {};

Ports.ports = () => PortModel.find();

Ports.port = id => PortModel.findOne({ id });

const WeatherStations = {};

WeatherStations.weatherStations = () => WeatherStationModel.find().populate('port');

WeatherStations.weatherStationsByPort = async (portId) => {
  const weatherStations = await WeatherStationModel.find().populate({
    path: 'port',
    match: {
      id: portId,
    },
  });
  return weatherStations.filter(weatherStation => weatherStation.port !== null);
};

const WeatherMeasurements = {};

WeatherMeasurements.weatherMeasurements = () => WeatherMeasurementModel.find().populate('weatherStation');

WeatherMeasurements.weatherMeasurementsByStation = async (weatherStationId) => {
  const weatherMeasurements = await WeatherMeasurementModel.find().populate({
    path: 'weatherStation',
    match: {
      id: weatherStationId,
    },
  });
  return weatherMeasurements.filter(weatherMeasurement => weatherMeasurement.weatherStation !== null);
};


WeatherMeasurements.lastMeasurementByStation = async (weatherStationId) => {
  const weatherMeasurements = await WeatherMeasurements.weatherMeasurementsByStation(weatherStationId);
  return weatherMeasurements.sort((a, b) => b.date - a.date)[0];
};

WeatherMeasurements.lastMeasurementsByPort = async (portId) => {
  const weatherStations = await WeatherStations.weatherStationsByPort(portId);
  const measurements = await Promise.all(weatherStations.map(weatherStation => WeatherMeasurements.lastMeasurementByStation(weatherStation.id)));
  console.log(measurements);
  return measurements;
};


export {
  Ports,
  WeatherStations,
  WeatherMeasurements,
};

export default {
  Ports,
  WeatherStations,
  WeatherMeasurements,
};

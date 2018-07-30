import mongoose from 'mongoose';
import config from './config';

import { PortModel, WeatherStationModel, WeatherMeasurementModel } from './models';

const mongo = {};

mongo.user = process.env.MONGO_USER;
mongo.pwd = process.env.MONGO_PASSWORD;

mongo.userString = mongo.user ? mongo.pwd ? `${mongo.user}:${mongo.pwd}@` : `${mongo.user}@` : ''; // eslint-disable-line no-nested-ternary

mongo.host = process.env.MONGO_HOST || config.mongo.host;
mongo.port = process.env.MONGO_PORT || config.mongo.port;
mongo.database = process.env.MONGO_DATABASE || config.mongo.database;

mongoose.connect(`mongodb://${mongo.userString}${mongo.host}:${mongo.port}/${mongo.database}`, {
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

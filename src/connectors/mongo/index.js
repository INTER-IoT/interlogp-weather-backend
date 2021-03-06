import mongoose from 'mongoose';
import config from '../../config';

import Ports from './ports';
import WeatherStations from './weatherStations';
import WeatherMeasurements from './weatherMeasurements';
import EmissionStations from './emissionStations';
import EmissionMeasurements from './emissionMeasurements';
import SoundStations from './soundStations';
import SoundMeasurements from './soundMeasurements';
import NoatumWeatherStations from './noatumWeatherStations';
import NoatumWeatherMeasurements from './noatumWeatherMeasurements';
import Alerts from './alerts';
import IntermwMessages from './intermwMessages';
import Rules from './rules';
import Statistics from './statistics';

const mongo = {};

mongo.user = process.env.MONGO_USER;
mongo.pwd = process.env.MONGO_PWD;

mongo.userString = mongo.user ? mongo.pwd ? `${mongo.user}:${mongo.pwd}@` : `${mongo.user}@` : ''; // eslint-disable-line no-nested-ternary

mongo.host = process.env.MONGO_HOST || config.mongo.host;
mongo.port = process.env.MONGO_PORT || config.mongo.port;
mongo.database = process.env.MONGO_DATABASE || config.mongo.database;

mongoose.connect(`mongodb://${mongo.userString}${mongo.host}:${mongo.port}/${mongo.database}`, {
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

export {
  Ports,
  WeatherStations,
  WeatherMeasurements,
  EmissionStations,
  EmissionMeasurements,
  SoundStations,
  SoundMeasurements,
  NoatumWeatherStations,
  NoatumWeatherMeasurements,
  Alerts,
  IntermwMessages,
  Rules,
  Statistics,
};

export default {
  Ports,
  WeatherStations,
  WeatherMeasurements,
  EmissionStations,
  EmissionMeasurements,
  SoundStations,
  SoundMeasurements,
  NoatumWeatherStations,
  NoatumWeatherMeasurements,
  Alerts,
  IntermwMessages,
  Rules,
  Statistics,
};

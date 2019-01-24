/* eslint-disable no-underscore-dangle */

import mongoose from 'mongoose';

import Statistics from '../src/connectors/mongo/statistics';

// import { StatisticModel } from '../src/connectors/mongo/models';

const mongourl = process.argv[2];

mongoose.connect(mongourl, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

mongoose.set('debug', true);

mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.on('error', () => {
  console.error.bind(console, 'connection error:');
  process.exit(1);
});

const run = async () => {
  await Statistics.generate();
  process.exit(0);
};

db.once('open', run);

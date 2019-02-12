/* eslint-disable no-underscore-dangle */

import mongoose from 'mongoose';

import { IntermwMessageModel } from '../src/connectors/mongo/models';

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
  const last100 = await IntermwMessageModel.find().sort({ date: -1 }).limit(100);
  if (last100 && last100.length > 0) {
    const lastDate = last100[last100.length - 1].date;
    const deleted = await IntermwMessageModel.deleteMany({ date: { $lt: lastDate } });
    console.log(`Deleted: ${deleted.n} old IntermwMessages`);
  }
  process.exit(0);
};

db.once('open', run);

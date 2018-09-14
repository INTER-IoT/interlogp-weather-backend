import mongoose from 'mongoose';

import {
  PortModel,
  AlertModel,
} from '../src/connectors/mongo/models';

const mongourl = process.argv[2];

const portId = process.argv[3];

const text = process.argv[4];

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
  const alert = {
    text,
    date: new Date(),
    processed: false,
    port: await PortModel.findOne({ id: portId }),
  };
  await new AlertModel(alert).save();

  process.exit(0);
};

db.once('open', run);

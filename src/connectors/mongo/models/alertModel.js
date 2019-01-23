import mongoose from 'mongoose';

import counter from './counterModel';

const alertSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  date: {
    type: Date,
    required: true,
  },
  dateProcessed: {
    type: Date,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  port: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Port',
    required: true,
  },
  processed: {
    type: Boolean,
    required: true,
  },
});

alertSchema.pre('save', async function () { // eslint-disable-line
  const count = await counter.findOneAndUpdate({ _id: 'alertCounter' }, { $inc: { seq: 1 } });
  this.id = count.seq;
});

const alertModel = mongoose.model('Alert', alertSchema);

export default alertModel;

import mongoose from 'mongoose';

import counter from './counterModel';

const ruleSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  port: {
    type: [Number],
  },
  type: {
    type: String,
    required: true,
  },
  station: {
    type: [Number],
  },
  attribute: {
    type: String,
    required: true,
  },
  comparison: {
    type: Number,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  inclusive: {
    type: Boolean,
    required: true,
  },
  enabled: {
    type: Boolean,
    required: true,
    default: true,
  },
});

ruleSchema.pre('save', async function () { // eslint-disable-line
  const count = await counter.findOneAndUpdate({ _id: 'ruleCounter' }, { $inc: { seq: 1 } });
  this.id = count.seq;
});

const ruleModel = mongoose.model('Rule', ruleSchema);

export default ruleModel;

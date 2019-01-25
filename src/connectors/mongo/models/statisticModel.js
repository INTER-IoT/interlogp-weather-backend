import mongoose from 'mongoose';

const statisticSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: false,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: false,
  },
  statType: {
    type: String,
    required: true,
  },
  period: {
    type: String,
    required: true,
  },
  stationId: {
    type: Number,
    required: true,
  },
  portId: {
    type: Number,
    required: true,
  },
  average: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

statisticSchema.pre('save', async function () { // eslint-disable-line
  if (this.period === 'daily') this.date = new Date(`${this.year}-${`00${this.month}`.substr(-2, 2)}-${`00${this.day}`.substr(-2, 2)}`);
});

const statisticModel = mongoose.model('Statistic', statisticSchema);

export default statisticModel;

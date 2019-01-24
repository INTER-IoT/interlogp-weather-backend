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

const statisticModel = mongoose.model('Statistic', statisticSchema);

export default statisticModel;

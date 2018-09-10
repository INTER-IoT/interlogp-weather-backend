import mongoose from 'mongoose';

const soundStationSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  port: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Port',
    required: true,
  },
  position: {
    lat: {
      type: Number,
      required: true,
    },
    lon: {
      type: Number,
      required: true,
    },
  },
});

const soundStationModel = mongoose.model('SoundStation', soundStationSchema);

export default soundStationModel;

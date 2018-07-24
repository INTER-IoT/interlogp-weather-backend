import mongoose from 'mongoose';

const weatherStationSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
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

const weatherStationModel = mongoose.model('WeatherStation', weatherStationSchema);

export default weatherStationModel;

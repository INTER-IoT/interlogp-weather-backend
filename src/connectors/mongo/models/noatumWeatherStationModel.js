import mongoose from 'mongoose';

const noatumWeatherStationSchema = new mongoose.Schema({
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

const noatumWeatherStationModel = mongoose.model('NoatumWeatherStation', noatumWeatherStationSchema);

export default noatumWeatherStationModel;

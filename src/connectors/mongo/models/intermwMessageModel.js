import mongoose from 'mongoose';

const intermwMessageSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  weatherStation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WeatherStation',
  },
  soundStation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SoundStation',
  },
  emissionStation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmissionStation',
  },
  content: {
    type: String,
    required: true,
  },
});

const intermwMessageModel = mongoose.model('IntermwMessage', intermwMessageSchema);

export default intermwMessageModel;

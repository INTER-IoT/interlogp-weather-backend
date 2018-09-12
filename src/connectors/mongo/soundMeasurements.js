import { SoundMeasurementModel, SoundStationModel } from './models';
import SoundStations from './soundStations';

const SoundMeasurements = {};

SoundMeasurements.measurements = () => SoundMeasurementModel.find().populate('soundStation');

SoundMeasurements.measurementsByStation = async (soundStationId) => {
  const soundMeasurements = await SoundMeasurementModel.find().populate({
    path: 'soundStation',
    match: {
      id: soundStationId,
    },
  });
  return soundMeasurements.filter(soundMeasurement => soundMeasurement.soundStation !== null);
};

SoundMeasurements.lastMeasurementByStation = async (soundStationId) => {
  const soundMeasurements = await SoundMeasurements.measurementsByStation(soundStationId);
  return soundMeasurements.sort((a, b) => a.date - b.date)[0];
};

SoundMeasurements.lastMeasurementsByPort = async (portId) => {
  const soundStations = await SoundStations.stationsByPort(portId);
  const measurements = await Promise.all(soundStations.map(soundStation => SoundMeasurements.lastMeasurementByStation(soundStation.id)));
  return measurements.reduce((agg, item) => {
    if (item !== undefined && item !== null) agg.push(item);
    return agg;
  }, []);
};

SoundMeasurements.saveNewMeasurement = async (measurement) => {
  console.log(measurement.stationId);
  measurement.soundStation = await SoundStationModel.findOne({ id: measurement.stationId });
  console.log(measurement.soundStation);
  await new SoundMeasurementModel(measurement).save();
  return measurement;
};

export default SoundMeasurements;

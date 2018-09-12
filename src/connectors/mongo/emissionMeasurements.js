import { EmissionMeasurementModel, EmissionStationModel } from './models';
import EmissionStations from './emissionStations';

const EmissionMeasurements = {};

EmissionMeasurements.measurements = () => EmissionMeasurementModel.find().populate('emissionStation');

EmissionMeasurements.measurementsByStation = async (emissionStationId) => {
  const emissionMeasurements = await EmissionMeasurementModel.find().populate({
    path: 'emissionStation',
    match: {
      id: emissionStationId,
    },
  });
  return emissionMeasurements.filter(emissionMeasurement => emissionMeasurement.emissionStation !== null);
};

EmissionMeasurements.lastMeasurementByStation = async (emissionStationId) => {
  const emissionMeasurements = await EmissionMeasurements.measurementsByStation(emissionStationId);
  return emissionMeasurements.sort((a, b) => b.date - a.date)[0];
};

EmissionMeasurements.lastMeasurementsByPort = async (portId) => {
  const emissionStations = await EmissionStations.stationsByPort(portId);
  const measurements = await Promise.all(emissionStations.map(emissionStation => EmissionMeasurements.lastMeasurementByStation(emissionStation.id)));

  return measurements.reduce((agg, item) => {
    if (item !== undefined && item !== null) agg.push(item);
    return agg;
  }, []);
};

EmissionMeasurements.saveNewMeasurement = async (measurement) => {
  measurement.emissionStation = await EmissionStationModel.findOne({ id: measurement.stationId });
  await new EmissionMeasurementModel(measurement).save();
  return measurement;
};

export default EmissionMeasurements;

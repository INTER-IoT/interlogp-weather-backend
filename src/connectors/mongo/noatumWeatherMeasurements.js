import { NoatumWeatherMeasurementModel, NoatumWeatherStationModel } from './models';
import NoatumWeatherStations from './noatumWeatherStations';

const NoatumWeatherMeasurements = {};

NoatumWeatherMeasurements.measurements = () => NoatumWeatherMeasurementModel.find().populate('noatumWeatherStation');

NoatumWeatherMeasurements.measurementsByStation = async (noatumWeatherStationId) => {
  const noatumWeatherMeasurements = await NoatumWeatherMeasurementModel.find().populate({
    path: 'noatumWeatherStation',
    match: {
      id: noatumWeatherStationId,
    },
  });
  return noatumWeatherMeasurements.filter(noatumWeatherMeasurement => noatumWeatherMeasurement.noatumWeatherStation !== null);
};

NoatumWeatherMeasurements.lastMeasurementByStation = async (noatumWeatherStationId) => {
  const noatumWeatherMeasurements = await NoatumWeatherMeasurements.measurementsByStation(noatumWeatherStationId);
  return noatumWeatherMeasurements.sort((a, b) => b.date - a.date)[0];
};

NoatumWeatherMeasurements.lastMeasurementsByPort = async (portId) => {
  const noatumWeatherStations = await NoatumWeatherStations.stationsByPort(portId);
  const measurements = await Promise.all(noatumWeatherStations.map(noatumWeatherStation => NoatumWeatherMeasurements.lastMeasurementByStation(noatumWeatherStation.id)));

  return measurements.reduce((agg, item) => {
    if (item !== undefined && item !== null) agg.push(item);
    return agg;
  }, []);
};

NoatumWeatherMeasurements.saveNewMeasurement = async (measurement) => {
  measurement.noatumWeatherStation = await NoatumWeatherStationModel.findOne({ id: measurement.stationId });
  await new NoatumWeatherMeasurementModel(measurement).save();
  const populatedMeasurement = await NoatumWeatherMeasurementModel.populate(measurement, {
    path: 'noatumWeatherStation',
    populate: {
      path: 'port',
    },
  });
  return populatedMeasurement;
};

export default NoatumWeatherMeasurements;

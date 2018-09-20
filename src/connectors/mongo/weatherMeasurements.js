import { WeatherMeasurementModel, WeatherStationModel } from './models';
import WeatherStations from './weatherStations';

const WeatherMeasurements = {};

WeatherMeasurements.measurements = () => WeatherMeasurementModel.find().populate('weatherStation');

WeatherMeasurements.measurementsByStation = async (weatherStationId) => {
  const weatherMeasurements = await WeatherMeasurementModel.find().populate({
    path: 'weatherStation',
    match: {
      id: weatherStationId,
    },
  });
  return weatherMeasurements.filter(weatherMeasurement => weatherMeasurement.weatherStation !== null);
};

WeatherMeasurements.lastMeasurementByStation = async (weatherStationId) => {
  const weatherMeasurements = await WeatherMeasurements.measurementsByStation(weatherStationId);
  return weatherMeasurements.sort((a, b) => b.date - a.date)[0];
};

WeatherMeasurements.lastMeasurementsByPort = async (portId) => {
  const weatherStations = await WeatherStations.stationsByPort(portId);
  const measurements = await Promise.all(weatherStations.map(weatherStation => WeatherMeasurements.lastMeasurementByStation(weatherStation.id)));

  return measurements.reduce((agg, item) => {
    if (item !== undefined && item !== null) agg.push(item);
    return agg;
  }, []);
};

WeatherMeasurements.saveNewMeasurement = async (measurement) => {
  measurement.weatherStation = await WeatherStationModel.findOne({ id: measurement.stationId });
  await new WeatherMeasurementModel(measurement).save();
  const populatedMeasurement = await WeatherMeasurementModel.populate(measurement, {
    path: 'weatherStation',
    populate: {
      path: 'port',
    },
  });
  return populatedMeasurement;
};

export default WeatherMeasurements;

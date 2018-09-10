import EmissionStations from './emissionStations';

const EmissionMeasurements = {};

const dummyMeasurement = station => ({
  id: station.id,
  date: new Date(),
  particles: 0.3,
  nox: 1,
  so2: 2,
  no2: 3,
  no: 4,
  co: 0.5,
  emissionStation: station,
});

EmissionMeasurements.measurements = async () => (await EmissionStations.stations()).map(dummyMeasurement);

EmissionMeasurements.measurementsByStation = async (emissionStationId) => {
  const station = (await EmissionStations.stations()).find(st => st.id === emissionStationId);
  return [dummyMeasurement(station)];
};

EmissionMeasurements.lastMeasurementByStation = async emissionStationId => (await EmissionMeasurements.measurementsByStation(emissionStationId))[0];

EmissionMeasurements.lastMeasurementsByPort = async portId => (await EmissionStations.stationsByPort(portId)).map(dummyMeasurement);

EmissionMeasurements.saveNewMeasurement = async (measurement) => {
  console.log('saving...');
  console.log(measurement);
};

export default EmissionMeasurements;

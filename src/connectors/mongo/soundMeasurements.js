import SoundStations from './soundStations';

const SoundMeasurements = {};

const dummyMeasurement = (station) => {
  const start = new Date();
  const end = new Date(start);
  end.setSeconds(end.getSeconds() + 30);
  return {
    id: station.id,
    start,
    end,
    maxLevel: 10,
    minLevel: 4,
    avgLevel: 7,
    soundStation: station,
  };
};

SoundMeasurements.measurements = async () => (await SoundStations.stations()).map(dummyMeasurement);

SoundMeasurements.measurementsByStation = async (soundtationId) => {
  const station = (await SoundStations.stations()).find(st => st.id === soundtationId);
  return [dummyMeasurement(station)];
};

SoundMeasurements.lastMeasurementByStation = async soundStationId => (await SoundMeasurements.measurementsByStation(soundStationId))[0];

SoundMeasurements.lastMeasurementsByPort = async portId => (await SoundStations.stationsByPort(portId)).map(dummyMeasurement);

SoundMeasurements.saveNewMeasurement = async (measurement) => {
  console.log('saving...');
  console.log(measurement);
};

export default SoundMeasurements;

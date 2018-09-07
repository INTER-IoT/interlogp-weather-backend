import _fakeGenerator from './fake-data';

let fakePorts;

const Ports = {};

Ports.ports = () => fakePorts;


const WeatherStations = {};

WeatherStations.weatherStations = () => fakePorts
  .reduce((weatherStations, port) => [...weatherStations, ...port.weatherStations], []);

WeatherStations.weatherStationsByPort = portId => fakePorts
  .find(port => port.id === portId).weatherStations;


const WeatherMeasurements = {};

WeatherMeasurements.weatherMeasurements = () => WeatherStations.weatherStations()
  .reduce((weatherMeasurements, station) => [...weatherMeasurements, ...station.weatherMeasurements], []);

WeatherMeasurements.weatherMeasurementsByStation = stationId => WeatherStations.weatherStations()
  .find(station => station.id === stationId).weatherMeasurements;

const fakeGenerator = (numMeasurements) => {
  fakePorts = _fakeGenerator.generate(numMeasurements);
};

export {
  fakeGenerator,
  Ports,
  WeatherStations,
  WeatherMeasurements,
};

export default {
  fakeGenerator,
  Ports,
  WeatherStations,
  WeatherMeasurements,
};

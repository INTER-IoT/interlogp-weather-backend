import fakeGenerator from './fake-measurements';

const fakePorts = fakeGenerator.generate(10, 100);

const Ports = {};

Ports.ports = () => fakePorts;


const WeatherStations = {};

WeatherStations.weatherStations = () => fakePorts
  .reduce((weatherStations, port) => [...weatherStations, ...port.weatherStations], []);

WeatherStations.weatherStationsByPort = portId => fakePorts
  .find(port => port.id === portId).weatherStations;


const WeatherMeasurements = {};

WeatherMeasurements.weatherMeasurements = () => WeatherStations.weatherStations()
  .reduce((weatherMeasurements, station) => {
    console.log(station);
    return [...weatherMeasurements, ...station.weatherMeasurements];
  }, []);

WeatherMeasurements.weatherMeasurementsByStation = stationId => WeatherStations.weatherStations()
.find(station => station.id === stationId).weatherMeasurements;


/* eslint import/prefer-default-export: off */
export { Ports, WeatherStations };

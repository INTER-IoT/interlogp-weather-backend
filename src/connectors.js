
const Ports = {};

Ports.ports = () => [
  { id: 1, name: 'Valencia', position: { lat: 0, lon: 0 } },
  { id: 2, name: 'Sagunto', position: { lat: 0, lon: 0 } },
  { id: 3, name: 'Gandia', position: { lat: 0, lon: 0 } },
];

const Stations = {};

Stations.stations = () => [
  { id: 1, port: Ports.ports().find(port => port.id === 1), position: { lat: 0, lon: 0 } },
  { id: 2, port: Ports.ports().find(port => port.id === 1), position: { lat: 0, lon: 0 } },
  { id: 3, port: Ports.ports().find(port => port.id === 2), position: { lat: 0, lon: 0 } },
];

Stations.stationsByPort = portId => Stations.stations().filter(station => station.port.id === portId);

/* eslint import/prefer-default-export: off */
export { Ports, Stations };

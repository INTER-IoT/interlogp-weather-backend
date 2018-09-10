// import { WeatherStationModel } from './models';
import Ports from './ports';

const EmissionStations = {};

EmissionStations.stations = async () => (await Ports.ports()).map(port => ({
  id: port.id,
  position: port.position,
  port,
  name: `${port.name} emission station`,
}));

EmissionStations.stationsByPort = async (portId) => {
  const port = await Ports.port(portId);
  return {
    id: port.id,
    position: port.position,
    port,
    name: `${port.name} emission station`,
  };
};

export default EmissionStations;

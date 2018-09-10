// import { WeatherStationModel } from './models';
import Ports from './ports';

const SoundStations = {};

SoundStations.stations = async () => (await Ports.ports()).map(port => ({
  id: port.id,
  position: port.position,
  port,
  name: `${port.name} sound station`,
}));

SoundStations.stationsByPort = async (portId) => {
  const port = await Ports.port(portId);
  return {
    id: port.id,
    position: port.position,
    port,
    name: `${port.name} sound station`,
  };
};

export default SoundStations;

import { EmissionStationModel } from './models';

const EmissionStations = {};

EmissionStations.stations = () => EmissionStationModel.find().populate('port');

EmissionStations.stationsByPort = async (portId) => {
  const emissionStations = await EmissionStationModel.find().populate({
    path: 'port',
    match: {
      id: portId,
    },
  });
  return emissionStations.filter(emissionStation => emissionStation.port !== null);
};

export default EmissionStations;

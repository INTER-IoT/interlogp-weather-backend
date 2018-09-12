import { SoundStationModel } from './models';

const SoundStations = {};

SoundStations.stations = () => SoundStationModel.find().populate('port');

SoundStations.stationsByPort = async (portId) => {
  const soundStations = await SoundStationModel.find().populate({
    path: 'port',
    match: {
      id: portId,
    },
  });
  return soundStations.filter(soundStation => soundStation.port !== null);
};

export default SoundStations;

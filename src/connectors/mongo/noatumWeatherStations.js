import { NoatumWeatherStationModel } from './models';

const NoatumWeatherStations = {};

NoatumWeatherStations.stations = () => NoatumWeatherStationModel.find().populate('port');

NoatumWeatherStations.stationsByPort = async (portId) => {
  const noatumWeatherStations = await NoatumWeatherStationModel.find().populate({
    path: 'port',
    match: {
      id: portId,
    },
  });
  return noatumWeatherStations.filter(noatumWeatherStation => noatumWeatherStation.port !== null);
};

export default NoatumWeatherStations;

import { WeatherStationModel } from './models';

const WeatherStations = {};

WeatherStations.weatherStations = () => WeatherStationModel.find().populate('port');

WeatherStations.weatherStationsByPort = async (portId) => {
  const weatherStations = await WeatherStationModel.find().populate({
    path: 'port',
    match: {
      id: portId,
    },
  });
  return weatherStations.filter(weatherStation => weatherStation.port !== null);
};

export default WeatherStations;

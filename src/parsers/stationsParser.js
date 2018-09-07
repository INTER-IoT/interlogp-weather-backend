import { parseString } from 'xml2js';

const parseMessage = message => new Promise((accept, reject) => {
  parseString(message, (err, result) => {
    if (err) {
      reject(err);
      return;
    }
    const parsed = result.valenciaPortData.meteoStations.map(station => ({
      name: station.name[0],
      portId: parseInt(station.portId[0], 10),
      id: parseInt(station.meteoStationId[0], 10),
      position: {
        lat: parseFloat(station.latitude[0]),
        lon: parseFloat(station.longitude[0]),
      },
    }));
    accept(parsed);
  });
});


export default {
  parse: async message => parseMessage(message),
};

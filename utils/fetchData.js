import rp from 'request-promise';
import fs from 'fs';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // security vulnerability!

const URL_BASE_PATH = process.argv[2];
const TOKEN = process.argv[3];
const DATA_PATH = `${__dirname}/data`;

const options = path => ({
  url: `${URL_BASE_PATH}/environmental/1.0.0${path}`,
  headers: {
    accept: 'application/json',
    authorization: `Bearer ${TOKEN}`,
    'cache-control': 'no-cache',
  },
});

const vpfRequest = async path => JSON.parse(await rp(options(path))).valenciaPortData;

const toJSFile = data => `/* eslint-disable */
export default ${JSON.stringify(data, null, 2)};
`;

const portData = `/* eslint-disable */
export default [
  {
    "id": 1,
    "name": "Valencia",
    "position": {
      "lat": 39.440541,
      "lon": -0.316301
    }
  },
  {
    "id": 2,
    "name": "Sagunto",
    "position": {
      "lat": 39.644942,
      "lon": -0.216138
    }
  },
  {
    "id": 3,
    "name": "Gandia",
    "position": {
      "lat": 38.995656,
      "lon": -0.152729
    }
  }
]`;

const transformers = {
  soundStations: item => ({
    id: item.cabinId,
    name: item.description,
    position: {
      lat: item.latitude,
      lon: item.longitude,
    },
    portId: item.portId,
  }),
  emissionStations: item => ({
    id: item.emissionCabinId,
    name: item.name,
    position: {
      lat: item.latitude,
      lon: item.longitude,
    },
    portId: item.portId,
  }),
  weatherStations: item => ({
    id: item.meteoStationId,
    name: item.name,
    position: {
      lat: item.latitude,
      lon: item.longitude,
    },
    portId: item.portId,
  }),
};

(async () => {
  let response;

  process.stdout.write('Fetching weather stations...');
  response = await vpfRequest('/weather/stations');
  const weatherStations = response.meteoStations.map(transformers.weatherStations);
  process.stdout.write('done\n');

  process.stdout.write('Fetching emission stations...');
  response = await vpfRequest('/emission/cabins');
  const emissionCabins = response.emissionCabins.map(transformers.emissionStations);
  process.stdout.write('done\n');

  process.stdout.write('Fetching sound stations...');
  response = await vpfRequest('/sound/meters');
  const soundMeters = response.soundMeters.map(transformers.soundStations);
  process.stdout.write('done\n');

  process.stdout.write(`Saving ${DATA_PATH}/weatherStations.js...`);
  await writeFile(`${DATA_PATH}/weatherStations.js`, toJSFile(weatherStations));
  process.stdout.write('done\n');

  process.stdout.write(`Saving ${DATA_PATH}/emissionStations.js...`);
  await writeFile(`${DATA_PATH}/emissionStations.js`, toJSFile(emissionCabins));
  process.stdout.write('done\n');

  process.stdout.write(`Saving ${DATA_PATH}/soundStations.js...`);
  await writeFile(`${DATA_PATH}/soundStations.js`, toJSFile(soundMeters));
  process.stdout.write('done\n');

  process.stdout.write(`Saving ${DATA_PATH}/ports.js...`);
  await writeFile(`${DATA_PATH}/ports.js`, portData);
  process.stdout.write('done\n');
})();

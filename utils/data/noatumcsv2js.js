import fs from 'fs';

const data = fs.readFileSync(`${__dirname}/noatum.csv`, 'utf8');

const stations = data.split('\n').filter(line => line.trim() !== '')
  .map(line => line.split(',').filter(item => item.trim() !== ''))
  .map(items => `  {
    "id": ${parseInt(items[0].substr(5), 10)},
    "name": "${items[0]}",
    "position": {
      "lat": ${items[1]},
      "lon": ${items[2]}
    },
    "portId": 1
  }`)
  .join(',\n');

const script = `/* eslint-disable */
export default [
${stations}
];
`;

fs.writeFileSync(`${__dirname}/noatumWeatherStations.js`, script, 'utf8');

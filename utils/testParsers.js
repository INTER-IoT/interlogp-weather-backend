import fs from 'fs';
import rawMeasurementMessage from '../src/parsers/examples/rawMeasurementMessage';
import rawEmissionMessage from '../src/parsers/examples/rawEmissionMessage';
import rawSoundMessage from '../src/parsers/examples/rawSoundMessage';

import {
  weatherParser,
  emissionParser,
  soundParser,
  stationsParser,
} from '../src/parsers';

const rawStationsMessage = fs.readFileSync(`${__dirname}/../src/parsers/examples/rawStationsMessage.xml`, 'utf8');

(async () => {
  console.log(await weatherParser.parse(rawMeasurementMessage));
  console.log(await emissionParser.parse(rawEmissionMessage));
  console.log(await soundParser.parse(rawSoundMessage));
  console.log(await stationsParser.parse(rawStationsMessage));
})();

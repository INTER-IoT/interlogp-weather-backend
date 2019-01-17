import rawWeatherMessage from '../src/parsers/examples/rawWeatherMessage';
import rawEmissionMessage from '../src/parsers/examples/rawEmissionMessage';
import rawSoundMessage from '../src/parsers/examples/rawSoundMessage';

import {
  weatherParser,
  emissionParser,
  soundParser,
} from '../src/parsers';

(async () => {
  console.log(await weatherParser.parse(rawWeatherMessage));
  console.log(await emissionParser.parse(rawEmissionMessage));
  console.log(await soundParser.parse(rawSoundMessage));
})();

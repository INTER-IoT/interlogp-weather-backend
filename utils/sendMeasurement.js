import rp from 'request-promise'; // eslint-disable-line import/no-extraneous-dependencies
import { weatherMessageGenerator, emissionMessageGenerator, soundMessageGenerator } from './raw-message-generators';

// console.log(weatherMessageGenerator.generate(1, 1)[0]);

const getGenerator = type => ({
  weather: weatherMessageGenerator,
  emission: emissionMessageGenerator,
  sound: soundMessageGenerator,
})[type];

const generator = getGenerator(process.argv[2]);

const url = process.argv[3];

const stationId = process.argv[4];

const options = {
  method: 'POST',
  url,
  headers: {
    'cache-control': 'no-cache',
    'content-type': 'application/json',
  },
  resolveWithFullResponse: true,
  body: generator.generate(stationId, 1, new Date()),
};

(async () => {
  try {
    const response = await rp(options);
    console.log(response.statusCode);
  } catch (error) {
    console.error(error.stack);
  }
})();

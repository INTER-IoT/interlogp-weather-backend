import request from 'request'; // eslint-disable-line import/no-extraneous-dependencies
import { weatherMessageGenerator } from './raw-message-generators';

// console.log(weatherMessageGenerator.generate(1, 1)[0]);

const url = process.argv[2];

const stationId = process.argv[3];

const options = {
  method: 'POST',
  url,
  headers: {
    'postman-token': 'da28a7a5-3caf-00cd-e35b-4bb98143253a',
    'cache-control': 'no-cache',
    'content-type': 'application/json',
  },
  body: weatherMessageGenerator.generate(stationId, 1)[0],
};

request(options, (error, response) => {
  if (error) throw new Error(error);
  else console.log(response.statusCode);
});

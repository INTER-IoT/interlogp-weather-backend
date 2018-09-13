import { flatenize } from '../parsers/interiotMessageParser';
import weatherMeasurementEndpoint from './weatherMeasurementEndpoint';
import soundMeasurementEndpoint from './soundMeasurementEndpoint';
import emissionMeasurementEndpoint from './emissionMeasurementEndpoint';

const getMiddleware = type => ({
  'InterIoT:LogVPmod#WeatherMeasurment': weatherMeasurementEndpoint,
  'InterIoT:LogVPmod#EmmissionMeasurement': emissionMeasurementEndpoint,
  'InterIoT:LogVPmod#SoundMeasurement': soundMeasurementEndpoint,
})[type];

export default async (req, res) => {
  try {
    const contentType = req.header('content-type');
    console.log('--- START REQUEST LOG ---')
    console.log(`Request content-type: ${contentType}`);
    console.log('Request body: ');
    console.log(req.body);
    console.log('--- END REQUEST LOG ---');
    const typeArray = flatenize(req.body)
      .map(item => item['@type'])
      .find(item => item.indexOf('sosa:Observation') !== -1)
      .slice(); // slice will clone the instance
    typeArray.splice(typeArray.indexOf('sosa:Observation'), 1);
    const middleware = getMiddleware(typeArray[0]);
    middleware(req, res);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

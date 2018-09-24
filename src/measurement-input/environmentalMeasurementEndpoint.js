import { flatenize } from '../parsers/interiotMessageParser';
import weatherMeasurementEndpoint from './weatherMeasurementEndpoint';
import soundMeasurementEndpoint from './soundMeasurementEndpoint';
import emissionMeasurementEndpoint from './emissionMeasurementEndpoint';

const typeMiddlewares = {
  'InterIoT:LogVPmod#WeatherMeasurement': weatherMeasurementEndpoint,
  'InterIoT:LogVPmod#EmissionMeasurement': emissionMeasurementEndpoint,
  'InterIoT:LogVPmod#SoundMeasurement': soundMeasurementEndpoint,
};

export default async (req, res) => {
  try {
    const typeArray = flatenize(req.body)
      .map(item => item['@type'])
      .reduce((agg, types) => [...agg, ...types], [])
      .slice(); // slice will clone the instance
    const middlewareType = Object.keys(typeMiddlewares).find(type => typeArray.indexOf(type) > -1);
    const middleware = typeMiddlewares[middlewareType];
    middleware(req, res);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

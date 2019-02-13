import endpoint from './genericEndpoint';
import { WeatherMeasurements } from '../connectors/mongo';
import { weatherParser } from '../parsers';

export default endpoint({
  type: 'weather',
  measurementModel: WeatherMeasurements,
  parser: weatherParser,
});

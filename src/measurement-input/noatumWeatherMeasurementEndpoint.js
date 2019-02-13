import endpoint from './genericEndpoint';
import { NoatumWeatherMeasurements } from '../connectors/mongo';
import { noatumWeatherParser } from '../parsers';

export default endpoint({
  type: 'noatumWeather',
  measurementModel: NoatumWeatherMeasurements,
  parser: noatumWeatherParser,
});

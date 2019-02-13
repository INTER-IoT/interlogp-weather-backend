import endpoint from './genericEndpoint';
import { EmissionMeasurements } from '../connectors/mongo';
import { emissionParser } from '../parsers';

export default endpoint({
  type: 'emission',
  measurementModel: EmissionMeasurements,
  parser: emissionParser,
});

import endpoint from './genericEndpoint';
import { SoundMeasurements } from '../connectors/mongo';
import { soundParser } from '../parsers';

export default endpoint({
  type: 'sound',
  measurementModel: SoundMeasurements,
  parser: soundParser,
});

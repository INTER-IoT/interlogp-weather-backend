import rawMeasurementMessage from './parsers/rawMeasurementMessage';
import rawEmissionMessage from './parsers/rawEmissionMessage';
import { weatherParser, emissionParser } from './parsers';

console.log(weatherParser.parse(rawMeasurementMessage));

console.log(emissionParser.parse(rawEmissionMessage));

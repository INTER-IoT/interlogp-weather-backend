import { parser, typeParsers } from './interiotMessageParser';

const matchItems = [
  {
    typeMatch: ['msg:Response', 'msg:Observation', 'msg:meta'],
    path: 'msg:dateTimeStamp',
    key: ['meta', 'messageTimestamp'],
    p: typeParsers.date,
  },
  {
    typeMatch: ['msg:Response', 'msg:Observation', 'msg:meta'],
    path: 'msg:messageID',
    key: ['meta', 'messageID'],
  },
  {
    typeMatch: ['http://www.w3.org/2006/time#TimePosition'],
    path: ['http://www.w3.org/2006/time#nominalPosition'],
    key: 'date',
    p: typeParsers.date,
  },
  {
    typeMatch: ['sosa:Result', 'InterIoT:SEAMS2mod#WindSpeed'],
    path: ['iiot:hasResultValue', '@value'],
    key: 'windSpeed',
    p: typeParsers.float,
  },
  {
    typeMatch: ['sosa:Sensor', 'iiot:IoTDevice', 'InterIoT:SEAMS2mod#Device'],
    path: ['iiot:hasName'],
    key: 'stationId',
    p: o => typeParsers.int(o.substring(o.lastIndexOf('_S') + 2)),
  },
];

export default {
  parse: async message => parser.parse(message, matchItems),
};

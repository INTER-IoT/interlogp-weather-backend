import { parser, typeParsers } from './interiotMessageParser';

const extractTimestampFromId = (id, items) => typeParsers.date(items.find(item => item['@id'] === id)['http://www.w3.org/2006/time#inXSDDateTimeStamp']['@value']);

const matchItems = [
  {
    typeMatch: ['Observation', 'meta'],
    path: 'dateTimeStamp',
    key: ['meta', 'messageTimestamp'],
    p: typeParsers.date,
  },
  {
    typeMatch: ['Observation', 'meta'],
    path: 'messageID',
    key: ['meta', 'messageID'],
  },
  {
    typeMatch: 'http://www.w3.org/2006/time#Interval',
    path: ['http://www.w3.org/2006/time#hasBeginning', '@id'],
    key: ['measurement', 'start'],
    p: extractTimestampFromId,
  },
  {
    typeMatch: 'http://www.w3.org/2006/time#Interval',
    path: ['http://www.w3.org/2006/time#hasEnd', '@id'],
    key: ['measurement', 'end'],
    p: extractTimestampFromId,
  },
  {
    typeMatch: ['InterIoT:LogVPmod#MaxSoundLevel', 'sosa:Result'],
    path: ['iiot:hasResultValue', '@value'],
    key: ['measurement', 'maxSoundLevel'],
    p: typeParsers.int,
  },
  {
    typeMatch: ['InterIoT:LogVPmod#AvgSoundLevel', 'sosa:Result'],
    path: ['iiot:hasResultValue', '@value'],
    key: ['measurement', 'avgSoundLevel'],
    p: typeParsers.int,
  },
  {
    typeMatch: ['InterIoT:LogVPmod#MinSoundLevel', 'sosa:Result'],
    path: ['iiot:hasResultValue', '@value'],
    key: ['measurement', 'minSoundLevel'],
    p: typeParsers.int,
  },
];

export default {
  parse: async message => parser.parse(message, matchItems),
};
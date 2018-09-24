import { parser, typeParsers } from './interiotMessageParser';

const matchItems = [
  {
    typeMatch: ['msg:Observation', 'msg:meta'],
    path: 'msg:dateTimeStamp',
    key: ['meta', 'messageTimestamp'],
    p: typeParsers.date,
  },
  {
    typeMatch: ['msg:Observation', 'msg:meta'],
    path: 'msg:messageID',
    key: ['meta', 'messageID'],
  },
  {
    typeMatch: ['InterIoT:LogVPmod#EmissionMeasurement', 'sosa:Observation'],
    path: ['sosa:resultTime', '@value'],
    key: 'date',
    p: typeParsers.date,
  },
  {
    typeMatch: ['sosa:Result', 'InterIoT:LogVPmod#Emission_NOX'],
    path: ['iiot:hasResultValue', '@value'],
    key: 'nox',
    p: typeParsers.int,
  },
  {
    typeMatch: ['sosa:Result', 'InterIoT:LogVPmod#ParticlesConcentration'],
    path: ['iiot:hasResultValue', '@value'],
    key: 'particles',
    p: typeParsers.float,
  },
  {
    typeMatch: ['sosa:Result', 'InterIoT:LogVPmod#Emission_SO2'],
    path: ['iiot:hasResultValue', '@value'],
    key: 'so2',
    p: typeParsers.int,
  },
  {
    typeMatch: ['sosa:Result', 'InterIoT:LogVPmod#Emission_NO2'],
    path: ['iiot:hasResultValue', '@value'],
    key: 'no2',
    p: typeParsers.int,
  },
  {
    typeMatch: ['sosa:Result', 'InterIoT:LogVPmod#Emission_NO'],
    path: ['iiot:hasResultValue', '@value'],
    key: 'no',
    p: typeParsers.int,
  },
  {
    typeMatch: ['sosa:Result', 'InterIoT:LogVPmod#Emission_CO'],
    path: ['iiot:hasResultValue', '@value'],
    key: 'co',
    p: typeParsers.float,
  },
  {
    typeMatch: ['InterIoT:LogVPmod#EmissionMeasurement', 'sosa:Observation'],
    path: ['sosa:madeBySensor', '@id'],
    key: 'stationId',
    p: o => typeParsers.int(o.substring(o.lastIndexOf('/') + 1)),
  },
];

export default {
  parse: async message => parser.parse(message, matchItems),
};

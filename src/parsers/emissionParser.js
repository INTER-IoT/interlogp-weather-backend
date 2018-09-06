import { parser, typeParsers } from './interiotMessageParser';

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
    typeMatch: ['InterIoT:LogVPmod#EmmissionMeasurement', 'sosa:Observation'],
    path: ['sosa:resultTime', '@value'],
    key: 'resultTime',
    p: typeParsers.date,
  },
  {
    typeMatch: ['sosa:Result', 'InterIoT:LogVPmod#Emission_NOX'],
    path: ['iiot:hasResultValue', '@value'],
    key: ['measurement', 'emissionNOX'],
    p: typeParsers.int,
  },
  {
    typeMatch: ['sosa:Result', 'InterIoT:LogVPmod#ParticlesConcentration'],
    path: ['iiot:hasResultValue', '@value'],
    key: ['measurement', 'particlesConcentration'],
    p: typeParsers.float,
  },
  {
    typeMatch: ['sosa:Result', 'InterIoT:LogVPmod#Emission_SO2'],
    path: ['iiot:hasResultValue', '@value'],
    key: ['measurement', 'emissionSO2'],
    p: typeParsers.int,
  },
  {
    typeMatch: ['sosa:Result', 'InterIoT:LogVPmod#Emission_NO2'],
    path: ['iiot:hasResultValue', '@value'],
    key: ['measurement', 'emissionNO2'],
    p: typeParsers.int,
  },
  {
    typeMatch: ['sosa:Result', 'InterIoT:LogVPmod#Emission_NO'],
    path: ['iiot:hasResultValue', '@value'],
    key: ['measurement', 'emissionNO'],
    p: typeParsers.int,
  },
  {
    typeMatch: ['sosa:Result', 'InterIoT:LogVPmod#Emission_CO'],
    path: ['iiot:hasResultValue', '@value'],
    key: ['measurement', 'emissionCO'],
    p: typeParsers.float,
  },
  {
    typeMatch: ['InterIoT:LogVPmod#EmmissionMeasurement', 'sosa:Observation'],
    path: ['sosa:madeBySensor', '@id'],
    key: 'stationId',
    p: o => typeParsers.int(o.substring(o.lastIndexOf('/') + 1)),
  },
];

export default {
  parse: message => parser.parse(message, matchItems),
};

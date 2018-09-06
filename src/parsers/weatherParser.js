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
    typeMatch: ['InterIoT:LogVPmod#WeatherMeasurment', 'sosa:Observation'],
    path: ['sosa:resultTime', '@value'],
    key: 'resultTime',
    p: typeParsers.date,
  },
  {
    typeMatch: ['sosa:Result', 'InterIoT:LogVPmod#Precipitation'],
    path: ['iiot:hasResultValue', '@value'],
    key: ['measurement', 'precipitation'],
    p: typeParsers.float,
  },
  {
    typeMatch: ['sosa:Result', 'InterIoT:LogVPmod#WindSpeed'],
    path: ['iiot:hasResultValue', '@value'],
    key: ['measurement', 'windspeed'],
    p: typeParsers.float,
  },
  {
    typeMatch: ['sosa:Result', 'InterIoT:LogVPmod#Radiation'],
    path: ['iiot:hasResultValue', '@value'],
    key: ['measurement', 'radiation'],
    p: typeParsers.float,
  },
  {
    typeMatch: ['sosa:Result', 'InterIoT:LogVPmod#Pressure'],
    path: ['iiot:hasResultValue', '@value'],
    key: ['measurement', 'pressure'],
    p: typeParsers.float,
  },
  {
    typeMatch: ['sosa:Result', 'InterIoT:LogVPmod#AverageHumidity'],
    path: ['iiot:hasResultValue', '@value'],
    key: ['measurement', 'avgHumidity'],
    p: typeParsers.float,
  },
  {
    typeMatch: ['sosa:Result', 'InterIoT:LogVPmod#SeaTemperature'],
    path: ['iiot:hasResultValue', '@value'],
    key: ['measurement', 'seaTemperature'],
    p: typeParsers.float,
  },
  {
    typeMatch: ['sosa:Result', 'InterIoT:LogVPmod#AverageTemperature'],
    path: ['iiot:hasResultValue', '@value'],
    key: ['measurement', 'avgTemperature'],
    p: typeParsers.float,
  },
  {
    typeMatch: ['sosa:Result', 'InterIoT:LogVPmod#WindDirection'],
    path: ['iiot:hasResultValue', '@value'],
    key: ['measurement', 'windDirection'],
    p: typeParsers.float,
  },
  {
    typeMatch: ['sosa:Sensor', 'iiot:IoTDevice', 'InterIoT:LogVPmod#MeteoStation'],
    path: ['iiotex:hasLocalId', '@value'],
    key: 'stationId',
    p: typeParsers.int,
  },
];

export default {
  parse: message => parser.parse(message, matchItems),
};

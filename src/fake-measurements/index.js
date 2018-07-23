const jsf = require('json-schema-faker');
const stationSchema = require('./stationSchema');
const positionSchema = require('./positionSchema');
const weatherSchema = require('./weatherSchema.json');

/* eslint global-require: off */
jsf.extend('faker', () => {
  const faker = require('faker');
  faker.locale = 'es';
  return faker;
});

const refs = [
  positionSchema,
];

jsf.resolve(stationSchema, refs).then((sample) => {
  console.log(sample);
});

jsf.resolve(weatherSchema).then((sample) => {
  console.log(sample);
});

const ports = [
  { id: 1, name: 'Valencia', position: { lat: 0, lon: 0 } },
  { id: 2, name: 'Sagunto', position: { lat: 0, lon: 0 } },
  { id: 3, name: 'Gandia', position: { lat: 0, lon: 0 } },
];

module.exports = {
  generate: (numStations, numMeasurements) => {
    
  },
};

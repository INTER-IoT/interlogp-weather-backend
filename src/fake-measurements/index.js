/* eslint-disable global-require */

import jsf from 'json-schema-faker';
import ports from './ports';
import weatherStationSchema from './weatherStationSchema';
import positionSchema from './positionSchema';
import weatherMeasurementSchema from './weatherMeasurementSchema';

jsf.extend('faker', () => {
  const faker = require('faker');
  faker.locale = 'es';
  return faker;
});

const refs = [
  positionSchema,
  weatherMeasurementSchema,
  weatherStationSchema,
];

const weatherStationCollection = numStations => ({
  type: 'array',
  minItems: numStations,
  maxItems: numStations,
  items: {
    $ref: 'weatherStation',
  },
});

const weatherMeasurementCollection = numMeasurements => ({
  type: 'array',
  minItems: numMeasurements,
  maxItems: numMeasurements,
  items: {
    $ref: 'weatherMeasurement',
  },
});

const addIncrementalId = collection => collection.forEach((item, idx) => {
  item.id = idx + 1;
  return item;
});

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default {
  generate: (numStations, numMeasurements) => {
    ports.sort((a, b) => a.id - b.id);

    const weatherStations = jsf(weatherStationCollection(numStations * ports.length), refs);
    addIncrementalId(weatherStations);

    const weatherMeasurements = jsf(weatherMeasurementCollection(numMeasurements), refs);
    weatherMeasurements.sort((a, b) => a.date - b.date);
    addIncrementalId(weatherMeasurements);
    shuffle(weatherMeasurements);

    ports.forEach((port) => {
      port.weatherStations = weatherStations.splice(0, numStations);
      port.weatherStations.forEach((weatherStation) => {
        weatherStation.port = port;
        weatherStation.weatherMeasurements = weatherMeasurements.splice(0, numStations);
        weatherStation.weatherMeasurements.sort((a, b) => a.id - b.id);
        weatherStation.weatherMeasurements.forEach((weatherMeasurement) => {
          weatherMeasurement.weatherStation = weatherStation;
        });
      });
    });
    return ports;
  },
};

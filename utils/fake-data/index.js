/* eslint-disable global-require */

import jsf from 'json-schema-faker';
import ports from './ports';
import weatherStations from './stations';
import weatherMeasurementSchema from './weatherMeasurementSchema';

jsf.extend('faker', () => {
  const faker = require('faker');
  faker.locale = 'es';
  return faker;
});

const refs = [
  weatherMeasurementSchema,
];

const weatherMeasurementCollection = numMeasurements => ({
  type: 'array',
  minItems: numMeasurements,
  maxItems: numMeasurements,
  items: {
    $ref: 'weatherMeasurement',
  },
});

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default {
  generate: (numMeasurements) => {
    ports.sort((a, b) => a.id - b.id);

    const weatherMeasurements = jsf(weatherMeasurementCollection(numMeasurements * weatherStations.length * ports.length), refs);
    weatherMeasurements.sort((a, b) => a.date - b.date);
    shuffle(weatherMeasurements);

    ports.forEach((port) => {
      port.weatherStations = weatherStations.filter(weatherStation => weatherStation.portId === port.id);
      port.weatherStations.forEach((weatherStation) => {
        weatherStation.port = port;
        delete weatherStation.portId;
        weatherStation.weatherMeasurements = weatherMeasurements.splice(0, numMeasurements);
        weatherStation.weatherMeasurements.sort((a, b) => a.id - b.id);
        weatherStation.weatherMeasurements.forEach((weatherMeasurement) => {
          weatherMeasurement.weatherStation = weatherStation;
        });
      });
    });
    return ports;
  },
};

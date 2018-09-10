/* eslint-disable global-require */

import jsf from 'json-schema-faker';
import ports from '../data/ports';
import weatherStations from '../data/weatherStations';
import emissionStations from '../data/emissionStations';
import weatherMeasurementSchema from './weatherMeasurementSchema';
import emissionMeasurementSchema from './emissionMeasurementSchema';

jsf.extend('faker', () => {
  const faker = require('faker');
  faker.locale = 'es';
  return faker;
});

const refs = [
  weatherMeasurementSchema,
  emissionMeasurementSchema,
];

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const generateMeasurements = (ref, num) => {
  const measurements = jsf({
    type: 'array',
    minItems: num,
    maxItems: num,
    items: {
      $ref: ref,
    },
  }, refs);
  measurements.sort((a, b) => a.date - b.date);
  shuffle(measurements);
  return measurements;
};

export {
  generateMeasurements,
};

export default {
  generate: (numMeasurements) => {
    ports.sort((a, b) => a.id - b.id);

    const weatherMeasurements = generateMeasurements('weatherMeasurement', numMeasurements * weatherStations.length * ports.length);
    const emissionMeasurements = generateMeasurements('emissionMeasurement', numMeasurements * emissionStations.length * ports.length);

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
      port.emissionStations = emissionStations.filter(emissionStation => emissionStation.portId === port.id);
      port.emissionStations.forEach((emissionStation) => {
        emissionStation.port = port;
        delete emissionStation.portId;
        emissionStation.emissionMeasurements = emissionMeasurements.splice(0, numMeasurements);
        emissionStation.emissionMeasurements.sort((a, b) => a.id - b.id);
        emissionStation.emissionMeasurements.forEach((emissionMeasurement) => {
          emissionMeasurement.emissionStation = emissionStation;
        });
      });
    });
    return ports;
  },
};

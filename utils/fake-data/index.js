import jsf from 'json-schema-faker';
import faker from 'faker';
import weatherMeasurementSchema from './weatherMeasurementSchema';
import emissionMeasurementSchema from './emissionMeasurementSchema';
import soundMeasurementSchema from './soundMeasurementSchema';

jsf.extend('faker', () => {
  faker.locale = 'es';
  return faker;
});

const refs = [
  weatherMeasurementSchema,
  emissionMeasurementSchema,
  soundMeasurementSchema,
];

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const generateMeasurements = (ref, num) => {
  const measurements = jsf.generate({
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

const fakeData = {
  generateWeatherMeasurements: num => generateMeasurements('weatherMeasurement', num),
  generateEmissionMeasurements: num => generateMeasurements('emissionMeasurement', num),
  generateSoundMeasurements: num => generateMeasurements('soundMeasurement', num).map((measurement) => {
    measurement.avgLevel = Math.round((measurement.maxLevel + measurement.minLevel) / 2);
    measurement.end = new Date(measurement.date - 2000);
    measurement.start = new Date(measurement.date - 2000 - measurement.duration);
    delete measurement.duration;
    return measurement;
  }),
};

export default fakeData;

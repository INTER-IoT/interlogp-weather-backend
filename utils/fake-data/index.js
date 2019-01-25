import jsf from 'json-schema-faker';
import faker from 'faker';
import weatherMeasurementSchema from './weatherMeasurementSchema';
import emissionMeasurementSchema from './emissionMeasurementSchema';
import soundMeasurementSchema from './soundMeasurementSchema';
import {
  DayGenerator,
  dayDiv,
} from './timeUtils';

jsf.extend('faker', () => {
  faker.locale = 'es';
  return faker;
});

const refs = [
  weatherMeasurementSchema,
  emissionMeasurementSchema,
  soundMeasurementSchema,
];

const generateMeasurements = (ref, num, from, to) => {
  const measurements = [];
  const c = Math.floor(Math.random() * (3600 * 24 / num));
  const times = dayDiv(num, c);
  const dayGenerator = DayGenerator(from, to);
  let next = dayGenerator.next();
  const pad = n => `00${n}`.substr(-2, 2);
  while (!next.done) {
    const fullday = `${next.value.year}-${pad(next.value.month)}-${pad(next.value.day)}`;
    const dayMeasurements = jsf.generate({
      type: 'array',
      minItems: num,
      maxItems: num,
      items: {
        $ref: ref,
      },
    }, refs).map((meas, idx) => {
      const time = times[idx];
      meas.date = new Date(`${fullday}T${time}.000Z`);
      return meas;
    });
    measurements.push(...dayMeasurements);
    next = dayGenerator.next();
  }
  return measurements;
};

const fakeData = {
  generateWeatherMeasurements: (num, from, to) => generateMeasurements('weatherMeasurement', num, from, to),
  generateEmissionMeasurements: (num, from, to) => generateMeasurements('emissionMeasurement', num, from, to),
  generateSoundMeasurements: (num, from, to) => generateMeasurements('soundMeasurement', num, from, to).map((measurement) => {
    measurement.avgLevel = Math.round((measurement.maxLevel + measurement.minLevel) / 2);
    measurement.end = new Date(measurement.date - 2000);
    measurement.start = new Date(measurement.date - 2000 - measurement.duration);
    delete measurement.duration;
    return measurement;
  }),
};

export default fakeData;

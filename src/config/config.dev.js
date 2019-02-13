export default {
  mongo: {
    host: 'localhost',
    port: 27017,
    database: 'environmental',
  },
  server: {
    port: 3020,
  },
  dev: true,
  throttle: {
    emission: 10 * 1000, // ms
    sound: 10 * 1000,
    weather: 10 * 1000,
    noatumWeather: 10 * 1000,
  },
};

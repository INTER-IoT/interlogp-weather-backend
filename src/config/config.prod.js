export default {
  mongo: {
    host: 'localhost',
    port: 27017,
    database: 'environment',
  },
  server: {
    port: 8080,
  },
  dev: false,
  throttle: {
    emission: 5 * 60 * 1000, // ms
    sound: 5 * 60 * 1000,
    weather: 5 * 60 * 1000,
    noatumWeather: 5 * 60 * 1000,
  },
};

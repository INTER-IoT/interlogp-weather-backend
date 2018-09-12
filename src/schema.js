/* eslint no-unused-vars: off */

import { makeExecutableSchema } from 'graphql-tools';
import { pubsub, topics } from './pubsub';

// import { PubSub, withFilter } from 'graphql-subscriptions';

// const pubsub = new PubSub();

import {
  Ports,
  WeatherStations,
  WeatherMeasurements,
  EmissionStations,
  EmissionMeasurements,
  SoundStations,
  SoundMeasurements,
} from './connectors';

const typeDefs = [`

  type Position {
    lat: Float
    lon: Float
  }

  type Port {
    id: Int!
    name: String!
    position: Position!
  }

  type WeatherStation {
    id: Int!
    position: Position!
    port: Port!
    name: String!
  }

  type EmissionStation {
    id: Int!
    position: Position!
    port: Port!
    name: String!
  }

  type SoundStation {
    id: Int!
    position: Position!
    port: Port!
    name: String!
  }

  type WeatherMeasurement {
    id: Int!
    date: String!
    windSpeed: Float!
    precipitation: Float!
    solarRadiation: Float!
    pressure: Float!
    humidity: Float!
    seaTemperature: Float!
    averageTemperature: Float!
    windDirection: Float!
    weatherStation: WeatherStation!
  }

  type EmissionMeasurement {
    id: Int!
    date: String!
    particles: Float!
    nox: Int!
    so2: Int!
    no2: Int!
    no: Int!
    co: Float!
    emissionStation: EmissionStation!
  }

  type SoundMeasurement {
    id: Int!
    date: String!
    start: String!
    end: String!
    maxLevel: Int!
    minLevel: Int!
    avgLevel: Int!
    soundStation: SoundStation!
  }

  type Query {
    ports: [Port]

    weatherStations(portId: Int): [WeatherStation]
    weatherMeasurements(weatherStationId: Int): [WeatherMeasurement]
    lastWeatherMeasurementByStation(weatherStationId: Int!): WeatherMeasurement
    lastWeatherMeasurementsByPort(portId: Int!): [WeatherMeasurement]

    emissionStations(portId: Int): [EmissionStation]
    emissionMeasurements(emissionStationId: Int): [EmissionMeasurement]
    lastEmissionMeasurementByStation(emissionStationId: Int!): EmissionMeasurement
    lastEmissionMeasurementsByPort(portId: Int!): [EmissionMeasurement]

    soundStations(portId: Int): [SoundStation]
    soundMeasurements(soundStationId: Int): [SoundMeasurement]
    lastSoundMeasurementByStation(soundStationId: Int!): SoundMeasurement
    lastSoundMeasurementsByPort(portId: Int!): [SoundMeasurement]

  }

  type Subscription {
    weatherMeasurement: WeatherMeasurement
    emissionMeasurement: EmissionMeasurement
    soundMeasurement: SoundMeasurement
  }

  schema {
    query: Query
    subscription: Subscription
  }

`];

const resolvers = {
  Query: {
    ports(root, args, context) {
      return Ports.ports();
    },
    // weather queries
    weatherStations(root, { portId }, context) {
      if (portId !== undefined) return WeatherStations.stationsByPort(portId);
      return WeatherStations.stations();
    },
    weatherMeasurements(root, { weatherStationId }, context) {
      if (weatherStationId !== undefined) return WeatherMeasurements.measurementsByStation(weatherStationId);
      return WeatherMeasurements.measurements();
    },
    lastWeatherMeasurementByStation(root, { weatherStationId }, context) {
      return WeatherMeasurements.lastMeasurementByStation(weatherStationId);
    },
    lastWeatherMeasurementsByPort(root, { portId }, context) {
      return WeatherMeasurements.lastMeasurementsByPort(portId);
    },
    // emission queries
    emissionStations(root, { portId }, context) {
      if (portId !== undefined) return EmissionStations.stationsByPort(portId);
      return EmissionStations.stations();
    },
    emissionMeasurements(root, { emissionStationId }, context) {
      if (emissionStationId !== undefined) return EmissionMeasurements.measurementsByStation(emissionStationId);
      return EmissionMeasurements.measurements();
    },
    lastEmissionMeasurementByStation(root, { emissionStationId }, context) {
      return EmissionMeasurements.lastMeasurementByStation(emissionStationId);
    },
    lastEmissionMeasurementsByPort(root, { portId }, context) {
      return EmissionMeasurements.lastMeasurementsByPort(portId);
    },
    // sound queries
    soundStations(root, { portId }, context) {
      if (portId !== undefined) return SoundStations.stationsByPort(portId);
      return SoundStations.stations();
    },
    soundMeasurements(root, { soundStationId }, context) {
      if (soundStationId !== undefined) return SoundMeasurements.measurementsByStation(soundStationId);
      return SoundMeasurements.measurements();
    },
    lastSoundMeasurementByStation(root, { soundStationId }, context) {
      return SoundMeasurements.lastMeasurementByStation(soundStationId);
    },
    lastSoundMeasurementsByPort(root, { portId }, context) {
      return SoundMeasurements.lastMeasurementsByPort(portId);
    },
  },
  Subscription: {
    weatherMeasurement: {
      subscribe: () => pubsub.asyncIterator(topics.NEW_WEATHER_MEASUREMENT_TOPIC),
    },
    emissionMeasurement: {
      subscribe: () => pubsub.asyncIterator(topics.NEW_EMISSION_MEASUREMENT_TOPIC),
    },
    soundMeasurement: {
      subscribe: () => pubsub.asyncIterator(topics.NEW_SOUND_MEASUREMENT_TOPIC),
    },
  },
};

const jsSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default jsSchema;

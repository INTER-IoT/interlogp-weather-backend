/* eslint no-unused-vars: off */

import { makeExecutableSchema } from 'graphql-tools';

// import { PubSub, withFilter } from 'graphql-subscriptions';

// const pubsub = new PubSub();

import { Ports, WeatherStations, WeatherMeasurements } from './mongo-connector';

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

  type Query {
    hello: String
    ports: [Port]
    weatherStations(portId: Int): [WeatherStation]
    weatherMeasurements(weatherStationId: Int): [WeatherMeasurement]
    lastMeasurement(weatherStationId: Int!): WeatherMeasurement
  }

  schema {
    query: Query
  }

`];

const resolvers = {
  Query: {
    hello(root, args, context) {
      return 'Hello World';
    },
    ports(root, args, context) {
      return Ports.ports();
    },
    weatherStations(root, { portId }, context) {
      if (portId !== undefined) return WeatherStations.weatherStationsByPort(portId);
      return WeatherStations.weatherStations();
    },
    weatherMeasurements(root, { weatherStationId }, context) {
      if (weatherStationId !== undefined) return WeatherMeasurements.weatherMeasurementsByStation(weatherStationId);
      return WeatherMeasurements.weatherMeasurements();
    },
    lastMeasurement(root, { weatherStationId }, context) {
      return WeatherMeasurements.lastMeasurement(weatherStationId);
    },
  },
};

const jsSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default jsSchema;

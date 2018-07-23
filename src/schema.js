/* eslint no-unused-vars: off */

import { makeExecutableSchema } from 'graphql-tools';

// import { PubSub, withFilter } from 'graphql-subscriptions';

// const pubsub = new PubSub();

import { Ports, WeatherStations, WeatherMeasurements } from './fake-connector';

const typeDefs = [`

  type Position {
    lat: Float
    lon: Float
  }

  type Port {
    id: Int!
    name: String!
    position: Position!
    weatherStations: [WeatherStation]
  }

  type WeatherStation {
    id: Int!
    position: Position!
    port: Port!
    weatherMeasurements: [WeatherMeasurement]
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
    windDirection: Float
  }

  type Query {
    ports: [Port]
    weatherStations(portId: Int): [WeatherStation]
    weatherMeasurements(stationId: Int): [WeatherMeasurement]
  }

  schema {
    query: Query
  }

`];

const resolvers = {
  Query: {
    ports(root, args, context) {
      return Ports.ports();
    },
    weatherStations(root, { portId }, context) {
      if (portId !== undefined) return WeatherStations.weatherStationsByPort(portId);
      return WeatherStations.weatherStations();
    },
    weatherMeasurements(root, { stationId }, context) {
      if (stationId !== undefined) return WeatherMeasurements.weatherMeasurementsByStation(stationId);
      return WeatherMeasurements.weatherMeasurements();
    },
  },
};

const jsSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default jsSchema;

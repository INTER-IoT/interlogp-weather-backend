/* eslint no-unused-vars: off */

import { makeExecutableSchema } from 'graphql-tools';
import { withFilter } from 'graphql-subscriptions';
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
  Alerts,
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

  type Alert {
    id: Int!
    date: String!
    processed: Boolean!
    text: String!
    dateProcessed: String
    port: Port!
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

    alerts(portId: Int, processed: Boolean): [Alert]
  }

  type Mutation {
    processAlert(alertId: Int!): Alert
    createAlert(portId: Int!, text: String!): Alert
  }

  type Subscription {
    weatherMeasurement: WeatherMeasurement
    emissionMeasurement: EmissionMeasurement
    soundMeasurement: SoundMeasurement
    newAlert: Alert
    processedAlert(portId: Int): Alert
  }

  schema {
    query: Query
    subscription: Subscription
    mutation: Mutation
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
    // alert queries
    alerts(root, { portId, processed }, context) {
      const filter = {};
      if (processed !== undefined) {
        filter.processed = processed;
      }
      if (portId !== undefined) return Alerts.alertsByPort(portId, filter);
      return Alerts.alerts(filter);
    },
  },
  Mutation: {
    async processAlert(root, { alertId }, context) {
      const { alert, modified } = await Alerts.processAlert(alertId);
      if (modified) pubsub.publish(topics.PROCESSED_ALERT_TOPIC, { processedAlert: alert });
      return alert;
    },
    async createAlert(root, { portId, text }, context) {
      const alert = Alerts.createAlert(portId, text);
      pubsub.publish(topics.NEW_ALERT_TOPIC, { newAlert: alert });
      return alert;
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
    newAlert: {
      subscribe: () => pubsub.asyncIterator(topics.NEW_ALERT_TOPIC),
    },
    processedAlert: {
      subscribe: withFilter(() => pubsub.asyncIterator(topics.PROCESSED_ALERT_TOPIC),
        (payload, variables) => payload.processedAlert.port.id === variables.portId),
    },
  },
};

const jsSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default jsSchema;

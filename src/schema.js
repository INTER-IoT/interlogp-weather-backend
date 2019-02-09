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
  NoatumWeatherStations,
  NoatumWeatherMeasurements,
  Alerts,
  IntermwMessages,
  Rules,
  Statistics,
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

  type NoatumWeatherStation {
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

  type NoatumWeatherMeasurement {
    id: Int!
    date: String!
    windSpeed: Float!
    noatumWeatherStation: NoatumWeatherStation!
  }

  type Alert {
    id: Int!
    date: String!
    processed: Boolean!
    title: String!
    text: String!
    dateProcessed: String
    port: Port!
  }

  type Rule {
    id: Int
    port: [Int]
    station: [Int]
    type: String!
    attribute: String!
    comparison: Int!
    value: Float!
    inclusive: Boolean!
    enabled: Boolean!
  }

  input RuleInput {
    port: [Int]
    station: [Int]
    type: String!
    attribute: String!
    comparison: Int!
    value: Float!
    inclusive: Boolean!
  }

  type IntermwMessage {
    date: String!
    content: String!
    weatherStation: WeatherStation
    emissionStation: EmissionStation
    soundStation: SoundStation
    noatumWeatherStation: NoatumWeatherStation
  }

  enum Period {
    daily
    monthly
  }

  enum StatisticType {
    weather
    sound
    emission
    noatumweather
  }

  type Statistic{
    day: Int
    month: Int!
    year: Int!
    period: Period!
    statType: StatisticType!
    stationId: Int!
    portId: Int!
    average: String!
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

    noatumWeatherStations(portId: Int): [NoatumWeatherStation]
    noatumWeatherMeasurements(noatumWeatherStationId: Int): [NoatumWeatherMeasurement]
    lastNoatumWeatherMeasurementByStation(noatumWeatherStationId: Int!): NoatumWeatherMeasurement
    lastNoatumWeatherMeasurementsByPort(portId: Int!): [NoatumWeatherMeasurement]

    alerts(portId: Int, processed: Boolean): [Alert]

    intermwMessages(portId: Int, limit: Int): [IntermwMessage]

    statistics(statType: StatisticType, period: Period, stationId: Int, portId: Int, day: Int, month: Int, year: Int): [Statistic]

    rules: [Rule]
  }

  type Mutation {
    processAlert(alertId: Int!): Alert
    createAlert(portId: Int!, title: String!, text: String!): Alert
    
    createRule(rule: RuleInput!): Rule
    deleteRule(ruleId: Int!): Rule
    setRuleState(ruleId: Int!, state: Boolean!): Rule
  }

  type Subscription {
    newWeatherMeasurement(portId: Int): WeatherMeasurement
    newEmissionMeasurement(portId: Int): EmissionMeasurement
    newSoundMeasurement(portId: Int): SoundMeasurement
    newNoatumWeatherMeasurement(portId: Int): NoatumWeatherMeasurement
    newAlert(portId: Int): Alert
    processedAlert(portId: Int): Alert
    newIntermwMessage(portId: Int): IntermwMessage
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
    // noatumWeather queries
    noatumWeatherStations(root, { portId }, context) {
      if (portId !== undefined) return NoatumWeatherStations.stationsByPort(portId);
      return NoatumWeatherStations.stations();
    },
    noatumWeatherMeasurements(root, { noatumWeatherStationId }, context) {
      if (noatumWeatherStationId !== undefined) return NoatumWeatherMeasurements.measurementsByStation(noatumWeatherStationId);
      return NoatumWeatherMeasurements.measurements();
    },
    lastNoatumWeatherMeasurementByStation(root, { noatumWeatherStationId }, context) {
      return NoatumWeatherMeasurements.lastMeasurementByStation(noatumWeatherStationId);
    },
    lastNoatumWeatherMeasurementsByPort(root, { portId }, context) {
      return NoatumWeatherMeasurements.lastMeasurementsByPort(portId);
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
    // intermw messages
    intermwMessages(root, { portId = null, limit = 10 }, context) {
      return IntermwMessages.messagesByPort(portId, limit);
    },
    // rules
    rules(root, args, context) {
      return Rules.rules();
    },
    // statistics
    statistics(root, args, context) {
      return Statistics.statistics(args);
    },
  },
  Mutation: {
    async processAlert(root, { alertId }, context) {
      const { alert, modified } = await Alerts.processAlert(alertId);
      if (modified) pubsub.publish(topics.PROCESSED_ALERT_TOPIC, { processedAlert: alert });
      return alert;
    },
    async createAlert(root, { portId, text }, context) {
      const alert = await Alerts.createAlert(portId, text);
      pubsub.publish(topics.NEW_ALERT_TOPIC, { newAlert: alert });
      return alert;
    },
    async createRule(root, { rule }, context) {
      const createdRule = await Rules.createRule(rule);
      return createdRule;
    },
    async deleteRule(root, { ruleId }, context) {
      const deletedRule = await Rules.deleteRule(ruleId);
      return deletedRule;
    },
    async setRuleState(root, { ruleId, state }, context) {
      const rule = await Rules.setRuleState(ruleId, state);
      return rule;
    },
  },
  Subscription: {
    newWeatherMeasurement: {
      // subscribe: () => pubsub.asyncIterator(topics.NEW_WEATHER_MEASUREMENT_TOPIC),
      subscribe: withFilter(
        () => pubsub.asyncIterator(topics.NEW_WEATHER_MEASUREMENT_TOPIC),
        (payload, variables) => {
          if (variables.portId === undefined) return true;
          return payload.newWeatherMeasurement.weatherStation.port.id === variables.portId;
        },
      ),
    },
    newEmissionMeasurement: {
      // subscribe: () => pubsub.asyncIterator(topics.NEW_EMISSION_MEASUREMENT_TOPIC),
      subscribe: withFilter(
        () => pubsub.asyncIterator(topics.NEW_EMISSION_MEASUREMENT_TOPIC),
        (payload, variables) => {
          if (variables.portId === undefined) return true;
          return payload.newEmissionMeasurement.emissionStation.port.id === variables.portId;
        },
      ),
    },
    newSoundMeasurement: {
      // subscribe: () => pubsub.asyncIterator(topics.NEW_SOUND_MEASUREMENT_TOPIC),
      subscribe: withFilter(
        () => pubsub.asyncIterator(topics.NEW_SOUND_MEASUREMENT_TOPIC),
        (payload, variables) => {
          if (variables.portId === undefined) return true;
          return payload.newSoundMeasurement.soundStation.port.id === variables.portId;
        },
      ),
    },
    newNoatumWeatherMeasurement: {
      // subscribe: () => pubsub.asyncIterator(topics.NEW_WEATHER_MEASUREMENT_TOPIC),
      subscribe: withFilter(
        () => pubsub.asyncIterator(topics.NEW_NOATUMWEATHER_MEASUREMENT_TOPIC),
        (payload, variables) => {
          if (variables.portId === undefined) return true;
          return payload.newNoatumWeatherMeasurement.noatumWeatherStation.port.id === variables.portId;
        },
      ),
    },
    newAlert: {
      // subscribe: () => pubsub.asyncIterator(topics.NEW_ALERT_TOPIC),
      subscribe: withFilter(
        () => pubsub.asyncIterator(topics.NEW_ALERT_TOPIC),
        (payload, variables) => {
          if (variables.portId === undefined) return true;
          return payload.newAlert.port.id === variables.portId;
        },
      ),
    },
    processedAlert: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(topics.PROCESSED_ALERT_TOPIC),
        (payload, variables) => {
          if (variables.portId === undefined) return true;
          return payload.processedAlert.port.id === variables.portId;
        },
      ),
    },
    newIntermwMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(topics.NEW_INTERMW_MESSAGE_TOPIC),
        (payload, variables) => {
          if (variables.portId === undefined) return true;
          const message = payload.newIntermwMessage;
          const station = message.weatherStation || message.soundStation || message.emissionStation || message.noatumWeatherStation;
          return station.port.id === variables.portId;
        },
      ),
    },
  },
};

const jsSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default jsSchema;

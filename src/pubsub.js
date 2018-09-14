import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

const topics = {
  NEW_WEATHER_MEASUREMENT_TOPIC: 'NEW_WEATHER_MEASUREMENT',
  NEW_EMISSION_MEASUREMENT_TOPIC: 'NEW_EMISSION_MEASUREMENT',
  NEW_SOUND_MEASUREMENT_TOPIC: 'NEW_SOUND_MEASUREMENT',
  NEW_ALERT_TOPIC: 'NEW_ALERT_TOPIC',
  PROCESSED_ALERT_TOPIC: 'PROCESSED_ALERT_TOPIC',
};

export {
  pubsub,
  topics,
};

export default {
  pubsub,
  topics,
};

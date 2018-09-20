import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

const topics = {
  NEW_WEATHER_MEASUREMENT_TOPIC: 'NEW_WEATHER_MEASUREMENT',
  NEW_EMISSION_MEASUREMENT_TOPIC: 'NEW_EMISSION_MEASUREMENT',
  NEW_SOUND_MEASUREMENT_TOPIC: 'NEW_SOUND_MEASUREMENT',
  NEW_ALERT_TOPIC: 'NEW_ALERT',
  PROCESSED_ALERT_TOPIC: 'PROCESSED_ALERT',
  NEW_INTERMW_MESSAGE_TOPIC: 'NEW_INTERMW_MESSAGE',
};

export {
  pubsub,
  topics,
};

export default {
  pubsub,
  topics,
};

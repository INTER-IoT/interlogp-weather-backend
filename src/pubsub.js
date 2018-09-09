import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

const topics = {
  NEW_MEASUREMENT_TOPIC: 'NEW_MEASUREMENT',
};

export {
  pubsub,
  topics,
};

export default {
  pubsub,
  topics,
};

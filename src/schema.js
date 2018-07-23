/* eslint no-unused-vars: off */

import { makeExecutableSchema } from 'graphql-tools';

// import { PubSub, withFilter } from 'graphql-subscriptions';

// const pubsub = new PubSub();

import { Ports, Stations } from './connectors';

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

  type Station {
    id: Int!
    position: Position!
    port: Port!
  }

  type Query {
    ports: [Port]
    stations(portId: Int): [Station]
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
    stations(root, { portId }, context) {
      if (portId !== undefined) return Stations.stationsByPort(portId);
      return Stations.stations();
    },
  },
};

const jsSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default jsSchema;

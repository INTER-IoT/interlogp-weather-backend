import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';

// Subs
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import schema from './schema';

import config from './config';

import { fakeGenerator } from './fake-connector';

fakeGenerator(10, 100);

const PORT = config.server.port;

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/graphql', graphqlExpress({ schema }));

if (config.dev) {
  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
  }));
}

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`API Server is now running on http://localhost:${PORT}/graphql`);
  console.log(`API Subscriptions server is now running on ws://localhost:${PORT}/subscriptions`);
});

// Subs
SubscriptionServer.create(
  {
    schema,
    execute,
    subscribe,
  },
  {
    server,
    path: '/subscriptions',
  },
);

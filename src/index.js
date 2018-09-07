import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';

// Subs
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import { weatherMeasurementEndpoint } from './endpoints';

import schema from './schema';

import config from './config';

const PORT = config.server.port;

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', express.static(`${__dirname}/static`));

app.use('/graphql', graphqlExpress({ schema }));

if (config.dev) {
  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
  }));
}

app.post('/weatherMeasurement', weatherMeasurementEndpoint);

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

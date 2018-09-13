import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import morgan from 'morgan';

// Subs
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import measurementInputApp from './measurement-input';

import schema from './schema';

import config from './config';

const PORT = config.server.port;

const GRAPHQL_PATH = '/graphql';
const SUBSCRIPTIONS_PATH = '/subscriptions';
const MEASUREMENTS_PATH = '/measurements';
const GRAPHIQL_PATH = '/graphiql';
const STATIC_FILE_PATH = '/static';

const app = express();

app.use(morgan('common'));
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use('/', express.static(`${__dirname}${STATIC_FILE_PATH}`));

app.use(GRAPHQL_PATH, graphqlExpress({ schema }));

if (config.dev) {
  app.use(GRAPHIQL_PATH, graphiqlExpress({
    endpointURL: GRAPHQL_PATH,
    subscriptionsEndpoint: `ws://localhost:${PORT}${SUBSCRIPTIONS_PATH}`,
  }));
}

app.use(MEASUREMENTS_PATH, measurementInputApp);

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`API Server is now running on http://localhost:${PORT}${GRAPHQL_PATH}`);
  console.log(`API Subscriptions server is now running on ws://localhost:${PORT}${SUBSCRIPTIONS_PATH}`);
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
    path: SUBSCRIPTIONS_PATH,
  },
);


const stopHandler = async () => {
  console.log('Stopping...');

  const timeoutId = setTimeout(() => {
    process.exit(1);
    console.error('Stopped forcefully, not all connection was closed');
  }, 2000);

  try {
    await server.close();
    clearTimeout(timeoutId);
  } catch (error) {
    console.error(error, 'Error during stop.');
    process.exit(1);
  }
};

process.on('SIGTERM', stopHandler);
process.on('SIGINT', stopHandler);
process.on('SIGHUP', stopHandler);

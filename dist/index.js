'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _http = require('http');

var _graphqlServerExpress = require('graphql-server-express');

var _graphql = require('graphql');

var _subscriptionsTransportWs = require('subscriptions-transport-ws');

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PORT = 3020;

// Subs

var SUBSCRIPTIONS_PATH = '/subscriptions';

var app = (0, _express2.default)();

app.use((0, _cors2.default)());

app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());

app.use('/graphql', (0, _graphqlServerExpress.graphqlExpress)({ schema: _schema2.default }));

app.use('/graphiql', (0, _graphqlServerExpress.graphiqlExpress)({
  endpointURL: '/graphql'
}));

var server = (0, _http.createServer)(app);

server.listen(PORT, function () {
  console.log('API Server is now running on http://localhost:' + PORT + '/graphql');
  console.log('API Subscriptions server is now running on ws://localhost:' + PORT + SUBSCRIPTIONS_PATH);
});

// Subs
_subscriptionsTransportWs.SubscriptionServer.create({
  schema: _schema2.default,
  execute: _graphql.execute,
  subscribe: _graphql.subscribe
}, {
  server: server,
  path: SUBSCRIPTIONS_PATH
});
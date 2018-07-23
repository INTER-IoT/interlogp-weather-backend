'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphqlTools = require('graphql-tools');

var _connectors = require('./connectors');

var _connectors2 = _interopRequireDefault(_connectors);

var _graphqlSubscriptions = require('graphql-subscriptions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pubsub = new _graphqlSubscriptions.PubSub();

var TAGS_CHANGED_TOPIC = 'tags_changed';

var typeDefs = ['\n  type Tag {\n    id: Int\n    label: String\n    type: String\n  }\n\n  type TagsPage {\n    tags: [Tag]\n    hasMore: Boolean\n  }\n\n  type Query {\n    hello: String\n    ping(message: String!): String\n    tags(type: String!): [Tag]\n    tagsPage(page: Int!, size: Int!): TagsPage\n    randomTag: Tag\n    lastTag: Tag\n  }\n\n  type Mutation {\n    addTag(type: String!, label: String!): Tag\n  }\n\n  type Subscription {\n    tagAdded(type: String!): Tag\n  }\n\n  schema {\n    query: Query\n    mutation: Mutation\n    subscription: Subscription\n  }\n'];

var resolvers = {
  Query: {
    hello: function hello(root, args, context) {
      return "Hello world!";
    },
    ping: function ping(root, _ref, context) {
      var message = _ref.message;

      return 'Answering ' + message;
    },
    tags: function tags(root, _ref2, context) {
      var type = _ref2.type;

      return _connectors2.default.getTags(type);
    },
    tagsPage: function tagsPage(root, _ref3, context) {
      var page = _ref3.page,
          size = _ref3.size;

      return _connectors2.default.getTagsPage(page, size);
    },
    randomTag: function randomTag(root, args, context) {
      return _connectors2.default.getRandomTag();
    },
    lastTag: function lastTag(root, args, context) {
      return _connectors2.default.getLastTag();
    }
  },
  Mutation: {
    addTag: async function addTag(root, _ref4, context) {
      var type = _ref4.type,
          label = _ref4.label;

      console.log('adding ' + type + ' tag \'' + label + '\'');
      var newTag = await _connectors2.default.addTag(type, label);
      pubsub.publish(TAGS_CHANGED_TOPIC, { tagAdded: newTag });
      return newTag;
    }
  },
  Subscription: {
    tagAdded: {
      subscribe: (0, _graphqlSubscriptions.withFilter)(function () {
        return pubsub.asyncIterator(TAGS_CHANGED_TOPIC);
      }, function (payload, variables) {
        return payload.tagAdded.type === variables.type;
      })
    }
  }
};

var jsSchema = (0, _graphqlTools.makeExecutableSchema)({
  typeDefs: typeDefs,
  resolvers: resolvers
});

exports.default = jsSchema;
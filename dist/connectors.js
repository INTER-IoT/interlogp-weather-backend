'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Let's generate some tags
var id = 0;
// Fake word generator

var tags = [];
for (var i = 0; i < 42; i++) {
  if (Math.random() < .5) {
    addTag('City', _faker2.default.address.city());
  } else {
    addTag('Company', _faker2.default.company.companyName());
  }
}

function addTag(type, label) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      var t = {
        id: id++,
        label: label,
        type: type
      };
      tags.push(t);
      resolve(t);
    }, 2000);
  });
}

function fakeDelay(cb) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(cb());
    }, 2000);
  });
}

exports.default = {
  getTags: function getTags(type) {
    return fakeDelay(function () {
      return _lodash2.default.filter(tags, function (tag) {
        return tag.type === type;
      });
    });
  },
  getTagsPage: function getTagsPage(page, pageSize) {
    return fakeDelay(function () {
      var start = page * pageSize;
      var end = start + pageSize;
      return {
        tags: tags.slice(start, end),
        hasMore: end < tags.length
      };
    });
  },
  getRandomTag: function getRandomTag() {
    return tags[Math.round(Math.random() * (tags.length - 1))];
  },
  getLastTag: function getLastTag() {
    return tags[tags.length - 1];
  },

  addTag: addTag
};
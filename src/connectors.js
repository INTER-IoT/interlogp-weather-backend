import _ from 'lodash';
// Fake word generator
import faker from 'faker';

// Let's generate some tags
let id = 0;
const tags = [];

function addTag(type, label) {
  return new Promise((resolve) => {
    setTimeout(() => {
      id += 1;
      const t = {
        id,
        label,
        type,
      };
      tags.push(t);
      resolve(t);
    }, 2000);
  });
}


for (let i = 0; i < 42; i += 1) {
  if (Math.random() < 0.5) {
    addTag('City', faker.address.city());
  } else {
    addTag('Company', faker.company.companyName());
  }
}


function fakeDelay(cb) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(cb());
    }, 2000);
  });
}

export default {
  getTags(type) {
    return fakeDelay(() => _.filter(tags, tag => tag.type === type));
  },
  getTagsPage(page, pageSize) {
    return fakeDelay(() => {
      const start = page * pageSize;
      const end = start + pageSize;
      return {
        tags: tags.slice(start, end),
        hasMore: end < tags.length,
      };
    });
  },
  getRandomTag() {
    return tags[Math.round(Math.random() * (tags.length - 1))];
  },
  getLastTag() {
    return tags[tags.length - 1];
  },
  addTag,
};

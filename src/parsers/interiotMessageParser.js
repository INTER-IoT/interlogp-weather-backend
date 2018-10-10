const compareFlatUnsortedArray = (a1, a2) => {
  if (!a1 || !a2) return false;
  if (!Array.isArray(a1)) a1 = [a1];
  if (!Array.isArray(a2)) a2 = [a2];
  if (a1.length !== a2.length) return false;
  a1.sort();
  a2.sort();
  for (let i = 0; i < a1.length; i += 1) {
    if (a1[i] !== a2[i]) return false;
  }
  return true;
};

// mazo hate
const adaptToPreviousVersion = (graph) => {
  const newTypeKey = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
  if (graph[newTypeKey] && !graph['@type']) {
    const newType = graph[newTypeKey];
    if (Array.isArray(newType)) graph['@type'] = newType.map(newtype => newtype['@id']);
    else if (typeof newType === 'object') graph['@type'] = newType['@id'];
    else graph['@type'] = newType;
    delete graph[newTypeKey];
  }
  return graph;
};

const flatenize = (message, items) => {
  if (Array.isArray(message)) [message] = message; // fix that from intermw v2.3 messages come in an array, but in logp there is only 1 item per message
  items = items || [];
  Object.keys(message).forEach((key) => {
    if (key === '@graph') {
      message['@graph'].forEach(subMessage => flatenize(subMessage, items));
    }
  });
  message = adaptToPreviousVersion(message);
  if (message['@type']) items.push(message);
  return items;
};

const parse = (message, matchItems, post) => {
  const flat = flatenize(message);
  const matches = {};
  matchItems.forEach((matchItem) => {
    let match;
    if (matchItem.match) match = flat.find(matchItem.match);
    else match = flat.find(flatItem => compareFlatUnsortedArray(flatItem['@type'], matchItem.typeMatch));
    if (!Array.isArray(matchItem.path)) matchItem.path = [matchItem.path];
    let value = matchItem.path.reduce((a, b) => a[b], match);
    if (matchItem.p) value = matchItem.p(value, flat);
    if (!Array.isArray(matchItem.key)) matchItem.key = [matchItem.key];
    matchItem.key.reduce((a, b, i) => {
      if (i === matchItem.key.length - 1) a[b] = value;
      else if (!a[b]) a[b] = {};
      return a[b];
    }, matches);
  });
  if (post) return post(matches);
  return matches;
};

const parser = {
  parse,
};

const typeParsers = {
  int: v => global.parseInt(v, 10),
  float: v => global.parseFloat(v),
  date: v => new Date(v),
};

export {
  parser,
  typeParsers,
  flatenize,
  compareFlatUnsortedArray,
};

export default {
  parser,
  typeParsers,
  flatenize,
  compareFlatUnsortedArray,
};

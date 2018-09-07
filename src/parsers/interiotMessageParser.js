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

const flatenize = (message, items) => {
  items = items || [];
  Object.keys(message).forEach((key) => {
    if (key === '@graph') {
      message['@graph'].forEach(subMessage => flatenize(subMessage, items));
    }
  });
  if (message['@type']) items.push(message);
  return items;
};

const parse = (message, matchItems) => {
  const flat = flatenize(message);
  const matches = {};
  matchItems.forEach((matchItem) => {
    const match = flat.find(flatItem => compareFlatUnsortedArray(flatItem['@type'], matchItem.typeMatch));
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
};

export default {
  parser,
  typeParsers,
};

const daysOnMonth = (year) => {
  const normal = [undefined, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const leap = [undefined, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (year % 4 !== 0) {
    return normal;
  }
  if (year % 100 !== 0) {
    return leap;
  }
  if (year % 400 !== 0) {
    return normal;
  }
  return leap;
};

const compare = (a, b) => {
  if (a.year > b.year) {
    return 1;
  }
  if (a.year < b.year) {
    return -1;
  }
  if (a.month > b.month) {
    return 1;
  }
  if (a.month < b.month) {
    return -1;
  }
  if (a.day > b.day) {
    return 1;
  }
  if (a.day < b.day) {
    return -1;
  }
  return 0;
};

const isValid = (a) => {
  if (a.month < 1 || a.month > 12) {
    return false;
  }
  const maxDays = daysOnMonth(a.year)[a.month];
  if (a.days < 1 || a.days > maxDays) {
    return false;
  }
  return true;
};

const nextDay = (a) => {
  const monthDays = daysOnMonth(a.year)[a.month];
  if (a.day < monthDays) {
    a.day += 1;
    return a;
  }
  if (a.month < 12) {
    a.month += 1;
    a.day = 1;
    return a;
  }
  a.year += 1;
  a.month = 1;
  a.day = 1;
  return a;
};

const parse = (s) => {
  const items = s.trim().split('-');
  return {
    year: parseInt(items[0], 10),
    month: parseInt(items[1], 10),
    day: parseInt(items[2], 10),
  };
};

const DayGenerator = function* dayGenerator(from, to) {
  const start = parse(from);
  const end = parse(to);
  if (!isValid(start)) throw new Error(`Invalid start date: ${from}`);
  if (!isValid(end)) throw new Error(`Invalid start date: ${to}`);
  let current = start;
  while (compare(current, end) <= 0) {
    yield current;
    current = nextDay(current);
  }
};

const dayDiv = (n, c = 0) => {
  const secs = 24 * 3600;
  const span = Math.floor(secs / n);
  const result = [];
  for (let i = 0; i < n; i += 1) {
    const x = span * i + c;
    const s = x % 60;
    const m = ((x - s) / 60) % 60;
    const h = ((((x - s) / 60) - m) / 60) % 60;
    result[i] = `${`00${h}`.substr(-2, 2)}:${`00${m}`.substr(-2, 2)}:${`00${s}`.substr(-2, 2)}`;
  }
  return result;
};

export {
  DayGenerator,
  dayDiv,
};

export default {
  DayGenerator,
  dayDiv,
};

import mongoose from 'mongoose';

import {
  PortModel,
  StatisticModel,
} from './models';

const Statistics = {};

Statistics.statistics = async ({
  statType, period, stationId, portId,
  day, month, year,
}) => {
  const filter = { $and: [] };
  if (statType) filter.$and.push({ statType });
  if (period) filter.$and.push({ period });
  if (stationId) filter.$and.push({ stationId });
  if (portId) filter.$and.push({ portId });
  if (day) filter.$and.push({ day });
  if (month) filter.$and.push({ month });
  if (year) filter.$and.push({ year });
  if (filter.$and.length === 0) {
    delete filter.$and;
  }
  const stats = await StatisticModel.find(filter);
  return stats.map((stat) => {
    stat.average = JSON.stringify(stat.average);
    return stat;
  });
};

const getFields = model => Object.keys(model.schema.paths).filter(key => key !== 'id' && !key.startsWith('_') && model.schema.paths[key].instance === 'Number');

const getDailyAvgPipeline = (model, stationModel, fields, after, before) => {
  const station = Object.keys(model.schema.paths).find(key => key.endsWith('Station'));
  const match = { $match: { $and: [] } };
  if (after) {
    match.$match.$and.push({
      date: {
        $gt: after,
      },
    });
  }
  if (before) {
    match.$match.$and.push({
      date: {
        $lt: before,
      },
    });
  }
  let grouping = {
    $group: {
      _id: {
        month: { $month: '$date' },
        day: { $dayOfMonth: '$date' },
        year: { $year: '$date' },
        station: `$${station}`,
      },
    },
  };
  grouping = fields.reduce((_grouping, field) => {
    _grouping.$group[field] = {
      $avg: `$${field}`,
    };
    return _grouping;
  }, grouping);
  const lookup = [
    {
      $lookup: {
        from: stationModel.collection.name,
        localField: '_id.station',
        foreignField: '_id',
        as: 'station',
      },
    },
    { $unwind: '$station' },
    {
      $lookup: {
        from: PortModel.collection.name,
        localField: 'station.port',
        foreignField: '_id',
        as: 'station.port',
      },
    },
    { $unwind: '$station.port' },
  ];
  const pipeline = [];
  if (after || before) pipeline.push(match);
  pipeline.push(grouping);
  pipeline.push(...lookup);
  return pipeline;
};

const getDailyStatistics = async (type, after, before) => {
  const model = mongoose.model(`${type.charAt(0).toUpperCase()}${type.slice(1)}Measurement`);
  const stationModel = mongoose.model(`${type.charAt(0).toUpperCase()}${type.slice(1)}Station`);
  const fields = getFields(model);
  const result = await model.aggregate(getDailyAvgPipeline(model, stationModel, fields, after, before)).exec();
  return result.map((r) => {
    const stat = {};
    stat.day = r._id.day; // eslint-disable-line no-underscore-dangle
    stat.month = r._id.month; // eslint-disable-line no-underscore-dangle
    stat.year = r._id.year; // eslint-disable-line no-underscore-dangle
    stat.statType = type;
    stat.period = 'daily';
    stat.stationId = r.station.id;
    stat.portId = r.station.port.id;
    stat.average = fields.reduce((agg, field) => {
      agg[field] = r[field];
      return agg;
    }, {});
    return stat;
  });
};

Statistics.generateDaily = async (after, before) => {
  const stats = (
    await Promise.all(['weather', 'emission', 'sound'].map(type => getDailyStatistics(type, after, before)))
  ).reduce((agg, typeStats) => [...agg, ...typeStats], []);
  await Promise.all(stats.map(stat => new StatisticModel(stat).save()));
};

Statistics.latestDaily = async () => {
  const last = await StatisticModel.findOne({ period: 'daily' }).sort({
    year: -1,
    month: -1,
    day: -1,
  });
  if (!last) return null;
  return new Date(`${last.year}-${`00${last.month}`.substr(-2, 2)}-${`00${last.day}`.substr(-2, 2)}`);
};

Statistics.latestMonthly = async () => {
  const last = await StatisticModel.findOne({ period: 'monthly' }).sort({
    year: -1,
    month: -1,
    day: -1,
  });
  if (!last) return null;
  return new Date(`${last.year}-${`00${last.month}`.substr(-2, 2)}-01`);
};

Statistics.generate = async () => {
  const last = await Statistics.latestDaily();
  const after = last === null ? null : new Date(last.getTime() + 24 * 3600 * 1000);
  const today = new Date();
  const before = new Date(`${today.getFullYear()}-${`00${today.getMonth() + 1}`.substr(-2, 2)}-${`00${today.getDate()}`.substr(-2, 2)}`);
  await Statistics.generateDaily(after, before);
  const lastMonth = await Statistics.latestMonthly();
  console.log(lastMonth);
};

export default Statistics;

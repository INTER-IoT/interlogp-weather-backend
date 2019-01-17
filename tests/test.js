import mongoose from 'mongoose';

import {
  PortModel,
  WeatherStationModel,
  // EmissionStationModel,
  // SoundStationModel,
  IntermwMessageModel,
} from '../src/connectors/mongo/models';

mongoose.Promise = global.Promise;
mongoose.set('debug', true);

mongoose.connect('mongodb://localhost:27018/environmental', {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

/*
intermwMessageSchema.statics.lookup = ({ path, query }) => {
  const rel = mongoose.model(this.schema.path(path).caster.options.ref);
  const pipeline = [{
    $lookup: {
      from: rel.collection.name,
      as: path,
      let: { [path]: `$${path}` },
      pipeline: [{
        $match: {
          ...query,
          $expr: { $in: ['$_id', `$$${path}`] },
        },
      }],
    },
  }];
  return this.aggregate(pipeline).exec().then(r => r.map(m => this({
    ...m,
    [path]: m[path].map(r2 => rel(r2)),
  })));
};
*/

(async () => {
  try {
    const weatherStation = await WeatherStationModel.findOne({ id: 3 });


    console.log(weatherStation);
    /*
    const result = (await IntermwMessageModel.lookup({
      path: 'weatherStation',
      query: { id: 8 },
    }));
    console.log(result.map(msg => msg.date));
    */

    const result = (await IntermwMessageModel.aggregate([
      {
        $lookup: {
          from: WeatherStationModel.collection.name,
          localField: 'weatherStation',
          foreignField: '_id',
          as: 'weatherStation',
        },
      },
      { $unwind: '$weatherStation' },
      {
        $lookup: {
          from: PortModel.collection.name,
          localField: 'weatherStation.port',
          foreignField: '_id',
          as: 'weatherStation.port',
        },
      },
      { $unwind: '$weatherStation.port' },
      { $match: { 'weatherStation.port.id': 3 } },
      { $sort: { date: -1 } },
      { $limit: 10 },
    ]).exec());

    console.log(JSON.stringify(result, null, 2));


    await mongoose.disconnect();
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
})();

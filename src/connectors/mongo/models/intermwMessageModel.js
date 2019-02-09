import mongoose from 'mongoose';

const intermwMessageSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  weatherStation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WeatherStation',
  },
  soundStation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SoundStation',
  },
  emissionStation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmissionStation',
  },
  noatumWeatherStation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NoatumWeatherStation',
  },
  content: {
    type: String,
    required: true,
  },
});

intermwMessageSchema.statics.lookup = function lookup({ path, query }) {
  const rel = mongoose.model(this.schema.path(path).options.ref);
  const pipeline = [{
    $lookup: {
      from: rel.collection.name,
      as: path,
      let: { [path]: `$${path}` },
      pipeline: [{
        $match: {
          ...query,
          // $expr: { $in: ['$_id', `$$${path}`] },
        },
      }],
    },
  }];
  return this.aggregate(pipeline).exec().then(r => r.map(m => this({
    ...m,
    [path]: m[path].map(r2 => rel(r2)),
  })));
};

const intermwMessageModel = mongoose.model('IntermwMessage', intermwMessageSchema);

export default intermwMessageModel;

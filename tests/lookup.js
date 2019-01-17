
/* eslint-disable */
import mongoose from 'mongoose';
const { Schema, Types: { ObjectId } } = mongoose;

const uri = 'mongodb://localhost/looktest';

mongoose.Promise = global.Promise;
mongoose.set('debug', true);

const itemTagSchema = new Schema({
  tagName: String
});

const itemSchema = new Schema({
  title: String,
  description: String,
  tags: [{ type: Schema.Types.ObjectId, ref: 'ItemTag' }]
},{ timestamps: true });

itemSchema.statics.lookup = function({ path, query }) {
  let rel =
    mongoose.model(this.schema.path(path).caster.options.ref);

  // MongoDB 3.6 and up $lookup with sub-pipeline
  let pipeline = [
    { "$lookup": {
      "from": rel.collection.name,
      "as": path,
      "let": { [path]: `$${path}` },
      "pipeline": [
        { "$match": {
          ...query,
          "$expr": { "$in": [ "$_id", `$$${path}` ] }
        }}
      ]
    }}
  ];

  return this.aggregate(pipeline).exec().then(r => r.map(m =>
    this({ ...m, [path]: m[path].map(r => rel(r)) })
  ));
};

const Item = mongoose.model('Item', itemSchema);
const ItemTag = mongoose.model('ItemTag', itemTagSchema);

const log = body => console.log(JSON.stringify(body, undefined, 2));

(async function() {

  try {

    const conn = await mongoose.connect(uri);

    // Clean data
    await Promise.all(Object.entries(conn.models).map(([k,m]) => m.remove()));

    // Create tags and items
    const tags = await ItemTag.insertMany(
      ["movies", "funny", "news"].map(tagName => ({ tagName }))
    );

    console.log(tags);

    const item = await Item.create({
      "title": "Something",
      "description": "An item",
      tags
    });

    const item2 = await Item.create({
      "title": "Another something",
      "description": "Another item",
      tags: tags.filter(t => t.tagName === 'news'),
    });

    // Query with our static
    let result = (await Item.lookup({
      path: 'tags',
      query: { 'tagName': { '$in': [ 'politics' ] } }
    })).pop();
    log(result);


    await mongoose.disconnect();

  } catch(e) {
    console.error(e)
  } finally {
    process.exit()
  }

})()
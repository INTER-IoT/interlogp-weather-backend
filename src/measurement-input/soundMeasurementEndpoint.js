import { SoundMeasurements } from '../connectors/mongo';
import { soundParser } from '../parsers';
import { pubsub, topics } from '../pubsub';

export default async (req, res) => {
  try {
    let measurement = await soundParser.parse(req.body);
    measurement = await SoundMeasurements.saveNewMeasurement(measurement); // gets populated
    pubsub.publish(topics.NEW_MEASUREMENT_TOPIC, { newMeasurement: measurement });
    res.send('ok');
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

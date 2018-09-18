import { EmissionMeasurements, IntermwMessages } from '../connectors/mongo';
import { emissionParser } from '../parsers';
import { pubsub, topics } from '../pubsub';

export default async (req, res) => {
  try {
    let measurement = await emissionParser.parse(req.body);
    measurement = await EmissionMeasurements.saveNewMeasurement(measurement); // gets populated
    await IntermwMessages.saveNewMessage(req.body, measurement.date, measurement.emissionStation._id, 'emission'); // eslint-disable-line no-underscore-dangle
    pubsub.publish(topics.NEW_EMISSION_MEASUREMENT_TOPIC, { emissionMeasurement: measurement });
    res.send('ok');
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

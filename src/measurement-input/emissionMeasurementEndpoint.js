import { EmissionMeasurements, IntermwMessages } from '../connectors/mongo';
import { emissionParser } from '../parsers';
import { pubsub, topics } from '../pubsub';
import processRules from '../processRules';

export default async (req, res) => {
  try {
    let measurement = await emissionParser.parse(req.body);
    measurement = await EmissionMeasurements.saveNewMeasurement(measurement); // gets populated
    console.log(`Emission Measurement Received: station=${measurement.emissionStation.id}, date=${measurement.date}`);
    const intermwMessage = await IntermwMessages.saveNewMessage(req.body, req.ip, measurement.date, measurement.emissionStation._id, 'emission'); // eslint-disable-line no-underscore-dangle
    pubsub.publish(topics.NEW_INTERMW_MESSAGE_TOPIC, { newIntermwMessage: intermwMessage });
    pubsub.publish(topics.NEW_EMISSION_MEASUREMENT_TOPIC, { newEmissionMeasurement: measurement });
    processRules(measurement, 'emission');
    res.send('ok');
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

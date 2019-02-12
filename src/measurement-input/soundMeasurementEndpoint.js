import { SoundMeasurements, IntermwMessages } from '../connectors/mongo';
import { soundParser } from '../parsers';
import { pubsub, topics } from '../pubsub';
import processRules from '../processRules';

export default async (req, res) => {
  try {
    let measurement = (await soundParser.parse(req.body));
    measurement = await SoundMeasurements.saveNewMeasurement(measurement); // gets populated
    console.log(`Sound Measurement Received: station=${measurement.soundStation.id}, date=${measurement.date}`);
    const intermwMessage = await IntermwMessages.saveNewMessage(req.body, req.ip, measurement.date, measurement.soundStation._id, 'sound'); // eslint-disable-line no-underscore-dangle
    pubsub.publish(topics.NEW_INTERMW_MESSAGE_TOPIC, { newIntermwMessage: intermwMessage });
    pubsub.publish(topics.NEW_SOUND_MEASUREMENT_TOPIC, { newSoundMeasurement: measurement });
    processRules(measurement, 'sound');
    res.send('ok');
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

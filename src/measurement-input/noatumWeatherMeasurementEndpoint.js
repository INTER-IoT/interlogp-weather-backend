import { NoatumWeatherMeasurements, IntermwMessages } from '../connectors/mongo';
import { noatumWeatherParser } from '../parsers';
import { pubsub, topics } from '../pubsub';
import processRules from '../processRules';

export default async (req, res) => {
  try {
    let measurement = await noatumWeatherParser.parse(req.body);
    console.log(measurement);
    measurement = await NoatumWeatherMeasurements.saveNewMeasurement(measurement); // gets populated
    console.log(`NoatumWeather Measurement Received: station=${measurement.noatumWeatherStation.id}, date=${measurement.date}`);
    const intermwMessage = await IntermwMessages.saveNewMessage(req.body, req.ip, measurement.date, measurement.noatumWeatherStation._id, 'noatumWeather'); // eslint-disable-line no-underscore-dangle
    pubsub.publish(topics.NEW_INTERMW_MESSAGE_TOPIC, { newIntermwMessage: intermwMessage });
    pubsub.publish(topics.NEW_NOATUMWEATHER_MEASUREMENT_TOPIC, { newNoatumWeatherMeasurement: measurement });
    processRules(measurement, 'noatumWeather');
    res.send('ok');
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

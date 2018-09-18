import { WeatherMeasurements, IntermwMessages } from '../connectors/mongo';
import { weatherParser } from '../parsers';
import { pubsub, topics } from '../pubsub';

export default async (req, res) => {
  try {
    let measurement = await weatherParser.parse(req.body);
    measurement = await WeatherMeasurements.saveNewMeasurement(measurement); // gets populated
    await IntermwMessages.saveNewMessage(req.body, measurement.date, measurement.weatherStation._id, 'weather'); // eslint-disable-line no-underscore-dangle
    pubsub.publish(topics.NEW_WEATHER_MEASUREMENT_TOPIC, { weatherMeasurement: measurement });
    res.send('ok');
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

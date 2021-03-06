import { IntermwMessages } from '../connectors/mongo';
import { pubsub, topics } from '../pubsub';
import processRules from '../processRules';
import config from '../config';

const throttleCache = {};

const throttleCheck = (type, stationId, throttleTime) => {
  const lastTimeStamp = throttleCache[type][stationId];
  const now = new Date().getTime();
  if (lastTimeStamp) {
    return (now - lastTimeStamp) - throttleTime;
  }
  throttleCache[type][stationId] = now;
  return 0;
};

export default ({
  type,
  measurementModel,
  parser,
}) => {
  const stationType = `${type}Station`;
  const newMeasurementAttr = `new${type.charAt(0).toUpperCase()}${type.slice(1)}Measurement`;
  const newMeasurementTopic = topics[`NEW_${type.toUpperCase()}_MEASUREMENT_TOPIC`];
  throttleCache[type] = {};
  const throttleTime = config.throttle[type];
  return async (req, res) => {
    try {
      let measurement = await parser.parse(req.body);
      console.log(`New ${type} measurement received: station=${measurement.stationId}, date=${measurement.date}`);
      const diff = throttleCheck(type, measurement.stationId, throttleTime);
      if (diff < 0) {
        console.log(`Measurement blocked due to throttle: ${diff}`);
        res.send('ok');
        return;
      }
      // console.log(JSON.stringify(req.body, null ,4));
      measurement = await measurementModel.saveNewMeasurement(measurement); // gets populated
      const station = measurement[stationType];
      const intermwMessage = await IntermwMessages.saveNewMessage(req.body, req.ip, measurement.date, station._id, type); // eslint-disable-line no-underscore-dangle
      pubsub.publish(topics.NEW_INTERMW_MESSAGE_TOPIC, { newIntermwMessage: intermwMessage });
      const publishData = {};
      publishData[newMeasurementAttr] = measurement;
      pubsub.publish(newMeasurementTopic, publishData);
      processRules(measurement, type);
      res.send('ok');
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  };
};

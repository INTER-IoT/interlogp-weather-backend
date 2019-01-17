import { Buffer } from 'buffer';
import {
  PortModel,
  WeatherStationModel,
  EmissionStationModel,
  SoundStationModel,
  IntermwMessageModel,
} from './models';

const IntermwMessages = {};

IntermwMessages.messages = async () => IntermwMessageModel.find()
  .populate({
    path: 'weatherStation',
    populate: {
      path: 'port',
    },
  })
  .populate({
    path: 'emissionStation',
    populate: {
      path: 'port',
    },
  })
  .populate({
    path: 'soundStation',
    populate: {
      path: 'port',
    },
  });

const pipelineByPort = (model, path, portId, limit) => {
  const pipeline = [
    {
      $lookup: {
        from: model.collection.name,
        localField: path,
        foreignField: '_id',
        as: path,
      },
    },
    { $unwind: `$${path}` },
    {
      $lookup: {
        from: PortModel.collection.name,
        localField: `${path}.port`,
        foreignField: '_id',
        as: `${path}.port`,
      },
    },
    { $unwind: `$${path}.port` },
  ];
  if (portId != null) pipeline.push({ $match: { [`${path}.port.id`]: portId } });
  pipeline.push(...[
    { $sort: { date: -1 } },
    { $limit: limit },
  ]);
  return pipeline;
};

IntermwMessages.messagesByPort = async (portId, limit) => {
  const weatherStationMessages = await IntermwMessageModel.aggregate(pipelineByPort(WeatherStationModel, 'weatherStation', portId, limit)).exec();
  const emissionStationMessages = await IntermwMessageModel.aggregate(pipelineByPort(EmissionStationModel, 'emissionStation', portId, limit)).exec();
  const soundStationMessages = await IntermwMessageModel.aggregate(pipelineByPort(SoundStationModel, 'soundStation', portId, limit)).exec();
  const messages = [...weatherStationMessages, ...emissionStationMessages, ...soundStationMessages];
  return messages.sort((m1, m2) => m2.date - m1.date).slice(0, limit);
};

IntermwMessages.getStationByType = type => ({
  weather: 'weatherStation',
  emission: 'emissionStation',
  sound: 'soundStation',
})[type];

IntermwMessages.saveNewMessage = async (body, date, stationId, type) => {
  const intermwMessage = {
    content: Buffer.from(JSON.stringify(body)).toString('base64'),
    date,
  };
  intermwMessage[IntermwMessages.getStationByType(type)] = stationId;
  await new IntermwMessageModel(intermwMessage).save();
  const message = await IntermwMessageModel.populate(intermwMessage, {
    path: IntermwMessages.getStationByType(type),
    populate: {
      path: 'port',
    },
  });
  return message;
};

export default IntermwMessages;

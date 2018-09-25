import { Buffer } from 'buffer';
import { IntermwMessageModel } from './models';

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

IntermwMessages.messagesByPort = async (portId) => {
  const messages = await IntermwMessages.messages();
  return messages.filter((message) => {
    if (message.weatherStation) return message.weatherStation.port.id === portId;
    if (message.emissionStation) return message.emissionStation.port.id === portId;
    if (message.soundStation) return message.soundStation.port.id === portId;
    return false;
  });
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

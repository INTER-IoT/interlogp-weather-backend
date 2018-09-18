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
    return message.soundStation.port.id === portId;
  });
};

IntermwMessages.saveNewMessage = async (body, date, stationId, type) => {
  const intermwMessage = {
    content: Buffer.from(JSON.stringify(body)).toString('base64'),
    date,
  };
  switch (type) {
    case 'weather':
      intermwMessage.weatherStation = stationId;
      break;
    case 'emission':
      intermwMessage.emissionStation = stationId;
      break;
    case 'sound':
      intermwMessage.soundStation = stationId;
      break;
    default:
      throw new Error(`Unexpected type: ${type}`);
  }
  await new IntermwMessageModel(intermwMessage).save();
};

export default IntermwMessages;

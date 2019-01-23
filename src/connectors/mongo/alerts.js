import { AlertModel, PortModel } from './models';

const Alerts = {};

Alerts.alerts = filter => AlertModel.find(filter).populate('port');

Alerts.alertsByPort = async (portId, filter) => {
  const alerts = await AlertModel.find(filter).populate({
    path: 'port',
    match: {
      id: portId,
    },
  });
  return alerts.filter(alert => alert.port !== null);
};

Alerts.processAlert = async (alertId) => {
  const dateProcessed = new Date();
  const { nModified } = await AlertModel.updateOne({ id: alertId }, { processed: true });
  const modified = nModified > 0;
  if (modified) {
    await AlertModel.updateOne({ id: alertId }, { dateProcessed });
  }
  return {
    alert: await AlertModel.findOne({ id: alertId }).populate('port'),
    modified,
  };
};


Alerts.createAlert = async (portId, title, text) => {
  const alert = {
    text,
    title,
    date: new Date(),
    processed: false,
    port: await PortModel.findOne({ id: portId }),
  };
  const savedAlert = await new AlertModel(alert).save();
  return savedAlert;
};

export default Alerts;

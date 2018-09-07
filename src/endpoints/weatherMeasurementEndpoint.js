import { WeatherStationModel, WeatherMeasurementModel } from '../models';
import { weatherParser } from '../parsers';


export default async (req, res) => {
  try {
    const measurement = await weatherParser.parse(req.body);
    measurement.id = 1;
    measurement.weatherStation = await WeatherStationModel.findOne({ id: measurement.stationId });
    const resp = await new WeatherMeasurementModel(measurement).save();
    console.log(resp);
    res.send('ok');
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

import express from 'express';

import weatherMeasurementEndpoint from './weatherMeasurementEndpoint';
import soundMeasurementEndpoint from './soundMeasurementEndpoint';
import emissionMeasurementEndpoint from './emissionMeasurementEndpoint';
import environmentalMeasurementEndpoint from './environmentalMeasurementEndpoint';

const app = express();

// in case the json is sent with any other content-type that is not application/json
// also trim and remove first double quotes if present
app.use('/', async (req, res, next) => {
  const contentType = req.header('content-type');
  if (contentType === undefined || contentType === null || contentType.toLowerCase() !== 'application/json') {
    let body = req.body.trim();
    if (body.startsWith('"') && body.endsWith('"')) {
      body = body.substring(1, body.length - 1);
    }
    req.body = JSON.parse(body);
  }
  next();
});

app.post('/weather', weatherMeasurementEndpoint);
app.post('/sound', soundMeasurementEndpoint);
app.post('/emission', emissionMeasurementEndpoint);
app.post('/environmental', environmentalMeasurementEndpoint);

export default app;

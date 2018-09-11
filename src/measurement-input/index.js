import express from 'express';

import weatherMeasurementEndpoint from './weatherMeasurementEndpoint';
import soundMeasurementEndpoint from './soundMeasurementEndpoint';
import emissionMeasurementEndpoint from './emissionMeasurementEndpoint';
import environmentalMeasurementEndpoint from './environmentalMeasurementEndpoint';

const app = express();

app.post('/weather', weatherMeasurementEndpoint);
app.post('/sound', soundMeasurementEndpoint);
app.post('/emission', emissionMeasurementEndpoint);
app.post('/environmental', environmentalMeasurementEndpoint);

export default app;

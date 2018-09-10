import express from 'express';

import weatherMeasurementEndpoint from './weatherMeasurementEndpoint';

const app = express();

app.post('/weather', weatherMeasurementEndpoint);

export default app;

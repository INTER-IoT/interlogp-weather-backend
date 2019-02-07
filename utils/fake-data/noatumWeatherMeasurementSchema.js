/* eslint-disable */
export default {
  'id': 'noatumWeatherMeasurement',
  'type': 'object',
  'properties': {
    'date': {
      'type': 'date',
      'faker': {
        'date.between': [
          '2018-07-23T00:00:00.000Z',
          '2018-07-28T00:00:00.000Z'
        ]
      }
    },
    'windSpeed': {
      'type': 'number',
      'minimum': 0,
      'maximum': 25
    },
  },
  'required': [
    'date',
    'windSpeed',
  ]
}
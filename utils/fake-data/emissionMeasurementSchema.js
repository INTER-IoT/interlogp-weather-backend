/* eslint-disable */
export default {
  'id': 'emissionMeasurement',
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
    'particles': {
      'type': 'number',
      'minimum': 5000,
      'maximum': 8000
    },
    'nox': {
      'type': 'integer',
      'minimum': 0,
      'maximum': 100
    },
    'so2': {
      'type': 'integer',
      'minimum': 0,
      'maximum': 100
    },
    'no2': {
      'type': 'integer',
      'minimum': 0,
      'maximum': 100
    },
    'no': {
      'type': 'integer',
      'minimum': 0,
      'maximum': 100
    },
    'co': {
      'type': 'number',
      'minimum': 0,
      'maximum': 100
    },
  },
  'required': [
    'date',
    'particles',
    'nox',
    'so2',
    'no2',
    'no',
    'co',
  ]
}
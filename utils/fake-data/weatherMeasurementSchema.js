/* eslint-disable */
export default {
  'id': 'weatherMeasurement',
  'type': 'object',
  'properties': {
    'precipitation': {
      'type': 'number',
      'minimum': 0,
      'maximum': 10
    },
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
    'solarRadiation': {
      'type': 'number',
      'minimum': 0,
      'maximum': 0
    },
    'pressure': {
      'type': 'number',
      'minimum': 1000,
      'maximum': 1050
    },
    'humidity': {
      'type': 'number',
      'minimum': 65,
      'maximum': 95
    },
    'seaTemperature': {
      'type': 'number',
      'minimum': 0,
      'maximum': 0
    },
    'averageTemperature': {
      'type': 'number',
      'minimum': 10,
      'maximum': 35
    },
    'windDirection': {
      'type': 'number',
      'minimum': 0,
      'maximum': 360
    }
  },
  'required': [
    'precipitation',
    'date',
    'windSpeed',
    'solarRadiation',
    'pressure',
    'humidity',
    'seaTemperature',
    'averageTemperature',
    'windDirection'
  ]
}
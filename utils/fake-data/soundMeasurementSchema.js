/* eslint-disable */
export default {
  'id': 'soundMeasurement',
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
    'maxLevel': {
      'type': 'integer',
      'minimum': 90,
      'maximum': 140
    },
    'minLevel': {
      'type': 'integer',
      'minimum': 10,
      'maximum': 90
    },
    'duration': {
      'type': 'integer',
      'minimum': 30000,
      'maximum': 600000,
    }
  },
  'required': [
    'date',
    'maxLevel',
    'minLevel',
    'duration',
  ]
}
/* eslint-disable global-require */
import fakeData from '../fake-data';

const generate = (stationId, size, date) => fakeData.generateWeatherMeasurements(size)
  .map((measurement) => {
    measurement.date = new Date(date);
    measurement.messageDate = new Date(measurement.date);
    measurement.messageDate.setMinutes(measurement.date.getMinutes() + 5);
    return measurement;
  })
  .map(measurement => `{
  "@graph": [
    {
      "@graph": [
        {
          "@id": "msg:meta/5ec99e2c-30df-457b-b2b3-5b44d38aa0ca",
          "msg:SenderPlatformId": {
            "@id": "http://www.inter-iot.eu/wso2port"
          },
          "msg:conversationID": "conv38660fe1-5e11-4917-9755-d7e91cf900b6",
          "msg:dateTimeStamp": "${measurement.messageDate.toISOString()}",
          "msg:messageID": "msg634cf15f-8551-460f-a473-39d4a531f3dd",
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
            {
              "@id": "msg:Observation"
            },
            {
              "@id": "msg:meta"
            }
          ]
        }
      ],
      "@id": "msg:metadata"
    },
    {
      "@graph": [
        {
          "@id": "_:b0",
          "iiot:hasResultValue": {
            "@type": "http://www.w3.org/2001/XMLSchema#float",
            "@value": "${measurement.pressure}"
          },
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
            {
              "@id": "sosa:Result"
            },
            {
              "@id": "InterIoT:LogVPmod#Pressure"
            }
          ]
        },
        {
          "@id": "_:b1",
          "iiot:hasResultValue": {
            "@type": "http://www.w3.org/2001/XMLSchema#float",
            "@value": "${measurement.windspeed}"
          },
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
            {
              "@id": "sosa:Result"
            },
            {
              "@id": "InterIoT:LogVPmod#WindSpeed"
            }
          ]
        },
        {
          "@id": "_:b2",
          "iiot:hasResultValue": {
            "@type": "http://www.w3.org/2001/XMLSchema#float",
            "@value": "${measurement.averageTemperature}"
          },
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
            {
              "@id": "sosa:Result"
            },
            {
              "@id": "InterIoT:LogVPmod#AverageTemperature"
            }
          ]
        },
        {
          "@id": "_:b3",
          "iiot:hasResultValue": {
            "@type": "http://www.w3.org/2001/XMLSchema#float",
            "@value": "${measurement.humidity}"
          },
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
            {
              "@id": "sosa:Result"
            },
            {
              "@id": "InterIoT:LogVPmod#AverageHumidity"
            }
          ]
        },
        {
          "@id": "_:b4",
          "iiot:hasResultValue": {
            "@type": "http://www.w3.org/2001/XMLSchema#float",
            "@value": "${measurement.windDirection}"
          },
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
            {
              "@id": "sosa:Result"
            },
            {
              "@id": "InterIoT:LogVPmod#WindDirection"
            }
          ]
        },
        {
          "@id": "_:b5",
          "iiot:hasResultValue": {
            "@type": "http://www.w3.org/2001/XMLSchema#float",
            "@value": "${measurement.solarRadiation}"
          },
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
            {
              "@id": "sosa:Result"
            },
            {
              "@id": "InterIoT:LogVPmod#Radiation"
            }
          ]
        },
        {
          "@id": "_:b6",
          "iiot:hasResultValue": {
            "@type": "http://www.w3.org/2001/XMLSchema#float",
            "@value": "${measurement.seaTemperature}"
          },
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
            {
              "@id": "sosa:Result"
            },
            {
              "@id": "InterIoT:LogVPmod#SeaTemperature"
            }
          ]
        },
        {
          "@id": "_:b7",
          "iiot:hasResultValue": {
            "@type": "http://www.w3.org/2001/XMLSchema#float",
            "@value": "${measurement.precipitation}"
          },
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
            {
              "@id": "sosa:Result"
            },
            {
              "@id": "InterIoT:LogVPmod#Precipitation"
            }
          ]
        },
        {
          "@id": "http://www.inter-iot.eu/wso2port/weather/stations/${stationId}",
          "iiotex:hasLocalId": {
            "@type": "http://www.w3.org/2001/XMLSchema#int",
            "@value": "${stationId}"
          },
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
            {
              "@id": "InterIoT:LogVPmod#MeteoStation"
            },
            {
              "@id": "iiot:IoTDevice"
            },
            {
              "@id": "sosa:Sensor"
            }
          ]
        },
        {
          "@id": "http://www.inter-iot.eu/wso2port/weather/stations/${stationId}/3181710",
          "iiotex:hasLocalId": {
            "@type": "http://www.w3.org/2001/XMLSchema#int",
            "@value": "3181710"
          },
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
            {
              "@id": "InterIoT:LogVPmod#WeatherMeasurement"
            },
            {
              "@id": "sosa:Observation"
            }
          ],
          "sosa:hasResult": [
            {
              "@id": "_:b3"
            },
            {
              "@id": "_:b6"
            },
            {
              "@id": "_:b4"
            },
            {
              "@id": "_:b2"
            },
            {
              "@id": "_:b1"
            },
            {
              "@id": "_:b5"
            },
            {
              "@id": "_:b0"
            },
            {
              "@id": "_:b7"
            }
          ],
          "sosa:madeBySensor": {
            "@id": "http://www.inter-iot.eu/wso2port/weather/stations/${stationId}"
          },
          "sosa:resultTime": {
            "@type": "http://www.w3.org/2001/XMLSchema#dateTimeStamp",
            "@value": "${measurement.date.toISOString()}"
          }
        }
      ],
      "@id": "msg:payload"
    }
  ],
  "@context": {
    "msg": "http://inter-iot.eu/message/",
    "iiotex": "http://inter-iot.eu/GOIoTPex#",
    "geosparql": "http://www.opengis.net/ont/geosparql#",
    "iiot": "http://inter-iot.eu/GOIoTP#",
    "InterIoT": "http://inter-iot.eu/",
    "ssn": "http://www.w3.org/ns/ssn/",
    "sosa": "http://www.w3.org/ns/sosa/"
  }
}`);

export default {
  generate,
};

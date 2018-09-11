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
            "@id": "InterIoT:message/meta/be4209e0-3592-4339-9aa4-1fedfcce071d",
            "@type": [
              "Observation",
              "meta"
            ],
            "SenderPlatformId": {
              "@id": "http://www.inter-iot.eu/wso2port"
            },
            "conversationID": "conv2179ae6c-62e3-46b8-bdcd-2c305126c57c",
            "dateTimeStamp": "${measurement.messageDate.toISOString()}",
            "messageID": "msg1967dd28-5a9c-4bde-a4a5-d420c408e2ad"
          }
        ],
        "@id": "InterIoT:message/metadata"
      },
      {
        "@graph": [
          {
            "@id": "_:b0",
            "@type": [
              "sosa:Result",
              "InterIoT:LogVPmod#Precipitation"
            ],
            "iiot:hasResultValue": {
              "@type": "http://www.w3.org/2001/XMLSchema#float",
              "@value": "${measurement.precipitation}"
            }
          },
          {
            "@id": "_:b1",
            "@type": [
              "InterIoT:LogVPmod#WeatherMeasurment",
              "sosa:Observation"
            ],
            "sosa:hasResult": [
              {
                "@id": "_:b2"
              },
              {
                "@id": "_:b3"
              },
              {
                "@id": "_:b4"
              },
              {
                "@id": "_:b0"
              },
              {
                "@id": "_:b5"
              },
              {
                "@id": "_:b6"
              },
              {
                "@id": "_:b7"
              },
              {
                "@id": "_:b8"
              }
            ],
            "sosa:madeBySensor": {
              "@id": "http://www.inter-iot.eu/wso2port/weather/stations/${stationId}"
            },
            "sosa:resultTime": {
              "@type": "http://www.w3.org/2001/XMLSchema#dateTimeStamp",
              "@value": "${measurement.date.toISOString()}"
            }
          },
          {
            "@id": "_:b2",
            "@type": [
              "sosa:Result",
              "InterIoT:LogVPmod#WindSpeed"
            ],
            "iiot:hasResultValue": {
              "@type": "http://www.w3.org/2001/XMLSchema#float",
              "@value": "${measurement.windSpeed}"
            }
          },
          {
            "@id": "_:b3",
            "@type": [
              "sosa:Result",
              "InterIoT:LogVPmod#Radiation"
            ],
            "iiot:hasResultValue": {
              "@type": "http://www.w3.org/2001/XMLSchema#float",
              "@value": "${measurement.solarRadiation}"
            }
          },
          {
            "@id": "_:b4",
            "@type": [
              "sosa:Result",
              "InterIoT:LogVPmod#Pressure"
            ],
            "iiot:hasResultValue": {
              "@type": "http://www.w3.org/2001/XMLSchema#float",
              "@value": "${measurement.pressure}"
            }
          },
          {
            "@id": "_:b5",
            "@type": [
              "sosa:Result",
              "InterIoT:LogVPmod#AverageHumidity"
            ],
            "iiot:hasResultValue": {
              "@type": "http://www.w3.org/2001/XMLSchema#float",
              "@value": "${measurement.humidity}"
            }
          },
          {
            "@id": "_:b6",
            "@type": [
              "sosa:Result",
              "InterIoT:LogVPmod#SeaTemperature"
            ],
            "iiot:hasResultValue": {
              "@type": "http://www.w3.org/2001/XMLSchema#float",
              "@value": "${measurement.seaTemperature}"
            }
          },
          {
            "@id": "_:b7",
            "@type": [
              "sosa:Result",
              "InterIoT:LogVPmod#AverageTemperature"
            ],
            "iiot:hasResultValue": {
              "@type": "http://www.w3.org/2001/XMLSchema#float",
              "@value": "${measurement.averageTemperature}"
            }
          },
          {
            "@id": "_:b8",
            "@type": [
              "sosa:Result",
              "InterIoT:LogVPmod#WindDirection"
            ],
            "iiot:hasResultValue": {
              "@type": "http://www.w3.org/2001/XMLSchema#float",
              "@value": "${measurement.windDirection}"
            }
          },
          {
            "@id": "http://www.inter-iot.eu/wso2port/weather/stations/9",
            "@type": [
              "sosa:Sensor",
              "iiot:IoTDevice",
              "InterIoT:LogVPmod#MeteoStation"
            ],
            "iiotex:hasLocalId": {
              "@type": "http://www.w3.org/2001/XMLSchema#int",
              "@value": "${stationId}"
            }
          }
        ],
        "@id": "InterIoT:message/payload"
      }
    ],
    "@context": {
      "@vocab": "http://inter-iot.eu/message/",
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

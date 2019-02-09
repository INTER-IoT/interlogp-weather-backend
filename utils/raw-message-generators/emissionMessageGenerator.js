/* eslint-disable global-require */
import fakeData from '../fake-data';

const generate = (stationId, size, date) => fakeData.generateEmissionMeasurements(size, `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`, `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)
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
          "@id": "msg:meta/eda94788-146b-4385-aaa4-09efdf92974b",
          "msg:SenderPlatformId": {
            "@id": "http://www.inter-iot.eu/wso2port"
          },
          "msg:conversationID": "conv390e3897-5374-4e66-963e-93671acf3d47",
          "msg:dateTimeStamp": "${measurement.messageDate.toISOString()}",
          "msg:messageID": "msg6189e9bf-74d4-4bc1-8b09-fd86e66c5b2b",
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
            "@type": "http://www.w3.org/2001/XMLSchema#int",
            "@value": "${measurement.no}"
          },
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
            {
              "@id": "InterIoT:LogVPmod#Emission_NO"
            },
            {
              "@id": "sosa:Result"
            }
          ]
        },
        {
          "@id": "_:b1",
          "iiot:hasResultValue": {
            "@type": "http://www.w3.org/2001/XMLSchema#int",
            "@value": "${measurement.nox}"
          },
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
            {
              "@id": "InterIoT:LogVPmod#Emission_NOX"
            },
            {
              "@id": "sosa:Result"
            }
          ]
        },
        {
          "@id": "_:b2",
          "iiot:hasResultValue": {
            "@type": "http://www.w3.org/2001/XMLSchema#int",
            "@value": "${measurement.no2}"
          },
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
            {
              "@id": "InterIoT:LogVPmod#Emission_NO2"
            },
            {
              "@id": "sosa:Result"
            }
          ]
        },
        {
          "@id": "_:b3",
          "iiot:hasResultValue": {
            "@type": "http://www.w3.org/2001/XMLSchema#float",
            "@value": "${measurement.particles}"
          },
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
            {
              "@id": "InterIoT:LogVPmod#ParticlesConcentration"
            },
            {
              "@id": "sosa:Result"
            }
          ]
        },
        {
          "@id": "_:b4",
          "iiot:hasResultValue": {
            "@type": "http://www.w3.org/2001/XMLSchema#float",
            "@value": "${measurement.co}"
          },
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
            {
              "@id": "InterIoT:LogVPmod#Emission_CO"
            },
            {
              "@id": "sosa:Result"
            }
          ]
        },
        {
          "@id": "_:b5",
          "iiot:hasResultValue": {
            "@type": "http://www.w3.org/2001/XMLSchema#int",
            "@value": "${measurement.so2}"
          },
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
            {
              "@id": "InterIoT:LogVPmod#Emission_SO2"
            },
            {
              "@id": "sosa:Result"
            }
          ]
        },
        {
          "@id": "http://www.inter-iot.eu/wso2port/emission/cabins/${stationId}",
          "iiotex:hasLocalId": {
            "@type": "http://www.w3.org/2001/XMLSchema#int",
            "@value": "${stationId}"
          },
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
            {
              "@id": "InterIoT:LogVPmod#EmissionCabin"
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
          "@id": "http://www.inter-iot.eu/wso2port/emission/cabins/${stationId}/3178660",
          "iiotex:hasLocalId": {
            "@type": "http://www.w3.org/2001/XMLSchema#int",
            "@value": "3178660"
          },
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
            {
              "@id": "sosa:Observation"
            },
            {
              "@id": "InterIoT:LogVPmod#EmissionMeasurement"
            }
          ],
          "sosa:hasResult": [
            {
              "@id": "_:b0"
            },
            {
              "@id": "_:b1"
            },
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
              "@id": "_:b5"
            }
          ],
          "sosa:madeBySensor": {
            "@id": "http://www.inter-iot.eu/wso2port/emission/cabins/${stationId}"
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

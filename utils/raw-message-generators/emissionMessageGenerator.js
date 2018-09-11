/* eslint-disable global-require */
import fakeData from '../fake-data';

const generate = (stationId, size, date) => fakeData.generateEmissionMeasurements(size)
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
            "@id": "InterIoT:message/meta/a5cf495e-ebc5-4524-9bc2-c973551ccd76",
            "@type": [
              "Observation",
              "meta"
            ],
            "SenderPlatformId": {
              "@id": "http://www.inter-iot.eu/wso2port"
            },
            "conversationID": "conv2179ae6c-62e3-46b8-bdcd-2c305126c57c",
            "dateTimeStamp": "${measurement.messageDate.toISOString()}",
            "messageID": "msga6747076-ed52-4ed6-8bc1-a6dab2b300e8"
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
              "InterIoT:LogVPmod#Emission_NOX"
            ],
            "iiot:hasResultValue": {
              "@type": "http://www.w3.org/2001/XMLSchema#int",
              "@value": "${measurement.nox}"
            }
          },
          {
            "@id": "_:b1",
            "@type": [
              "sosa:Result",
              "InterIoT:LogVPmod#ParticlesConcentration"
            ],
            "iiot:hasResultValue": {
              "@type": "http://www.w3.org/2001/XMLSchema#float",
              "@value": "${measurement.particles}"
            }
          },
          {
            "@id": "_:b2",
            "@type": [
              "sosa:Result",
              "InterIoT:LogVPmod#Emission_SO2"
            ],
            "iiot:hasResultValue": {
              "@type": "http://www.w3.org/2001/XMLSchema#int",
              "@value": "${measurement.so2}"
            }
          },
          {
            "@id": "_:b3",
            "@type": [
              "sosa:Result",
              "InterIoT:LogVPmod#Emission_NO2"
            ],
            "iiot:hasResultValue": {
              "@type": "http://www.w3.org/2001/XMLSchema#int",
              "@value": "${measurement.no2}"
            }
          },
          {
            "@id": "_:b4",
            "@type": [
              "sosa:Result",
              "InterIoT:LogVPmod#Emission_NO"
            ],
            "iiot:hasResultValue": {
              "@type": "http://www.w3.org/2001/XMLSchema#int",
              "@value": "${measurement.no}"
            }
          },
          {
            "@id": "_:b5",
            "@type": [
              "InterIoT:LogVPmod#Emission_CO",
              "sosa:Result"
            ],
            "iiot:hasResultValue": {
              "@type": "http://www.w3.org/2001/XMLSchema#float",
              "@value": "${measurement.co}"
            }
          },
          {
            "@id": "http://www.inter-iot.eu/wso2port/emission/cabins/${stationId}/3178660",
            "@type": [
              "sosa:Observation",
              "InterIoT:LogVPmod#EmmissionMeasurement"
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

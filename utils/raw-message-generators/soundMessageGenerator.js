/* eslint-disable global-require */
import fakeData from '../fake-data';

const generate = (stationId, size, date) => fakeData.generateSoundMeasurements(size)
  .map((measurement) => {
    measurement.date = new Date(date);
    const duration = measurement.end.getTime() - measurement.start.getTime();
    measurement.end = new Date(measurement.date - 2000);
    measurement.start = new Date(measurement.date - 2000 - duration);
    measurement.messageDate = new Date(measurement.date);
    measurement.messageDate.setMinutes(measurement.date.getMinutes() + 5);
    return measurement;
  })
  .map(measurement => `{
    "@graph": [
      {
        "@graph": [
          {
            "@id": "InterIoT:message/meta/a51e25e2-87d3-4be9-9d48-7b1f6827898c",
            "@type": [
              "Observation",
              "meta"
            ],
            "SenderPlatformId": {
              "@id": "http://www.inter-iot.eu/wso2port"
            },
            "conversationID": "conv2179ae6c-62e3-46b8-bdcd-2c305126c57c",
            "dateTimeStamp": "${measurement.date.toISOString()}",
            "messageID": "msgf9d79110-2ae2-47ab-96ef-33f591bbad80"
          }
        ],
        "@id": "InterIoT:message/metadata"
      },
      {
        "@graph": [
          {
            "@id": "_:b0",
            "@type": "http://www.w3.org/2006/time#Interval",
            "http://www.w3.org/2006/time#hasBeginning": {
              "@id": "_:b2"
            },
            "http://www.w3.org/2006/time#hasEnd": {
              "@id": "_:b1"
            }
          },
          {
            "@id": "_:b1",
            "@type": "http://www.w3.org/2006/time#Instant",
            "http://www.w3.org/2006/time#inXSDDateTimeStamp": {
              "@type": "http://www.w3.org/2001/XMLSchema#dateTimeStamp",
              "@value": "${measurement.end.toISOString()}"
            }
          },
          {
            "@id": "_:b2",
            "@type": "http://www.w3.org/2006/time#Instant",
            "http://www.w3.org/2006/time#inXSDDateTimeStamp": {
              "@type": "http://www.w3.org/2001/XMLSchema#dateTimeStamp",
              "@value": "${measurement.start.toISOString()}"
            }
          },
          {
            "@id": "_:b3",
            "@type": [
              "InterIoT:LogVPmod#MaxSoundLevel",
              "sosa:Result"
            ],
            "iiot:hasResultValue": {
              "@type": "http://www.w3.org/2001/XMLSchema#int",
              "@value": "${measurement.maxLevel}"
            }
          },
          {
            "@id": "_:b4",
            "@type": [
              "InterIoT:LogVPmod#AvgSoundLevel",
              "sosa:Result"
            ],
            "iiot:hasResultValue": {
              "@type": "http://www.w3.org/2001/XMLSchema#int",
              "@value": "${measurement.avgLevel}"
            }
          },
          {
            "@id": "_:b5",
            "@type": [
              "InterIoT:LogVPmod#MinSoundLevel",
              "sosa:Result"
            ],
            "iiot:hasResultValue": {
              "@type": "http://www.w3.org/2001/XMLSchema#int",
              "@value": "${measurement.minLevel}"
            }
          },
          {
            "@id": "_:b6",
            "@type": [
              "sosa:Observation",
              "InterIoT:LogVPmod#SoundMeasurement"
            ],
            "sosa:hasResult": [
              {
                "@id": "_:b5"
              },
              {
                "@id": "_:b3"
              },
              {
                "@id": "_:b4"
              }
            ],
            "sosa:madeBySensor": {
              "@id": "http://www.inter-iot.eu/wso2port/sound/cabins/${stationId}"
            },
            "sosa:phenomenonTime": {
              "@id": "_:b0"
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
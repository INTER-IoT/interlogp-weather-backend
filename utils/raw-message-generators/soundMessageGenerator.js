/* eslint-disable global-require */
import fakeData from '../fake-data';

const generate = (stationId, size, date) => fakeData.generateSoundMeasurements(size, `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`, `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)
  .map((measurement) => {
    measurement.date = new Date(date);
    const duration = measurement.end.getTime() - measurement.start.getTime();
    measurement.end = new Date(measurement.date - 2000);
    measurement.start = new Date(measurement.date - 2000 - duration);
    measurement.messageDate = new Date(date);
    measurement.messageDate.setMinutes(measurement.date.getMinutes() + 5);
    return measurement;
  })
  .map(measurement => `{
  "@graph": [
    {
      "@graph": [
        {
          "@id": "msg:meta/f24fc1e9-5d0f-4ec3-b610-2bbbd01f26b2",
          "msg:SenderPlatformId": {
            "@id": "http://www.inter-iot.eu/wso2port"
          },
          "msg:conversationID": "conv390e3897-5374-4e66-963e-93671acf3d47",
          "msg:dateTimeStamp": "${measurement.date.toISOString()}",
          "msg:messageID": "msg557f4c68-dce1-48d1-984a-bd17c6c957ec",
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
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": {
            "@id": "http://www.w3.org/2006/time#Interval"
          },
          "http://www.w3.org/2006/time#hasBeginning": {
            "@id": "_:b2"
          },
          "http://www.w3.org/2006/time#hasEnd": {
            "@id": "_:b1"
          }
        },
        {
          "@id": "_:b1",
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": {
            "@id": "http://www.w3.org/2006/time#Instant"
          },
          "http://www.w3.org/2006/time#inXSDDateTimeStamp": {
            "@type": "http://www.w3.org/2001/XMLSchema#dateTimeStamp",
            "@value": "${measurement.end.toISOString()}"
          }
        },
        {
          "@id": "_:b2",
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": {
            "@id": "http://www.w3.org/2006/time#Instant"
          },
          "http://www.w3.org/2006/time#inXSDDateTimeStamp": {
            "@type": "http://www.w3.org/2001/XMLSchema#dateTimeStamp",
            "@value": "${measurement.start.toISOString()}"
          }
        },
        {
          "@id": "_:b3",
          "iiot:hasResultValue": {
            "@type": "http://www.w3.org/2001/XMLSchema#int",
            "@value": "${measurement.maxLevel}"
          },
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
            {
              "@id": "InterIoT:LogVPmod#MaxSoundLevel"
            },
            {
              "@id": "sosa:Result"
            }
          ]
        },
        {
          "@id": "_:b4",
          "iiotex:hasLocalId": {
            "@type": "http://www.w3.org/2001/XMLSchema#int",
            "@value": "3178660"
          },
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
            {
              "@id": "sosa:Observation"
            },
            {
              "@id": "InterIoT:LogVPmod#SoundMeasurement"
            }
          ],
          "sosa:hasResult": [
            {
              "@id": "_:b5"
            },
            {
              "@id": "_:b3"
            },
            {
              "@id": "_:b6"
            }
          ],
          "sosa:madeBySensor": {
            "@id": "http://www.inter-iot.eu/wso2port/sound/cabins/${stationId}"
          },
          "sosa:phenomenonTime": {
            "@id": "_:b0"
          }
        },
        {
          "@id": "_:b5",
          "iiot:hasResultValue": {
            "@type": "http://www.w3.org/2001/XMLSchema#int",
            "@value": "${measurement.minLevel}"
          },
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
            {
              "@id": "InterIoT:LogVPmod#MinSoundLevel"
            },
            {
              "@id": "sosa:Result"
            }
          ]
        },
        {
          "@id": "_:b6",
          "iiot:hasResultValue": {
            "@type": "http://www.w3.org/2001/XMLSchema#int",
            "@value": "${measurement.avgLevel}"
          },
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
            {
              "@id": "InterIoT:LogVPmod#AvgSoundLevel"
            },
            {
              "@id": "sosa:Result"
            }
          ]
        },
        {
          "@id": "http://www.inter-iot.eu/wso2port/sound/cabins/${stationId}",
          "iiotex:hasLocalId": {
            "@type": "http://www.w3.org/2001/XMLSchema#int",
            "@value": "${stationId}"
          },
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
            {
              "@id": "InterIoT:LogVPmod#SoundCabin"
            },
            {
              "@id": "iiot:IoTDevice"
            },
            {
              "@id": "sosa:Sensor"
            }
          ]
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

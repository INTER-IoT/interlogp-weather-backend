/* eslint-disable global-require */
import fakeData from '../fake-data';

const generate = (stationId, size, date) => fakeData.generateNoatumWeatherMeasurements(size, `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`, `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)
  .map((measurement) => {
    measurement.date = new Date(date);
    measurement.messageDate = new Date(measurement.date);
    measurement.messageDate.setMinutes(measurement.date.getMinutes() + 5);
    return measurement;
  })
  .map(measurement => `[
    {
      "@graph": [
        {
          "@graph": [
            {
              "@id": "msg:meta/f8172d6e-50ad-4b17-9368-394967c647bd",
              "msg:SenderPlatformId": {
                "@id": "http://www.inter-iot.eu/nctv/seams2"
              },
              "msg:conversationID": "conva76952a3-bd07-4058-9c73-4da4dc8b0560",
              "msg:dateTimeStamp": "${measurement.messageDate.toISOString()}",
              "msg:messageID": "msg0d9ce8d4-0e8c-4424-8511-4075d4742571",
              "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
                {
                  "@id": "msg:Response"
                },
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
                "@id": "http://www.w3.org/2006/time#Instant"
              },
              "http://www.w3.org/2006/time#inPosition": {
                "@id": "_:b3"
              }
            },
            {
              "@id": "_:b1",
              "iiot:hasName": "WSM_S${stationId}",
              "iiotex:hasLocalId": "http://www.inter-iot.eu/nctv/seams2/WSM_S${stationId}",
              "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
                {
                  "@id": "sosa:Sensor"
                },
                {
                  "@id": "iiot:IoTDevice"
                },
                {
                  "@id": "InterIoT:SEAMS2mod#Device"
                }
              ]
            },
            {
              "@id": "_:b2",
              "iiot:hasResultValue": "${measurement.windSpeed}",
              "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
                {
                  "@id": "sosa:Result"
                },
                {
                  "@id": "InterIoT:SEAMS2mod#WindSpeed"
                }
              ]
            },
            {
              "@id": "_:b3",
              "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": {
                "@id": "http://www.w3.org/2006/time#TimePosition"
              },
              "http://www.w3.org/2006/time#nominalPosition": "${measurement.date.toISOString()}"
            },
            {
              "@id": "InterIoT:syntax/SEAMS2#_0",
              "InterIoT:SEAMS2mod#hasName": "WSM_S${stationId}",
              "InterIoT:SEAMS2mod#hasType": "MET",
              "InterIoT:SEAMS2mod#hasVersion": "1.0",
              "InterIoT:syntax/SEAMS2#hasFamily": "WSM",
              "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": {
                "@id": "sosa:Observation"
              },
              "sosa:hasResult": {
                "@id": "_:b2"
              },
              "sosa:madeBySensor": {
                "@id": "_:b1"
              },
              "sosa:phenomenonTime": {
                "@id": "_:b0"
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
    }
  ]`);

export default {
  generate,
};

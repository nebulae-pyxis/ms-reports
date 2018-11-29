// TEST LIBS
const assert = require("assert");
const uuidv4 = require("uuid/v4");
const expect = require("chai").expect;

const { take, mergeMap, map, tap,delay, toArray, reduce, concatMap, filter } = require("rxjs/operators");
const {forkJoin, of, interval, concat, from, observable, bindNodeCallback, defer, range } = require("rxjs");

//LIBS FOR TESTING
const MqttBroker = require("../bin/tools/broker/MqttBroker");
const MongoDB = require("../bin/data/MongoDB").MongoDB;

let BusinessDA = undefined;
let PosDA = undefined;



let mongoDB = undefined;
let broker = undefined;

// const dbName = `test-${uuidv4().toString().slice(0, 5)}-report`;
const dbName = `reports`;


const environment = {
  NODE_ENV: "production",
  BROKER_TYPE: "MQTT",
  REPLY_TIMEOUT: 2000,
  EMI_MATERIALIZED_VIEW_UPDATES_TOPIC : "emi-gateway-materialized-view-updates",
  MQTT_SERVER_URL: "mqtt://localhost:1883",
  MONGODB_URL: "mongodb://localhost:27017",
  MONGODB_DB_NAME: dbName,
  JWT_PUBLIC_KEY:
    "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAg4HWDCe7Ro6JzaX4/NQme1bmytli2MT3OkHks5Aq+2jmFYLx79p4NnzWpcG/Lc2BbBJfIEezCl/UMmgPDd9RIGGvonSmZYUx7cy0aZvDzxA1fIjczdQu5umFK5WrECDPgFri3X6O/tu6kF9hN683g822E1MRO4/47OvMfc/gEuCBwE+UWR0xqCFyskMd+qWYnMqiL/AZvthQrmhhmSn83n/e7eadh8oH3LRRfbrIPFF26FFhMrUUze/QwkUYcMPy8MMXs3SXFFEnSl3sz+gzwKphDwghPyFt5BZDcZOfMS3XHdhATmS3UlMPUOKuLNBEY9P8ocKsKO0F7ZHl0y4XRwIDAQAB\n-----END PUBLIC KEY-----",
  EVENT_STORE_BROKER_TYPE: "MQTT",
  EVENT_STORE_BROKER_EVENTS_TOPIC: "Events",
  EVENT_STORE_BROKER_URL: "mqtt://localhost:1883",
  EVENT_STORE_STORE_TYPE: "MONGO",
  EVENT_STORE_STORE_URL: "mongodb://localhost:27017",
  EVENT_STORE_STORE_AGGREGATES_DB_NAME: "Aggregates",
  EVENT_STORE_STORE_EVENTSTORE_DB_NAME: "EventStore",
};

/*
NOTES:
before run please start mongoDB:
  docker-compose up setup-rs

  remember to config /etc/hosts to resolve store-mongo1, store-mongo2, store-mongo3
    127.0.0.1 store-mongo1
    127.0.0.1 store-mongo2
    127.0.0.1 store-mongo3

*/

describe("BDD - MAIN TEST", function() {
  /*
  * PREAPARE
  */
  describe("Prepare test DB and backends", function() {
    it("start reports bacend- and its Database", function(done) {
      this.timeout(60000);
      Object.keys(environment).forEach(envKey => {
        process.env[envKey] = environment[envKey];
        console.log(`env var set => ${envKey}:${process.env[envKey]}`);
      });

      const eventSourcing = require("../bin/tools/EventSourcing")();
      const eventStoreService = require("../bin/services/event-store/EventStoreService")();
      BusinessDA = require("../bin/data/BusinessDA");     
      PosDA = require('../bin/data/PosDA');     
      mongoDB = require("../bin/data/MongoDB").singleton();

      of({})
        .pipe(
          mergeMap(() =>
            concat(
              eventSourcing.eventStore.start$(),
              eventStoreService.start$(),
              mongoDB.start$(),
              BusinessDA.start$(),
              PosDA.start$()
            )
          )
        )
        .subscribe( evt => console.log(evt),
          error => {
            console.error("Failed to start", error);
            //process.exit(1);
            return done(error);
          },
          () => {
            console.log("reports server started");
            return done();
          }
        );
    }),
      it("start MQTT broker", function(done) {
        broker = new MqttBroker({
          mqttServerUrl: process.env.MQTT_SERVER_URL,
          replyTimeout: process.env.REPLY_TIMEOUT || 2000
        });
        done();
      });
  });

  /*
  * CREATE BUSINESS UNITS
  */
  describe("Create the business units", function() {
    // busines list demo
    const businessList = [ 
        { _id: "123_Metro_med", name: "Metro de Medellin" },
        { _id: "123_Gana_Bog", name: "Gana de Bogota" },
        { _id: "123_Gana_Cal", name: "Gana de Cali" },
        { _id: "123_Gana_buc", name: "Gana de Bucaramanga" },
        { _id: "123_gana_Bel", name: "Gana de Bello" },
        { _id: "123_gana_Ita", name: "Gana de Itagui" }        
     ]; 

    it("Create the busines units", function(done) {
      from(businessList)
        .pipe(
          delay(20),
          // send the command to create the business
          mergeMap(bu =>
            broker.send$("Events", "", {
              et: "BusinessCreated",
              etv: 1,
              at: "Business",
              aid: bu._id,
              data: { generalInfo: bu, _id: bu._id },
              user: "juan.santa",
              timestamp: Date.now(),
              av: 164
            })
          ),
          toArray(),
          delay(1000)
        )
        .subscribe(
          evt => {},
          error => {
            console.error(`sent message failded ${error}`);
            return done(error);
          },
          () => done()
        );
    });

  });

  /**
   * generate the 100 walletSpendingCommits
   */
  describe("process 50 CivicaCardReload events and check results", function() {
    const businessList = [ 
        { _id: "123_Metro_med", name: "Metro de Medellin" },
        { _id: "123_Gana_Bog", name: "Gana de Bogota" },
        { _id: "123_Gana_Cal", name: "Gana de Cali" },
        { _id: "123_Gana_buc", name: "Gana de Bucaramanga" },
        { _id: "123_gana_Bel", name: "Gana de Bello" },
        { _id: "123_gana_Ita", name: "Gana de Itagui" }        
     ];
    let valuesInTest = [1250,24300,10850,15100,49300,46800,18750,21350,26600,8450,11850,45300,5400,44550,40200,44100,18500,2000,250,16650,21800,
      26200,47600,8750,37050,43050,34650,11500,44950,10150,3150,28100,13200,41200,1150,4500,46300,20650,37950,26350,36850,48300,8750,37250,16250,
      14950,36600,20150,41000,34150,34850,35750,6550,4650,39800,38300,49950,1700,24450,49750,19100,40850,35650,46400,48350,1450,17950,33500,33650,
      15450,49450,11900,27050,39950,37150,36450,20050,44150,3050,16350,46400,30500,45300,6450,28700,30350,26850,27450,40100,24250,1950,11700,41800,
      25100,32700,44300,44550,48900,45600,9300];

      /**
       * 
       * @param {coordinates} center 
       * @param {number} radius 
       */
      const GenerateRandomLocation = function(center, rMin, rMax){
        return [
            center[0] + Math.pow(-1, Math.floor( Math.random() * 2 )) * ( Math.random()*(rMax-rMin)+rMin),
            center[1] + Math.pow(-1, Math.floor( Math.random() * 2 )) * ( Math.random()*(rMax-rMin)+rMin)
        ];
      };

      const center = [6.2219034, -75.5804876];
      const radiusMin = 0.005;
      const radiusMax = 0.07;

      /**
       * 
       * @param {number} index 
       * @param {number} qty 
       * @param {string} businessId 
       * @param {number} delayTime 
       */
      const civicaCardReloadEventsEmitter = function(index, qty, delayTime = 0) {
        return range(index, qty).pipe(
          concatMap(i =>
            of(businessList[Math.floor(Math.random() * businessList.length)]._id).pipe(
              mergeMap((businessId) =>
                broker.send$("Events", "", {
                  et: "CivicaCardReload",
                  etv: 1,
                  at: "CivicaCard",
                  aid: uuidv4(),
                  data: {
                    businessId: businessId,
                    value: valuesInTest[0],
                    receipt : {
                        id: uuidv4(),
                        timestamp: Date.now(),
                        reloadValue: valuesInTest[0],
                        cardInitialValue: 0,
                        cardFinalValue: valuesInTest[0],
                        businesId: businessId,
                        posId: uuidv4(),
                        posUserName: 'Felipe',
                        posUserId: '123_felipe',
                        posTerminal: null
                    },
                    initialCard: {},
                    finalCard: {},
                    location: { type: "Point", coordinates: GenerateRandomLocation(center, radiusMin, radiusMax) }
                  },
                  user: "juan.santa",
                  timestamp: Date.now(),
                  av: 164
                })
              ),
              delay(delayTime)
            )
          )
        );
      };

      const logger = function(qty, delayTime) {
        return range(0, qty).pipe(
          concatMap(i =>
            of(i).pipe(
              tap(() => console.log(`${i} of ${qty}`)),
              delay(delayTime)
            )
          )
        );
      };

    it("process 50 CivicaCardReload", function(done) {
      this.timeout(7200000);

      const timesToSendEvent = 50;
      const delayToSendEachPackage = 200;
      // const valuesInTest_ = [...Array(100)].map(e => {
      //   const randomNumner = Math.floor(Math.random() * 50000);
      //   return randomNumner - (randomNumner % 50);
      // });
      // console.log(JSON.stringify(valuesInTest_));

      of({})
        .pipe(
          mergeMap(() =>
            concat(
              // commitsEmitter(0, 1, businessList[0]._id, delayToSendEachPackage),
              forkJoin(
                civicaCardReloadEventsEmitter(0, 
                    timesToSendEvent,
                    delayToSendEachPackage
                ),
                logger(timesToSendEvent, delayToSendEachPackage)
              )
            )
          ),
          toArray()          
        )
        .subscribe(
          () => console.log( "##### 50 CIVICA_CARD_RELOAD EVENTS SENT" ),
          error => {
            console.log(error);
            return done(error);
          },
          () => done()
        );
    });
  });

  /**
   * wait for all transactions
   * 
   * to calculate the expected transactions, final pocket status use the following python code
   * http://tpcg.io/VmDyYR

   */
//   describe("Wait for all transactions and check the wallet pockects", function() {
//     const businessList = [
//       { _id: "123456789_Metro_med", name: "Metro de Medellin" }
//     ];
//     const date = new Date();
//     let month = date.getMonth() + 1;
//     let year = date.getFullYear() + "";
//     month = (month.length == 1 ? "0" : "") + month;
//     year = year.substr(year.length - 2);

//     it("WAIT FOR THE EXPECTED TRANSACTIONS", function(done) {
//       let count = 0;
//       let tickCounts = 0;
//       const limitTicks = 10;
//       const expectedTransactions = 100;
//       this.timeout(7200000);
//       const collection = mongoDB.client
//         .db(dbName)
//         .collection(`TransactionsHistory_${month}${year}`);
//       interval(1000)
//         .pipe(
//           tap(() => {
//             console.log("Waiting for all transactions creation...", count)
//             console.log(`${tickCounts} try of ${limitTicks} `)
//           }),
//           mergeMap(() => defer(() => collection.count())),
//           filter(c => {
//             count = c;
//             tickCounts++;
//             return (count >= expectedTransactions || tickCounts >= limitTicks);
//           }),
//           take(1),
//           tap((totalTransactions) => {
//             expect(totalTransactions).to.be.equal(expectedTransactions)
//           } ),
//           delay(3000),
//           mergeMap(() => WalletDA.getWallet$(businessList[0]._id)),
//           tap(walletObj => {
//             expect({ ...walletObj, _id: 0,  }).to.be.deep.equal({
//               _id: 0,
//               businessId: businessList[0]._id,
//               businessName: businessList[0].name,
//               spendingState: 'FORBIDDEN',
//               pockets: {
//                 main: -2729950,
//                 bonus: 0
//               }
//             })
//           })
          
//         )
//         .subscribe(
//           finalWallet => console.log( "FINAL WALLET STATE IS  ==> ", JSON.stringify(finalWallet) ),
//           error => {
//             console.log(error);
//             return done(error);
//           },
//           () => done()
//         );
//     });
//   });

  /*
  * DE-PREAPARE
  */

    // describe("de-prepare test DB", function () {
    //     it("delete mongoDB", function (done) {
    //         this.timeout(8000);
    //         of({})
    //             .pipe(
    //                 delay(5000),
    //                 mergeMap(() => mongoDB.dropDB$())
    //             )
    //             .subscribe(
    //                 evt => console.log(`${evt}`),
    //                 error => {
    //                     console.error(`Mongo DropDB failed: ${error}`);
    //                     return done(error);
    //                 },
    //                 () => {
    //                     return done();
    //                 }
    //             );
    //     });
    //     it("stop mongo", function (done) {
    //         this.timeout(4000);
    //         of({})
    //             .pipe(
    //                 delay(1000),
    //                 mergeMap(() => mongoDB.stop$())
    //             )
    //             .subscribe(
    //                 evt => console.log(`Mongo Stop: ${evt}`),
    //                 error => {
    //                     console.error(`Mongo Stop failed: ${error}`);
    //                     return done(error);
    //                 },
    //                 () => {
    //                     return done();
    //                 }
    //             );
    //     });
    // });

});

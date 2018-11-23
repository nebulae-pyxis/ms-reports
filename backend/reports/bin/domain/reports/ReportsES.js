const Rx = require("rxjs");
const { take, mergeMap, tap, catchError, map } = require('rxjs/operators');
const HelloWorldDA = require('../../data/HelloWorldDA');
const broker = require("../../tools/broker/BrokerFactory")();
const MATERIALIZED_VIEW_TOPIC = process.env.EMI_MATERIALIZED_VIEW_UPDATES_TOPIC;

const  { forkJoin, of, interval } = require('rxjs');

let instance;

class ReportsES {
  constructor() {
    this.initHelloWorldEventGenerator();
  }

  /**
   * Handle HelloWorld Query, please remove
   * This in an Event HAndler for Event- events
   */
  handleHelloWorld$(evt) {
    return Rx.of('Some process for HelloWorld event').pipe(
        catchError(error => this.errorHandler$(error))
    )
  }

  handleCivicaCardReload$(evt){
    return of(evt).pipe(
      catchError(error => this.errorHandler$(error))
    )
  }

    errorHandler$(error, event) {
        return Rx.Observable.of({ error, event }).mergeMap(log =>
            LogErrorDA.persistAccumulatedTransactionsError$(log)
        );
    }

    initHelloWorldEventGenerator(){
        interval(1000).pipe(
          take(120),
          mergeMap(id =>  HelloWorldDA.getHelloWorld$())    ,
          mergeMap(evt => {
            return broker.send$(MATERIALIZED_VIEW_TOPIC, 'reportsHelloWorldEvent',evt);
          })
        )
        .subscribe(
          (evt) => console.log('emi-gateway GraphQL sample event sent, please remove'),
          (err) => { 
            console.log(err);
            console.error('emi-gateway GraphQL sample event sent ERROR, please remove')
          },
          () => console.log('emi-gateway GraphQL sample event sending STOPPED, please remove'),
        );
      }
}

/**
 * 
 * @returns {ReportsES}
 */
module.exports = () => {
  if (!instance) {
    instance = new ReportsES();
    console.log("SettlementES Singleton created");
  }
  return instance;
};

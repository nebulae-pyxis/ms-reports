const Rx = require("rxjs");
const { take, mergeMap, tap, catchError, map } = require('rxjs/operators');
const PosDA = require('../../data/PosDA');
const BusinessDA = require('../../data/BusinessDA');
const broker = require("../../tools/broker/BrokerFactory")();
const MATERIALIZED_VIEW_TOPIC = process.env.EMI_MATERIALIZED_VIEW_UPDATES_TOPIC;
const Helper = require('./PosCoverageReportHelper');

const  { forkJoin, of, interval } = require('rxjs');

/**
 * to send msg to susbcritio 
 * broker.send$(MATERIALIZED_VIEW_TOPIC, 'reportsHelloWorldEvent', evt);
 */

let instance;

class ReportsES {
  constructor() {
  }

 

  handleCivicaCardReload$(evt){
    return of(evt)    
    .pipe(
      mergeMap(evt => Helper.extractPosInfoFromCivicaCadReloadEvt(evt)),
      mergeMap(posData => forkJoin(
        PosDA.insertPosInfo$(posData),
        BusinessDA.pushProduct$(posData.businessId, posData.products)
      )),
      catchError(error => this.errorHandler$(error))
    )
  }

    errorHandler$(error, event) {
        return Rx.Observable.of({ error, event }).mergeMap(log =>
            LogErrorDA.persistAccumulatedTransactionsError$(log)
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

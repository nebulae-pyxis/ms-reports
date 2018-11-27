const Rx = require("rxjs");
const BusinessDA = require("../../data/BusinessDA");
const { mergeMap } = require('rxjs/operators');
const { of } = require('rxjs');

let instance;

class BusinessES {
  constructor() {
  }

  /**
   * Persists the business on the materialized view according to the received data from the event store.
   * @param {*} businessCreatedEvent business created event
   */
  handleBusinessCreated$(businessCreatedEvent) {
    console.log("Se ha creado una unidad de negocio", JSON.stringify(businessCreatedEvent));
    return of(businessCreatedEvent)
    .pipe(
      mergeMap( business => BusinessDA.persistBusiness$(business.data) )
    )
  }

  /**
   * updates the business general info on the materialized view according to the received data from the event store.
   * @param {*} evt business general info updated event
   */
  handleBusinessGeneralInfoUpdated$(evt) {
    return of(evt.data)
      .pipe(
        mergeMap(businessUpdated => BusinessDA.updateBusinessGeneralInfo$( evt.aid, businessUpdated )
      ));
  }

  /**
   * Handles and persist the errors generated while a settlementJobTriggered was being processed.
   * @param {*} error Error
   * @param {*} event settlementJobTriggered event
   */
  errorHandler$(error, event) {
    return Rx.Observable.of({ error, event }).mergeMap(log =>
      LogErrorDA.persistAccumulatedTransactionsError$(log)
    );
  }
}

/**
 * Business event consumer
 * @returns {BusinessES}
 */
module.exports = () => {
  if (!instance) {
    instance = new BusinessES();
    console.log("SettlementES Singleton created");
  }
  return instance;
};

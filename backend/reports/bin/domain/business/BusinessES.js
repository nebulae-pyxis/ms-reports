const Rx = require("rxjs");
const BusinessDA = require("../../data/BusinessDA");
const { mergeMap } = require('rxjs/operators');
const { of, forkJoin } = require('rxjs');
const BusinessDashboardReportsDA = require('../../data/BusinessDashboardReportsDA');
const gregorian = require('weeknumber');

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
        mergeMap(business => BusinessDA.persistBusiness$(business.data))
      )
  }


  /**
   * updates the business general info on the materialized view according to the received data from the event store.
   * @param {*} evt business general info updated event
   */
  handleBusinessGeneralInfoUpdated$(evt) {
    return of(evt.data)
      .pipe(
        mergeMap(businessUpdated => BusinessDA.updateBusinessGeneralInfo$(evt.aid, businessUpdated)
        ));
  }

  /**
   * updates business active flag
   * @param {Event} event 
   */
  handleBusinessActivatedEvent$(event) {
    return BusinessDA.updateBusinessActive$(event.aid, true);
  }

  /**
   * updates business active flag
   * @param {Event} event 
   */
  handleBusinessDeactivatedEvent$(event) {
    return BusinessDA.updateBusinessActive$(event.aid, false);
  }

  /**
   * updates business state
   * @param {Event} event 
   */
  handleWalletSpendingForbiddenEvent$(event) {
    const data = event.data;
    return BusinessDA.updateBusinessWallet$(data.businessId, data.wallet, false);
  }

  /**
   * updates business state
   * @param {Event} event 
   */
  handleWalletSpendingAllowedEvent$(event) {
    const data = event.data;
    return BusinessDA.updateBusinessWallet$(data.businessId, data.wallet, true);
  }

  /**
   * updates business state
   * @param {Event} event 
   */
  handleWalletUpdatedEvent$(event) {
    const data = event.data;
    const businessId = data.businessId;
    const fieldsToSet = [['lastUpdate', Date.now()], ['pocket.bonus.current', data.pockets.bonus], ['pocket.main.current', data.pockets.main]];
    const fieldsToInc = [];
    const { year, monthStr, month, week, dayOfWeek, dayOfWeekStr, dayOfYear, dayOfMonth, hourOfDay, minute, second } = this.decomposeTime(event.timestamp);

    return forkJoin(
      BusinessDA.updateBusinessWallet$(data.businessId, { bonus: data.pockets.bonus, main: data.pockets.main }, data.spendingState === 'ALLOWED'),
      BusinessDashboardReportsDA.updateTimeBox$(
        [['businessId', businessId], ['timespanType', 'YEAR'], ['YEAR', year]],
        fieldsToSet, fieldsToInc),
      BusinessDashboardReportsDA.updateTimeBox$(
        [['businessId', businessId], ['timespanType', 'MONTH'], ['YEAR', year], ['MONTH', month]],
        fieldsToSet, fieldsToInc,
        [['MONTH_NAME', monthStr]]),
      BusinessDashboardReportsDA.updateTimeBox$(
        [['businessId', businessId], ['timespanType', 'WEEK'], ['YEAR', year], ['MONTH', month], ['WEEK', week]],
        fieldsToSet, fieldsToInc),
      BusinessDashboardReportsDA.updateTimeBox$(
        [['businessId', businessId], ['timespanType', 'DAY'], ['YEAR', year], ['MONTH', month], ['DAY', dayOfMonth]],
        fieldsToSet, fieldsToInc,
        [['WEEK', week], ['DAY_OF_YEAR', dayOfYear], ['DAY_NAME', dayOfWeekStr], ['DAY_OF_WEEK', dayOfWeek]]),
    )

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

  decomposeTime(ts) {
    //2018-12-4 17:12:05
    const date = new Date(new Date(ts).toLocaleString('es-CO', { timeZone: 'America/Bogota' }));
    const { year, week, day } = gregorian.weekNumberYear(date);
    const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRY', 'SAT', 'SUN'];
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',];
    return {
      year,
      monthStr: months[date.getMonth()],
      month: date.getMonth() + 1,
      week,
      dayOfWeek: day,
      dayOfWeekStr: daysOfWeek[day - 1],
      dayOfYear: gregorian.dayOfYear(date),
      dayOfMonth: date.getDate(),
      hourOfDay: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds()
    };
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

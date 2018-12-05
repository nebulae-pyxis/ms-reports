'use strict'

const gregorian = require('weeknumber');
const Rx = require("rxjs");
const { tap, mergeMap, catchError, map, mapTo } = require('rxjs/operators');
const GraphqlResponseTools = require('../../tools/GraphqlResponseTools');
const BusinessDashboardReportsDA = require('../../data/BusinessDashboardReportsDA');



/**
 * Singleton instance
 */
let instance;

class BusinessReportDashboardES {

    constructor() {
        this.counter = 0;
    }


    handleWalletTransactionExecutedEvt$({ et, etv, at, aid, user, timestamp, av, data }) {
        const { businessId, transactionType, transactionConcept, transactions } = data;
        if (transactionType !== 'SALE') {
            return Rx.empty();
        }
        const { year, monthStr, month, week, dayOfWeek, dayOfWeekStr, dayOfYear, dayOfMonth, hourOfDay, minute, second } = this.decomposeTime(timestamp);

        const fieldsToSet = [['lastUpdate', Date.now()]];
        const fieldsToInc = [];
        const [tx1, tx2] = transactions;


        fieldsToInc.push([`sales.count`, 1]);
        fieldsToInc.push([`sales.sum`, Math.abs(tx1.value)]);
        fieldsToInc.push([`sales.pocket.${tx1.pocketAlias ? tx1.pocketAlias : tx1.pocket}.count`, 1]);
        fieldsToInc.push([`sales.pocket.${tx1.pocketAlias ? tx1.pocketAlias : tx1.pocket}.sum`, Math.abs(tx1.value)]);

        if (tx1 && tx1.pocket === 'MAIN') {
            fieldsToInc.push([`sales.product.${transactionConcept}.count`, 1]);
            fieldsToInc.push([`sales.product.${transactionConcept}.sum`, Math.abs(tx1.value)]);
        }

        if (tx2 && tx2.pocket === 'BONUS') {
            fieldsToInc.push(['bonus.input.count', 1]);
            fieldsToInc.push(['bonus.input.sum', Math.abs(tx2.value)]);
            fieldsToInc.push([`bonus.product.${transactionConcept}.count`, 1]);
            fieldsToInc.push([`bonus.product.${transactionConcept}.sum`, Math.abs(tx2.value)]);

        }



        return Rx.forkJoin(
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
        ).pipe(

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
 * @returns {BusinessReportDashboardES}
 */
module.exports = () => {
    if (!instance) {
        instance = new BusinessReportDashboardES();
        console.log(`${instance.constructor.name} Singleton created`);
    }
    return instance;
};
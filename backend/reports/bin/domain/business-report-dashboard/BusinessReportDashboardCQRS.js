'use strict'

const Rx = require("rxjs");
const { tap, mergeMap, catchError, map, mapTo, reduce, toArray } = require('rxjs/operators');
const GraphqlResponseTools = require('../../tools/GraphqlResponseTools');
const BusinessDashboardReportsDA = require('../../data/BusinessDashboardReportsDA');
const BusinessDA = require('../../data/BusinessDA');



/**
 * Singleton instance
 */
let instance;

class BusinessReportDashboardCQRS {

    constructor() {
    }

    /**
     * retrieves Business-Report-Dashboard Bonus-Line-Chart
     */
    queryBusinessReportDashboardBonusLineChartTimeDataset$({ root, args, jwt }, authToken) {

        return Rx.forkJoin(
            BusinessDashboardReportsDA.findTimeBox$(
                [['businessId', args.businessId], ['timespanType', 'YEAR']], 3
            ).pipe(
                mergeMap(years => Rx.from(years).pipe(
                    mergeMap(year => BusinessDashboardReportsDA.findTimeBox$([['businessId', args.businessId], ['timespanType', 'MONTH'], ['YEAR', year.YEAR]], 12).pipe(
                        mergeMap(months => Rx.from(months).pipe(
                            map(({ MONTH, MONTH_NAME, bonus }) => ({ pos: (MONTH - 1), label: MONTH_NAME, value: (bonus && bonus.input) ? bonus.input.sum : 0 })),
                            map(data => { data.value = data.value / 1000; data.value = data.value.toFixed(1); return data; }),
                            reduce((acc, { pos, value }) => { acc[pos] = value; return acc; }, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                            map(data => ({ order: year.YEAR, label: year.YEAR.toString(), data }))
                        ))
                    )),
                    toArray(),
                    map(datasets => ({ timespan: 'YEAR', order: 3, scale: 'THOUSANDS', labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'], datasets }))
                )),
            ),


            BusinessDashboardReportsDA.findTimeBox$(
                [['businessId', args.businessId], ['timespanType', 'MONTH']], 3
            ).pipe(
                mergeMap(months => Rx.from(months).pipe(
                    mergeMap(month => BusinessDashboardReportsDA.findTimeBox$([['businessId', args.businessId], ['timespanType', 'DAY'], ['MONTH', month.MONTH]], 31).pipe(
                        mergeMap(days => Rx.from(days).pipe(
                            map(({ DAY, DAY_NAME, bonus }) => ({ pos: (DAY - 1), label: DAY_NAME, value: (bonus && bonus.input) ? bonus.input.sum : 0 })),
                            map(data => { data.value = data.value / 1000; data.value = data.value.toFixed(1); return data; }),
                            reduce((acc, { pos, value }) => { acc[pos] = value; return acc; }, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                            map(data => ({ order: month.MONTH, label: month.MONTH_NAME.toString(), data }))
                        ))
                    )),
                    toArray(),
                    map(datasets => ({ timespan: 'MONTH', order: 2, scale: 'THOUSANDS', labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'], datasets }))
                )),
            ),


            BusinessDashboardReportsDA.findTimeBox$(
                [['businessId', args.businessId], ['timespanType', 'WEEK']], 3
            ).pipe(
                mergeMap(weeks => Rx.from(weeks).pipe(
                    mergeMap(week => BusinessDashboardReportsDA.findTimeBox$([['businessId', args.businessId], ['timespanType', 'DAY'], ['WEEK', week.WEEK]], 7).pipe(
                        mergeMap(days => Rx.from(days).pipe(
                            map(({ DAY_OF_WEEK, DAY_NAME, bonus }) => ({ pos: (DAY_OF_WEEK - 1), label: DAY_NAME, value: (bonus && bonus.input) ? bonus.input.sum : 0 })),
                            map(data => { data.value = data.value / 1000; data.value = data.value.toFixed(1); return data; }),
                            reduce((acc, { pos, value }) => { acc[pos] = value; return acc; }, [0, 0, 0, 0, 0, 0, 0]),
                            map(data => ({ order: week.WEEK, label: week.WEEK.toString(), data }))
                        ))
                    )),
                    toArray(),
                    map(datasets => ({ timespan: 'WEEK', order: 1, scale: 'THOUSANDS', labels: ['MON', 'TUE', 'WED', 'THU', 'FRY', 'SAT', 'SUN'], datasets }))
                )),
            ),

        ).pipe(
            //tap(x => console.log(JSON.stringify(x))),
            mergeMap(rawResponse => GraphqlResponseTools.buildSuccessResponse$(rawResponse)),
            catchError(error => {
                this.logError(error);
                return GraphqlResponseTools.handleError$(error);
            })
        );
    }
    /**
     * retrieves Business-Report-Dashboard Net-Bonus-Distribution
     */
    queryBusinessReportDashboardNetBonusDistribution$({ root, args, jwt }, authToken) {


        return Rx.forkJoin(
            BusinessDashboardReportsDA.findTimeBox$([['businessId', args.businessId], ['timespanType', 'YEAR']], 3).pipe(
                mergeMap(years => Rx.from(years).pipe(
                    mergeMap(year => Rx.from(Object.keys(year.bonus.product)).pipe(
                        map(product => ({ product, percentage: year.bonus.product[product].sum, value: year.bonus.product[product].sum, count: year.bonus.product[product].count })),
                        toArray(),
                        map(dataset => ({ timespan: year.YEAR.toString(), dataset }))
                    )),
                    toArray(),
                    map(datasets => ({ timespan: 'YEAR', datasets }))
                ),
                )),
            BusinessDashboardReportsDA.findTimeBox$([['businessId', args.businessId], ['timespanType', 'MONTH']], 3).pipe(
                mergeMap(months => Rx.from(months).pipe(
                    mergeMap(month => Rx.from(Object.keys(month.bonus.product)).pipe(
                        map(product => ({ product, percentage: month.bonus.product[product].sum, value: month.bonus.product[product].sum, count: month.bonus.product[product].count })),
                        toArray(),
                        map(dataset => ({ timespan: month.MONTH_NAME.toString(), dataset }))
                    )),
                    toArray(),
                    map(datasets => ({ timespan: 'MONTH', datasets }))
                )
                )),
            BusinessDashboardReportsDA.findTimeBox$([['businessId', args.businessId], ['timespanType', 'WEEK']], 3).pipe(
                mergeMap(weeks => Rx.from(weeks).pipe(
                    mergeMap(week => Rx.from(Object.keys(week.bonus.product)).pipe(
                        map(product => ({ product, percentage: week.bonus.product[product].sum, value: week.bonus.product[product].sum, count: week.bonus.product[product].count })),
                        toArray(),
                        map(dataset => ({ timespan: week.WEEK.toString(), dataset }))
                    )),
                    toArray(),
                    map(datasets => ({ timespan: 'WEEK', datasets }))
                )
                )),
        ).pipe(
            mergeMap(rawResponse => GraphqlResponseTools.buildSuccessResponse$(rawResponse)),
            catchError(error => {
                this.logError(error);
                return GraphqlResponseTools.handleError$(error);
            })
        );

    }


    /**
     * retrieves Business-Report-Dashboard Net-Sales-Distribution
     */
    queryBusinessReportDashboardNetSalesDistribution$({ root, args, jwt }, authToken) {

        return Rx.forkJoin(
            BusinessDashboardReportsDA.findTimeBox$([['businessId', args.businessId], ['timespanType', 'YEAR']], 3).pipe(
                mergeMap(years => Rx.from(years).pipe(
                    mergeMap(year => Rx.from(Object.keys(year.sales.product)).pipe(
                        map(product => ({ product, percentage: year.sales.product[product].sum, value: year.sales.product[product].sum, count: year.sales.product[product].count })),
                        toArray(),
                        map(dataset => ({ timespan: year.YEAR.toString(), dataset }))
                    )),
                    toArray(),
                    map(datasets => ({ timespan: 'YEAR', datasets }))
                ),
                )),
            BusinessDashboardReportsDA.findTimeBox$([['businessId', args.businessId], ['timespanType', 'MONTH']], 3).pipe(
                mergeMap(months => Rx.from(months).pipe(
                    mergeMap(month => Rx.from(Object.keys(month.sales.product)).pipe(
                        map(product => ({ product, percentage: month.sales.product[product].sum, value: month.sales.product[product].sum, count: month.sales.product[product].count })),
                        toArray(),
                        map(dataset => ({ timespan: month.MONTH_NAME.toString(), dataset }))
                    )),
                    toArray(),
                    map(datasets => ({ timespan: 'MONTH', datasets }))
                )
                )),
            BusinessDashboardReportsDA.findTimeBox$([['businessId', args.businessId], ['timespanType', 'WEEK']], 3).pipe(
                mergeMap(weeks => Rx.from(weeks).pipe(
                    mergeMap(week => Rx.from(Object.keys(week.sales.product)).pipe(
                        map(product => ({ product, percentage: week.sales.product[product].sum, value: week.sales.product[product].sum, count: week.sales.product[product].count })),
                        toArray(),
                        map(dataset => ({ timespan: week.WEEK.toString(), dataset }))
                    )),
                    toArray(),
                    map(datasets => ({ timespan: 'WEEK', datasets }))
                )
                )),
        ).pipe(            
            mergeMap(rawResponse => GraphqlResponseTools.buildSuccessResponse$(rawResponse)),
            catchError(error => {
                this.logError(error);
                return GraphqlResponseTools.handleError$(error);
            })
        );
    }




    /**
     * retrieves Business-Report-Dashboard Sales-Overview
     */
    queryBusinessReportDashboardSalesOverview$({ root, args, jwt }, authToken) {
        return Rx.of(
            [
                {
                    timespan: "YEAR", datasets: [
                        { timespan: '2017', scale: '---', labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'], datasets: { mainSales: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], bonusSales: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], creditSales: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], mainBalance: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], bonusBalance: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], salesQty: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], bonusQty: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], }, },
                        { timespan: '2016', scale: '---', labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'], datasets: { mainSales: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], bonusSales: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], creditSales: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], mainBalance: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], bonusBalance: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], salesQty: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], bonusQty: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], }, },
                        { timespan: '2015', scale: '---', labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'], datasets: { mainSales: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], bonusSales: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], creditSales: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], mainBalance: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], bonusBalance: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], salesQty: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], bonusQty: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], }, }
                    ],
                },
                {
                    timespan: "MONTH", datasets: [
                        { timespan: 'FEB', scale: '---', labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'], datasets: { mainSales: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], bonusSales: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], creditSales: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], mainBalance: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], bonusBalance: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], salesQty: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], bonusQty: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], }, },
                        { timespan: 'MAR', scale: '---', labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'], datasets: { mainSales: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], bonusSales: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], creditSales: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], mainBalance: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], bonusBalance: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], salesQty: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], bonusQty: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], }, },
                        { timespan: 'JUN', scale: '---', labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'], datasets: { mainSales: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], bonusSales: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], creditSales: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], mainBalance: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], bonusBalance: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], salesQty: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], bonusQty: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], }, },
                    ],
                },
                {
                    timespan: "WEEK", datasets: [
                        { timespan: '2 WEEKS AGO', scale: '---', labels: ['MON', 'TUE', 'WED', 'THU', 'FRY', 'SAT', 'SUN'], datasets: { mainSales: [0, 0, 0, 0, 0, 0, 0], bonusSales: [0, 0, 0, 0, 0, 0, 0], creditSales: [0, 0, 0, 0, 0, 0, 0], mainBalance: [0, 0, 0, 0, 0, 0, 0], bonusBalance: [0, 0, 0, 0, 0, 0, 0], salesQty: [0, 0, 0, 0, 0, 0, 0], bonusQty: [0, 0, 0, 0, 0, 0, 0], }, },
                        { timespan: 'PAST', scale: '---', labels: ['MON', 'TUE', 'WED', 'THU', 'FRY', 'SAT', 'SUN'], datasets: { mainSales: [0, 0, 0, 0, 0, 0, 0], bonusSales: [0, 0, 0, 0, 0, 0, 0], creditSales: [0, 0, 0, 0, 0, 0, 0], mainBalance: [0, 0, 0, 0, 0, 0, 0], bonusBalance: [0, 0, 0, 0, 0, 0, 0], salesQty: [0, 0, 0, 0, 0, 0, 0], bonusQty: [0, 0, 0, 0, 0, 0, 0], }, },
                        { timespan: 'CURRENT', scale: '---', labels: ['MON', 'TUE', 'WED', 'THU', 'FRY', 'SAT', 'SUN'], datasets: { mainSales: [1, 6, 3, 2, 6, 8, 2], bonusSales: [5, 3, 8, 0, 4, 3, 2], creditSales: [7, 3, 2, 6, 8, 4, 1], mainBalance: [4, 5, 6, 7, 6, 5, 4], bonusBalance: [4, 5, 6, 7, 8, 9, 0], salesQty: [1, 6, 2, 5, 3, 4, 2], bonusQty: [7, 3, 2, 5, 7, 2, 3], }, },
                    ],
                },
            ]
        ).pipe(
            mergeMap(rawResponse => GraphqlResponseTools.buildSuccessResponse$(rawResponse)),
            catchError(error => {
                this.logError(error);
                return GraphqlResponseTools.handleError$(error);
            })
        );
    }



    /**
     * retrieves Business-Report Wallet-Status-Cards
     */
    queryBusinessReportDashboardWalletStatusCards$({ root, args, jwt }, authToken) {

        return BusinessDA.getBusiness$(args.businessId).pipe(
            map(business => {
                const mainBalance = !business.wallet ? 0 : !business.wallet.pockets ? 0 : business.wallet.pockets.main ? business.wallet.pockets.main : business.wallet.pockets.balance;
                return {
                    spendingAllowed: !business.wallet ? false : business.wallet.spendingAllowed,
                    pockets: [
                        {
                            order: 1,
                            name: 'Bolsa',
                            balance: mainBalance < 0 ? 0 : mainBalance,
                            lastUpdate: business.lastUpdate,
                            currency: 'PESOS',
                        },
                        {
                            order: 2,
                            name: 'Comisiones',
                            balance:  !business.wallet ? 0 : !business.wallet.pockets ? 0 : business.wallet.pockets.bonus,
                            lastUpdate: business.lastUpdate,
                            currency: 'PESOS',
                        },
                        {
                            order: 3,
                            name: 'Credito',
                            balance: mainBalance < 0 ? Math.abs(mainBalance) : 0,
                            lastUpdate: business.lastUpdate,
                            currency: 'PESOS',
                        },
                    ]
                }
            }),
            mergeMap(rawResponse => GraphqlResponseTools.buildSuccessResponse$(rawResponse)),
            catchError(error => {
                tap(x => console.log(JSON.stringify(x))),
                this.logError(error);
                return GraphqlResponseTools.handleError$(error);
            })
        );

    }




    /**
     * Logs an error at the console.error printing only the message and the stack related to the project source code
     * @param {Error} error 
     */
    logError(error) {
        if (!error.stack) {
            console.error(error);
        }
        const stackLines = error.stack.split('\n');
        console.error(
            stackLines[0] + '\n' + stackLines.filter(line => line.includes('civica-card/bin')).join('\n') + '\n'
        );
    }





}



/**
 * @returns {BusinessReportDashboardCQRS}
 */
module.exports = () => {
    if (!instance) {
        instance = new BusinessReportDashboardCQRS();
        console.log(`${instance.constructor.name} Singleton created`);
    }
    return instance;
};
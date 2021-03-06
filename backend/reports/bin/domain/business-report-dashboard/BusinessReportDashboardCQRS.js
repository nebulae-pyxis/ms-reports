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
                            //map(data => { data.value = data.value / 100; data.value = parseFloat(data.value.toFixed(1)); return data; }),
                            map(({pos, label, value}) => ({pos, label, value : Math.round(value)})),
                            reduce((acc, { pos, value }) => { acc[pos] = value; return acc; }, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                            map(data => ({ order: year.YEAR, label: year.YEAR.toString(), data }))
                        ))
                    )),
                    toArray(),
                    map(datasets => ({ timespan: 'YEAR', order: 3, scale: 'UNIT', labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'], datasets }))
                )),
            ),


            BusinessDashboardReportsDA.findTimeBox$(
                [['businessId', args.businessId], ['timespanType', 'MONTH']], 3
            ).pipe(
                mergeMap(months => Rx.from(months).pipe(
                    mergeMap(month => BusinessDashboardReportsDA.findTimeBox$([['businessId', args.businessId], ['timespanType', 'DAY'], ['MONTH', month.MONTH]], 31).pipe(
                        mergeMap(days => Rx.from(days).pipe(
                            map(({ DAY, DAY_NAME, bonus }) => ({ pos: (DAY - 1), label: DAY_NAME, value: (bonus && bonus.input) ? bonus.input.sum : 0 })),
                            // map(data => { data.value = data.value / 100; data.value = parseFloat(data.value.toFixed(1)); return data; }),
                            map(({pos, label, value}) => ({pos, label, value : Math.round(value)})),
                            reduce((acc, { pos, value }) => { acc[pos] = value; return acc; }, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                            map(data => ({ order: month.MONTH, label: month.MONTH_NAME.toString(), data }))
                        ))
                    )),
                    toArray(),
                    map(datasets => ({ timespan: 'MONTH', order: 2, scale: 'UNIT', labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'], datasets }))
                )),
            ),


            BusinessDashboardReportsDA.findTimeBox$(
                [['businessId', args.businessId], ['timespanType', 'WEEK']], 3
            ).pipe(
                mergeMap(weeks => Rx.from(weeks).pipe(
                    mergeMap(week => BusinessDashboardReportsDA.findTimeBox$([['businessId', args.businessId], ['timespanType', 'DAY'], ['WEEK', week.WEEK]], 7).pipe(
                        mergeMap(days => Rx.from(days).pipe(
                            map(({ DAY_OF_WEEK, DAY_NAME, bonus }) => ({ pos: (DAY_OF_WEEK - 1), label: DAY_NAME, value: (bonus && bonus.input) ? bonus.input.sum : 0 })),
                            //map(data => { data.value = data.value / 100; data.value = parseFloat(data.value.toFixed(1)); return data; }),
                            map(({pos, label, value}) => ({pos, label, value : Math.round(value)})),
                            reduce((acc, { pos, value }) => { acc[pos] = value; return acc; }, [0, 0, 0, 0, 0, 0, 0]),
                            map(data => ({ order: week.WEEK, label: week.WEEK.toString(), data }))
                        ))
                    )),
                    toArray(),
                    map(datasets => ({ timespan: 'WEEK', order: 1, scale: 'UNIT', labels: ['MON', 'TUE', 'WED', 'THU', 'FRY', 'SAT', 'SUN'], datasets }))
                )),
            ),

        ).pipe(
            tap(x => console.log(`queryBusinessReportDashboardBonusLineChartTimeDataset: ${JSON.stringify(x)}\n`)),
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
                        map(product => ({ product, percentage: Math.round(year.bonus.product[product].sum), value: Math.round(year.bonus.product[product].sum), count: year.bonus.product[product].count })),
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
                        map(product => ({ product, percentage: Math.round(month.bonus.product[product].sum), value: Math.round(month.bonus.product[product].sum), count: month.bonus.product[product].count })),
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
                        map(product => ({ product, percentage: Math.round(week.bonus.product[product].sum), value: Math.round(week.bonus.product[product].sum), count: week.bonus.product[product].count })),
                        toArray(),
                        map(dataset => ({ timespan: week.WEEK.toString(), dataset }))
                    )),
                    toArray(),
                    map(datasets => ({ timespan: 'WEEK', datasets }))
                )
                )),
        ).pipe(
            tap(x => console.log(`queryBusinessReportDashboardNetBonusDistribution: ${JSON.stringify(x)}\n`)),
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
                        map(product => ({ product, percentage: Math.round(year.sales.product[product].sum), value: Math.round(year.sales.product[product].sum), count: year.sales.product[product].count })),
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
                        map(product => ({ product, percentage: Math.round(month.sales.product[product].sum), value: Math.round(month.sales.product[product].sum), count: month.sales.product[product].count })),
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
                        map(product => ({ product, percentage: Math.round(week.sales.product[product].sum), value: Math.round(week.sales.product[product].sum), count: week.sales.product[product].count })),
                        toArray(),
                        map(dataset => ({ timespan: week.WEEK.toString(), dataset }))
                    )),
                    toArray(),
                    map(datasets => ({ timespan: 'WEEK', datasets }))
                )
                )),
        ).pipe(
            tap(x => console.log(`queryBusinessReportDashboardNetSalesDistribution: ${JSON.stringify(x)}\n`)),
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
        return Rx.forkJoin(

            BusinessDashboardReportsDA.findTimeBox$([['businessId', args.businessId], ['timespanType', 'YEAR']], 3).pipe(
                mergeMap(years => Rx.from(years).pipe(
                    mergeMap(year => BusinessDashboardReportsDA.findTimeBox$([['businessId', args.businessId], ['timespanType', 'MONTH'], ['YEAR', year.YEAR]], 12).pipe(
                        mergeMap(months => Rx.from(months).pipe(
                            map(({ MONTH, MONTH_NAME, sales, bonus, pocket }) => (
                                { pos: (MONTH - 1), label: MONTH_NAME, mainSales: !sales ? 0 : !sales.pocket.MAIN ? 0 : Math.round(sales.pocket.MAIN.sum), bonusSales: !sales ? 0 : !sales.pocket.BONUS ? 0 : Math.round(sales.pocket.BONUS.sum), creditSales: !sales ? 0 : !sales.pocket.CREDIT ? 0 : Math.round(sales.pocket.CREDIT.sum), mainBalance: !pocket ? 0 : !pocket.main ? 0 : Math.round(pocket.main.current), bonusBalance: !pocket ? 0 : !pocket.bonus ? 0 : Math.round(pocket.bonus.current), salesQty: !sales ? 0 : sales.count, bonusQty: !bonus ? 0 : !bonus.input ? 0 : bonus.input.count }
                            )),
                            reduce((acc, { pos, mainSales, bonusSales, creditSales, mainBalance, bonusBalance, salesQty, bonusQty }) => {
                                acc.mainSales[pos] = mainSales;
                                acc.bonusSales[pos] = bonusSales;
                                acc.creditSales[pos] = creditSales;
                                acc.mainBalance[pos] = mainBalance;
                                acc.bonusBalance[pos] = bonusBalance;
                                acc.salesQty[pos] = salesQty;
                                acc.bonusQty[pos] = bonusQty;
                                return acc;
                            },
                                { mainSales: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], bonusSales: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], creditSales: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], mainBalance: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], bonusBalance: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], salesQty: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], bonusQty: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
                            ),
                            map(datasets => ({ timespan: year.YEAR.toString(), scale: '---', labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'], datasets }))
                        ))
                    )),
                    toArray(),
                    map(datasets => ({ timespan: 'YEAR', datasets }))
                ),
                )),


            BusinessDashboardReportsDA.findTimeBox$([['businessId', args.businessId], ['timespanType', 'MONTH']], 3).pipe(
                mergeMap(months => Rx.from(months).pipe(
                    mergeMap(month => BusinessDashboardReportsDA.findTimeBox$([['businessId', args.businessId], ['timespanType', 'DAY'], ['MONTH', month.MONTH]], 31).pipe(
                        mergeMap(days => Rx.from(days).pipe(
                            map(({ DAY, DAY_NAME, sales, bonus, pocket }) => (
                                { pos: (DAY - 1), mainSales: !sales ? 0 : !sales.pocket.MAIN ? 0 : Math.round(sales.pocket.MAIN.sum), bonusSales: !sales ? 0 : !sales.pocket.BONUS ? 0 : Math.round(sales.pocket.BONUS.sum), creditSales: !sales ? 0 : !sales.pocket.CREDIT ? 0 : Math.round(sales.pocket.CREDIT.sum), mainBalance: !pocket ? 0 : !pocket.main ? 0 : Math.round(pocket.main.current), bonusBalance: !pocket ? 0 : !pocket.bonus ? 0 : Math.round(pocket.bonus.current), salesQty: !sales ? 0 : sales.count, bonusQty: !bonus ? 0 : !bonus.input ? 0 : bonus.input.count }
                            )),
                            reduce((acc, { pos, mainSales, bonusSales, creditSales, mainBalance, bonusBalance, salesQty, bonusQty }) => {
                                acc.mainSales[pos] = mainSales;
                                acc.bonusSales[pos] = bonusSales;
                                acc.creditSales[pos] = creditSales;
                                acc.mainBalance[pos] = mainBalance;
                                acc.bonusBalance[pos] = bonusBalance;
                                acc.salesQty[pos] = salesQty;
                                acc.bonusQty[pos] = bonusQty;
                                return acc;
                            },
                                { mainSales: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], bonusSales: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], creditSales: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], mainBalance: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], bonusBalance: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], salesQty: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], bonusQty: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
                            ),
                            map(datasets => ({ timespan: month.MONTH_NAME, scale: '---', labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'], datasets }))
                        ))
                    )),
                    toArray(),
                    map(datasets => ({ timespan: 'MONTH', datasets }))
                ),
                )),


            BusinessDashboardReportsDA.findTimeBox$([['businessId', args.businessId], ['timespanType', 'WEEK']], 3).pipe(
                mergeMap(weeks => Rx.from(weeks).pipe(
                    mergeMap(week => BusinessDashboardReportsDA.findTimeBox$([['businessId', args.businessId], ['timespanType', 'DAY'], ['WEEK', week.WEEK]], 31).pipe(
                        mergeMap(days => Rx.from(days).pipe(
                            map(({ DAY_OF_WEEK, DAY_NAME, sales, bonus, pocket }) => (
                                { pos: (DAY_OF_WEEK - 1), mainSales: !sales ? 0 : !sales.pocket.MAIN ? 0 : sales.pocket.MAIN.sum, bonusSales: !sales ? 0 : !sales.pocket.BONUS ? 0 : Math.round(sales.pocket.BONUS.sum), creditSales: !sales ? 0 : !sales.pocket.CREDIT ? 0 : Math.round(sales.pocket.CREDIT.sum), mainBalance: !pocket ? 0 : !pocket.main ? 0 : Math.round(pocket.main.current), bonusBalance: !pocket ? 0 : !pocket.bonus ? 0 : Math.round(pocket.bonus.current), salesQty: !sales ? 0 : sales.count, bonusQty: !bonus ? 0 : !bonus.input ? 0 : bonus.input.count }
                            )),
                            reduce((acc, { pos, mainSales, bonusSales, creditSales, mainBalance, bonusBalance, salesQty, bonusQty }) => {
                                acc.mainSales[pos] = mainSales;
                                acc.bonusSales[pos] = bonusSales;
                                acc.creditSales[pos] = creditSales;
                                acc.mainBalance[pos] = mainBalance;
                                acc.bonusBalance[pos] = bonusBalance;
                                acc.salesQty[pos] = salesQty;
                                acc.bonusQty[pos] = bonusQty;
                                return acc;
                            },
                                { mainSales: [0, 0, 0, 0, 0, 0, 0], bonusSales: [0, 0, 0, 0, 0, 0, 0], creditSales: [0, 0, 0, 0, 0, 0, 0], mainBalance: [0, 0, 0, 0, 0, 0, 0], bonusBalance: [0, 0, 0, 0, 0, 0, 0], salesQty: [0, 0, 0, 0, 0, 0, 0], bonusQty: [0, 0, 0, 0, 0, 0, 0] }
                            ),
                            map(datasets => ({ timespan: week.WEEK.toString(), scale: '---', labels: ['MON', 'TUE', 'WED', 'THU', 'FRY', 'SAT', 'SUN'], datasets }))
                        ))
                    )),
                    toArray(),
                    map(datasets => ({ timespan: 'WEEK', datasets }))
                ),
                )),
        ).pipe(
            tap(x => console.log(`queryBusinessReportDashboardSalesOverview: ${JSON.stringify(x)}\n`)),
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
                            name: 'MAIN',
                            balance: Math.round(mainBalance < 0 ? 0 : mainBalance),
                            lastUpdate: business.lastUpdate,
                            currency: 'PESOS',
                        },
                        {
                            order: 2,
                            name: 'BONUS',
                            balance: Math.round(!business.wallet ? 0 : !business.wallet.pockets ? 0 : business.wallet.pockets.bonus),
                            lastUpdate: business.lastUpdate,
                            currency: 'PESOS',
                        },
                        {
                            order: 3,
                            name: 'CREDIT',
                            balance: Math.round(mainBalance < 0 ? Math.abs(mainBalance) : 0),
                            lastUpdate: business.lastUpdate,
                            currency: 'PESOS',
                        },
                    ]
                }
            }),
            tap(x => console.log(`queryBusinessReportDashboardWalletStatusCards: ${JSON.stringify(x)}\n`)),
            mergeMap(rawResponse => GraphqlResponseTools.buildSuccessResponse$(rawResponse)),
            catchError(error => {
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
'use strict'

const Rx = require("rxjs");
const { tap, mergeMap, catchError, map, mapTo } = require('rxjs/operators');
const GraphqlResponseTools = require('../../tools/GraphqlResponseTools');



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
        return Rx.of(
            [
                {
                    timespan: 'YEAR',
                    order: 3,
                    scale: 'THOUSANDS',
                    labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
                    datasets: [
                        { order: 3, label: '2015', data: [1.9, 3, 3.4, 2.2, 2.9, 3.9, 2.5, 3.8, 4.1, 3.8, 3.2, 2.9] },
                        { order: 2, label: '2016', data: [2.2, 2.9, 3.9, 2.5, 3.8, 3.2, 2.9, 1.9, 3, 3.4, 4.1, 3.8] },
                        { order: 1, label: '2017', data: [3.9, 2.5, 3.8, 4.1, 1.9, 3, 3.8, 3.2, 2.9, 3.4, 2.2, 2.9] },
                    ]
                },
                {
                    timespan: 'MONTH',
                    order: 2,
                    scale: 'THOUSANDS',
                    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9',
                        '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
                        '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
                    datasets: [
                        { order: 3, label: 'FEB', data: [1.9, 3, 3.4, 2.2, 2.9, 3.9, 2.5, 3.8, 4.1, 3.8, 3.2, 2.9, 1.9, 3.2, 3.4, 2.2, 2.9, 3.9, 2.5, 3.8, 4.1, 3.8, 3.2, 2.9, 3.9, 2.5, 3.8, 4.1, 3.8, 3.2, 2.9] },
                        { order: 2, label: 'MAR', data: [2.2, 2.9, 3.9, 2.5, 3.8, 3.2, 2.9, 1.9, 3, 3.4, 4.1, 3.8, 2.2, 2.9, 3.9, 2.5, 3.8, 3.2, 2.9, 1.9, 3, 3.4, 4.1, 3.8, 3.8, 3.2, 2.9, 1.9, 3, 3.4, 4.1, 3.8] },
                        { order: 1, label: 'JUN', data: [3.9, 2.5, 3.8, 4.1, 1.9, 3, 3.8, 3.2, 2.9, 3.4, 2.2, 2.9, 3.9, 2.5, 3.8, 4.1, 1.9, 3, 3.8, 3.2, 2.9, 3.4, 2.2, 2.9, 1.9, 3, 3.8, 3.2, 2.9, 3.4, 2.2, 2.9] },
                    ]
                },
                {
                    timespan: 'WEEK',
                    order: 1,
                    scale: 'THOUSANDS',
                    labels: ['MON', 'TUE', 'WED', 'THU', 'FRY', 'SAT', 'SUN'],
                    datasets: [
                        { order: 1, label: 'CURRENT', data: [1.9, 3, 3.4, 2.2, 2.9, 3.9, 2.5, 3.8, 4.1, 3.8, 3.2, 2.9] },
                        { order: 2, label: 'PAST', data: [2.2, 2.9, 3.9, 2.5, 3.8, 3.2, 2.9, 1.9, 3, 3.4, 4.1, 3.8] },
                        { order: 3, label: '2 WEEKS AGO', data: [3.9, 2.5, 3.8, 4.1, 1.9, 3, 3.8, 3.2, 2.9, 3.4, 2.2, 2.9] },
                    ]
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
     * retrieves Business-Report-Dashboard Net-Bonus-Distribution
     */
    queryBusinessReportDashboardNetBonusDistribution$({ root, args, jwt }, authToken) {
        return Rx.of(
            [
                {
                    timespan: "YEAR", datasets: [
                        { timespan: '2017', dataset: [{ product: 'Civica', percentage: 50, value: 12000, count: 123 }, { product: 'Tigo', percentage: 50, value: 45000, count: 6543 }] },
                        { timespan: '2016', dataset: [{ product: 'Civica', percentage: 50, value: 12000, count: 123 }, { product: 'Tigo', percentage: 50, value: 45000, count: 6543 }] },
                        { timespan: '2015', dataset: [{ product: 'Civica', percentage: 50, value: 12000, count: 123 }, { product: 'Tigo', percentage: 50, value: 45000, count: 6543 }] },
                    ],
                },
                {
                    timespan: "MONTH", datasets: [
                        { timespan: 'FEB', dataset: [{ product: 'Civica', percentage: 50, value: 12000, count: 123 }, { product: 'Tigo', percentage: 50, value: 45000, count: 6543 }] },
                        { timespan: 'MAR', dataset: [{ product: 'Civica', percentage: 50, value: 12000, count: 123 }, { product: 'Tigo', percentage: 50, value: 45000, count: 6543 }] },
                        { timespan: 'JUN', dataset: [{ product: 'Civica', percentage: 50, value: 12000, count: 123 }, { product: 'Tigo', percentage: 50, value: 45000, count: 6543 }] },
                    ],
                },
                {
                    timespan: "WEEK", datasets: [
                        { timespan: '2 WEEKS AGO', dataset: [{ product: 'Civica', percentage: 50, value: 12000, count: 123 }, { product: 'Tigo', percentage: 50, value: 45000, count: 6543 }] },
                        { timespan: 'PAST', dataset: [{ product: 'Civica', percentage: 50, value: 12000, count: 123 }, { product: 'Tigo', percentage: 50, value: 45000, count: 6543 }] },
                        { timespan: 'CURRENT', dataset: [{ product: 'Civica', percentage: 50, value: 12000, count: 123 }, { product: 'Tigo', percentage: 50, value: 45000, count: 6543 }] },
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
     * retrieves Business-Report-Dashboard Net-Sales-Distribution
     */
    queryBusinessReportDashboardNetSalesDistribution$({ root, args, jwt }, authToken) {
        return Rx.of(
            [
                {
                    timespan: "YEAR", datasets: [
                        { timespan: '2017', dataset: [{ product: 'Civica', percentage: 50, value: 12000, count: 123 }, { product: 'Tigo', percentage: 50, value: 45000, count: 6543 }] },
                        { timespan: '2016', dataset: [{ product: 'Civica', percentage: 50, value: 12000, count: 123 }, { product: 'Tigo', percentage: 50, value: 45000, count: 6543 }] },
                        { timespan: '2015', dataset: [{ product: 'Civica', percentage: 50, value: 12000, count: 123 }, { product: 'Tigo', percentage: 50, value: 45000, count: 6543 }] },
                    ],
                },
                {
                    timespan: "MONTH", datasets: [
                        { timespan: 'FEB', dataset: [{ product: 'Civica', percentage: 50, value: 12000, count: 123 }, { product: 'Tigo', percentage: 50, value: 45000, count: 6543 }] },
                        { timespan: 'MAR', dataset: [{ product: 'Civica', percentage: 50, value: 12000, count: 123 }, { product: 'Tigo', percentage: 50, value: 45000, count: 6543 }] },
                        { timespan: 'JUN', dataset: [{ product: 'Civica', percentage: 50, value: 12000, count: 123 }, { product: 'Tigo', percentage: 50, value: 45000, count: 6543 }] },
                    ],
                },
                {
                    timespan: "WEEK", datasets: [
                        { timespan: '2 WEEKS AGO', dataset: [{ product: 'Civica', percentage: 50, value: 12000, count: 123 }, { product: 'Tigo', percentage: 50, value: 45000, count: 6543 }] },
                        { timespan: 'PAST', dataset: [{ product: 'Civica', percentage: 50, value: 12000, count: 123 }, { product: 'Tigo', percentage: 50, value: 45000, count: 6543 }] },
                        { timespan: 'CURRENT', dataset: [{ product: 'Civica', percentage: 50, value: 12000, count: 123 }, { product: 'Tigo', percentage: 50, value: 45000, count: 6543 }] },
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
        return Rx.of(
            {
                spendingAllowed: true,
                pockets: [
                  {
                    order: 1,
                    name: 'MAIN',
                    balance: 12000000,
                    lastUpdate: Date.now(),
                    currency: 'PESOS',
                  },
                  {
                    order: 2,
                    name: 'BONUS',
                    balance: 120000,
                    lastUpdate: Date.now(),
                    currency: 'PESOS',
                  },
                  {
                    order: 3,
                    name: 'CREDIT',
                    balance: 115000,
                    lastUpdate: Date.now(),
                    currency: 'PESOS',
                  },
                ]
              }
        ).pipe(
            mergeMap(rawResponse => GraphqlResponseTools.buildSuccessResponse$(rawResponse)),
            catchError(error => {
                this.logError(error);
                return GraphqlResponseTools.handleError$(error);
            })
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
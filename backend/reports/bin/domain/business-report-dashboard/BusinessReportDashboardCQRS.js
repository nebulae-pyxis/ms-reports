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
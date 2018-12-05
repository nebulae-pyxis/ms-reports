'use strict'

const businessReportDashboardCQRS = require('./BusinessReportDashboardCQRS')();
const businessReportDashboardES = require('./BusinessReportDashboardES')();

module.exports = {
    businessReportDashboardCQRS,
    businessReportDashboardES
}
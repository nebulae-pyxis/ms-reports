const eventSourcing = require('./ReportsES')();
const cqrs = require('./ReportsCQRS')();

module.exports = {
    eventSourcing,
    cqrs
};
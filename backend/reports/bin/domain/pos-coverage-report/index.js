const eventSourcing = require('./PosCoverageReportES')();
const cqrs = require('./PosCoverageReportCQRS')();

module.exports = {
    eventSourcing,
    cqrs
};

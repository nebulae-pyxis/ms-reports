const { mergeMap, catchError, map, toArray } = require("rxjs/operators");
const { of } = require("rxjs");
const broker = require("../../tools/broker/BrokerFactory")();
const { CustomError, DefaultError } = require("../../tools/customError");
const HelloWorldDA = require('../../data/HelloWorldDA');
const PosDA = require('../../data/PosDA');
const { handleError$, buildSuccessResponse$ } = require('../../tools/GraphqlResponseTools');

let instance;

class ReportsCQRS {
  constructor() {}

  /**
   *  HelloWorld Query, please remove
   *  this is a queiry form GraphQL
   */
  getHelloWorld$(request) {
    console.log(`request: request`)
    return HelloWorldDA.getHelloWorld$().pipe(
      mergeMap(rawResponse => buildSuccessResponse$(rawResponse)),
      catchError(err => handleError$(err)) 
    );
  }

  getPosCoverage$({ args }, authToken){
    console.log(args);
    return PosDA.getPosCoverage$(args.businessId, args.product, args.posId)
    .pipe(
      mergeMap(rawData => buildSuccessResponse$(rawData)),
      catchError(error => handleError$(error))
    )
  }
}

/**
 * Business CQRS
 * @returns {ReportsCQRS}
 */
module.exports = () => {
  if (!instance) {
    instance = new ReportsCQRS();
    console.log("BusinessCQRS Singleton created.");
  }
  return instance;
};

const { mergeMap, catchError, map, toArray } = require("rxjs/operators");
const { of } = require("rxjs");
const broker = require("../../tools/broker/BrokerFactory")();
const { CustomError, DefaultError } = require("../../tools/customError");
const HelloWorldDA = require('../../data/HelloWorldDA');

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
      mergeMap(rawResponse => this.buildSuccessResponse$(rawResponse)),
      catchError(err => this.errorHandler$(err)) 
    );
  }

  //#region  mappers for API responses
  errorHandler$(err) {
    console.log("Handle error => ", err);
    return of(err).pipe(
      map(err => {
        const exception = { data: null, result: {} };
        const isCustomError = err instanceof CustomError;
        if (!isCustomError) {
          err = new DefaultError(err);
        }
        exception.result = {
          code: err.code,
          error: { ...err.getContent() }
        };
        return exception;
      })
    );
  }

  buildSuccessResponse$(rawRespponse) {
    return of(rawRespponse).pipe(
      map(resp => ({
        data: resp,
        result: { code: 200 }
      }))
    );
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

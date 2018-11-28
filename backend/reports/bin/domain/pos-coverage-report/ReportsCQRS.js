const { mergeMap, catchError, map, toArray, tap } = require("rxjs/operators");
const { of, from } = require("rxjs");
const broker = require("../../tools/broker/BrokerFactory")();
const { CustomError, DefaultError } = require("../../tools/customError");
const PosDA = require('../../data/PosDA');
const { handleError$, buildSuccessResponse$ } = require('../../tools/GraphqlResponseTools');

let instance;

class ReportsCQRS {
  constructor() {}


  getPosCoverage$({ args }, authToken){
    console.log(args);
    return PosDA.getPosCoverage$(args.businessId, args.product, args.posId)
    .pipe(
      mergeMap(posArray => from(posArray)
        .pipe(
          map(posInfo => ({
            ...posInfo,
            location: {
              type: posInfo.location.type,
              coordinates: { lat: posInfo.location.coordinates[0], long: posInfo.location.coordinates[1] }
            }
          })),
          toArray()
        )
      ),
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

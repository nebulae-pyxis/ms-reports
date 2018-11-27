const { mergeMap, catchError, map, toArray, tap } = require('rxjs/operators');
const { of, throwError } = require('rxjs');
const BusinessDA = require("../../data/BusinessDA");
const RoleValidator = require("../../tools/RoleValidator");
const { CustomError, DefaultError } = require("../../tools/customError");
const {
  PERMISSION_DENIED_ERROR,
  INTERNAL_SERVER_ERROR
} = require("../../tools/ErrorCodes");

let instance;

class BusinessCQRS {
  constructor() {}

  /**
   * Gets the businesses registered on the platform
   *
   * @param {*} args args that contain the business filters
   */
  getWalletBusinesses$({ args }, authToken) {
    console.log("fetching the businesses array ...");
    return RoleValidator.checkPermissions$(
      authToken.realm_access.roles,
      "wallet",
      "getWalletBusinesses$()",
      PERMISSION_DENIED_ERROR,
      ["SYSADMIN", "business-owner"]
    ).pipe(
      mergeMap(rolResult => rolResult['SYSADMIN']
        ? BusinessDA.getAllBusinesses$()
        : rolResult['business-owner']
          ? BusinessDA.getBusiness$('') 
          : throwError(new CustomError("Query not allowed", "getWalletBusinesses$", 23006, "Roles not enough" ) )
      ),
      toArray(),
      mergeMap(rawResponse => this.buildSuccessResponse$(rawResponse)),
      catchError(err => {
        return this.handleError$(err);
      })
    );
  }


  //#region  mappers for API responses
  handleError$(err) {
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
    )
  }
}

/**
 * Business CQRS
 * @returns {BusinessCQRS}
 */
module.exports = () => {
  if (!instance) {
    instance = new BusinessCQRS();
    console.log("BusinessCQRS Singleton created.");
  }
  return instance;
};

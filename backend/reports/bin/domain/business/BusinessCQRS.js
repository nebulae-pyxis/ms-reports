const { mergeMap, catchError, toArray } = require('rxjs/operators');
const { throwError } = require('rxjs');
const BusinessDA = require("../../data/BusinessDA");
const RoleValidator = require("../../tools/RoleValidator");
const { CustomError, DefaultError } = require("../../tools/customError");
const { buildSuccessResponse$, handleError$ } = require('../../tools/GraphqlResponseTools');
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
  getBusinesses$({ args }, authToken) {
    console.log("Fetching the businesses array ...", Date.now().toLocaleString());
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
      tap(r => console.log("##### GET BUSINESSES RESULT => ", r)),
      mergeMap(rawResponse => buildSuccessResponse$(rawResponse)),
      catchError(err => handleError$(err) )
    );
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

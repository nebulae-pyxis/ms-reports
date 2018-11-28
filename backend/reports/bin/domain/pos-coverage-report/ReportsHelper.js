
const  { of } = require('rxjs');
const CIVICA_RELOAD_PRODUCT_TYPE = "CIVICA_CARD_RELOAD";


class ReportsHelper {

  constructor() { }

  static extractPosInfoFromCivicaCadReloadEvt(evt){
    return of({
      _id: `${evt.data.businessId}_${evt.data.receipt.posId}`,
      lastUpdate: Date.now(),
      businessId: evt.data.businessId,
      products: [CIVICA_RELOAD_PRODUCT_TYPE],
      // avgReload: evt.data.receipt.reloadValue,
      pos: {
        userName: evt.data.receipt.posUserName,
        userId: evt.data.receipt.posUserId,
        terminal: evt.data.receipt.posTerminal
      },
      location: evt.data.location
    });
  }

}

/**
 * Reports helpers
 * @returns {ReportsHelper}
 */
module.exports = ReportsHelper;

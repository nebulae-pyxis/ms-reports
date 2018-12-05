"use strict";

let mongoDB = undefined;
const CollectionName = "BusinessDashboardReports";
const { Observable, defer, of } = require('rxjs');
const { map, mergeMap, tap } = require('rxjs/operators');
const { CustomError } = require("../tools/customError");

class BusinessDashboardReportsDA {

  static start$(mongoDbInstance) {
    return Observable.create((observer) => {
      if (mongoDbInstance) {
        mongoDB = mongoDbInstance;
        observer.next('using given mongo instance ');
      } else {
        mongoDB = require('./MongoDB').singleton();
        observer.next('using singleton system-wide mongo instance');
      }
      observer.complete();
    });
  }

  /**
   * Finds a Business by its buisnessid
   * @param string id 
   */
  static findTimeBox$(keys, limit = 100) {
    const collection = mongoDB.db.collection('TimeBox');
    return defer(
      () => collection
        .find(keys.reduce((obj, [key, value]) => { obj[key] = value; return obj; }, {}))
        .sort({ timestamp: -1 })
        .limit(limit)
        .toArray()
    );
  }


  static updateTimeBox$(keys, fieldsToSet, fieldsToInc, secondaryKeys = []) {
    const collection = mongoDB.db.collection('TimeBox');
    const _id = keys.map(([k, v]) => v).join('_');
    const updateQuery = [
      { _id },
      {
        '$setOnInsert': { ...keys.reduce((obj, [key, value]) => { obj[key] = value; return obj; }, {}), ...secondaryKeys.reduce((obj, [key, value]) => { obj[key] = value; return obj; }, {}), timestamp: Date.now() },
        '$set': fieldsToSet.reduce((obj, [key, value]) => { obj[key] = value; return obj; }, {}),
        '$inc': fieldsToInc.reduce((obj, [key, value]) => { obj[key] = value; return obj; }, {}),
      },
      { 'multi': false, upsert: true }
    ];

    return defer(() => collection.update(...updateQuery)).pipe(
      tap(x => { if (x.result.ok !== 1) throw (new Error(`timeBox(id:${id}) updated failed`)); }),
    );
  }








}

/**
 * Returns a BusinessDashboardReports
 * @returns {BusinessDashboardReportsDA}
 */
module.exports = BusinessDashboardReportsDA;

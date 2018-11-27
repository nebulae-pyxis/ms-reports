"use strict";

let mongoDB = undefined;
const CollectionName = "Business";
const { Observable, defer, of } = require('rxjs');
const { map, mergeMap } = require('rxjs/operators');
const { CustomError } = require("../tools/customError");

class BusinessDA {

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
   * Gets business by id
   * @param {String} id business ID
   */
  static getBusiness$(id) {
    const collection = mongoDB.db.collection(CollectionName);
    return defer(() => collection.findOne({ '_id': id }));
  }

  /**
   * Gets all businesses from the database using a iterator
   */
  static getAllBusinesses$() {
    return Observable.create(async observer => {
      const collection = mongoDB.db.collection(CollectionName);
      const cursor = collection.find({});
      let obj = await this.extractNextFromMongoCursor(cursor);
      while (obj) {
        observer.next(obj);
        obj = await this.extractNextFromMongoCursor(cursor);
      }

      observer.complete();
    });
  }

  /**
   * Creates a new business
   * @param {*} business business to create
   */
  static persistBusiness$(business) {
    // console.log("# BUSINES CREATED ==>", business);
    const collection = mongoDB.db.collection(CollectionName);   
    return of(business)
    .pipe(
      map(bu => ({ _id: bu._id, name: bu.generalInfo.name, products: [] })),
      mergeMap(bu => defer(() => collection.insertOne(bu)))      
    )
  }

  static pushProduct$(buId, productsItems){
    console.log("PRODUCTS ==> ", productsItems);
    const collection = mongoDB.db.collection(CollectionName); 
    return defer(() => collection.findOneAndUpdate(
      {_id: buId},
      { $addToSet: { products : { $each: productsItems }}  }, { upsert: true } ));
  }

  /**
   * modifies the general info of the indicated business 
   * @param {*} id  Business ID
   * @param {*} businessGeneralInfo  New general information of the business
   */
  static updateBusinessGeneralInfo$(id, businessGeneralInfo) {
    const collection = mongoDB.db.collection(CollectionName);
    return defer(() =>
      collection.findOneAndUpdate(
        { _id: id },
        {
          $set: { name: businessGeneralInfo.name }
        }, {
          returnOriginal: false
        }
      )
    )
      .pipe(
        map(result => result && result.value ? result.value : undefined)
      )
  }

    /**
   * Extracts the next value from a mongo cursor if available, returns undefined otherwise
   * @param {*} cursor
   */
  static async extractNextFromMongoCursor(cursor) {
    const hasNext = await cursor.hasNext();
    if (hasNext) {
      const obj = await cursor.next();
      return obj;
    }
    return undefined;
  }
}

/**
 * Returns a BusinessDA
 * @returns {BusinessDA}
 */
module.exports = BusinessDA;

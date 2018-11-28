'use strict'

let mongoDB = undefined;
//const mongoDB = require('./MongoDB')();
const Rx = require('rxjs');
const CollectionName = "Pos";
const { CustomError } = require('../tools/customError');
const { Observable, defer, of } = require('rxjs');
const { map, mergeMap } = require('rxjs/operators');

class PosDA {

  static start$(mongoDbInstance) {
    return Rx.Observable.create((observer) => {
      if (mongoDbInstance) {
        mongoDB = mongoDbInstance;
        observer.next('using given mongo instance');
      } else {
        mongoDB = require('./MongoDB').singleton();
        observer.next('using singleton system-wide mongo instance');
      }
      observer.complete();
    });
  }
  
  static insertPosInfo$(PosData){
    console.log("insertPosInfo$", JSON.stringify(PosData));
    const collection = mongoDB.db.collection(CollectionName);
    return defer(() => collection.findOneAndUpdate(
        { _id: PosData._id },
        {  
            $set: {
              _id: PosData._id,
              lastUpdate: PosData.lastUpdate,
              businessId: PosData.businessId,
              pos: PosData.pos,
              location: PosData.location
            },
            $addToSet: { products : { $each: PosData.products }}
        },            
        { upsert: true }
    ))
  }

  static getPosCoverage$(businessId, product, posId){
    const collection = mongoDB.db.collection(CollectionName);
    const filter = {};
    if(businessId){ filter.businessId = businessId; }
    if(product){ filter.product = product; }
    if(posId){ filter.posId = posId; }
    return defer(() => collection.find(filter).toArray());
  }

}
/**
 * @returns {PosDA}
 */
module.exports =  PosDA 
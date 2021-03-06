const withFilter = require("graphql-subscriptions").withFilter;
const PubSub = require("graphql-subscriptions").PubSub;
const pubsub = new PubSub();
const broker = require("../../broker/BrokerFactory")();
const {handleError$} = require('../../tools/GraphqlResponseTools');

const { of } = require('rxjs');
const { map, mergeMap, catchError } = require('rxjs/operators');

function getResponseFromBackEnd$(response) {
    return of(response)
    .pipe(
        map(resp => {
            if (resp.result.code != 200) {
                const err = new Error();
                err.name = 'Error';
                err.message = resp.result.error;
                Error.captureStackTrace(err, 'Error');
                throw err;
            }
            return resp.data;
        })
    );
  }

module.exports = {

    //// QUERY ///////
    

    Query: {        
        
        ReportBusinesses(root, args, context) {
            return broker
                .forwardAndGetReply$(
                    "Report",
                    "emigateway.graphql.query.getReportsBusinesses",
                    { root, args, jwt: context.encodedToken },
                    2000
                ).pipe(
                    mergeMap(response => getResponseFromBackEnd$(response))
                )
                .toPromise();
        },
        ReportPosItems(root, args, context) {
            return broker
                .forwardAndGetReply$(
                    "Report",
                    "emigateway.graphql.query.getCoveragePos",
                    { root, args, jwt: context.encodedToken },
                    2000
                ).pipe(
                    mergeMap(response => getResponseFromBackEnd$(response))
                ).toPromise();
        }
    },

    //// MUTATIONS ///////


    //// SUBSCRIPTIONS ///////
    Subscription: {
        // reportsHelloWorldSubscription: {
        //     subscribe: withFilter(
        //         (payload, variables, context, info) => {
        //             return pubsub.asyncIterator("reportsHelloWorldSubscription");
        //         },
        //         (payload, variables, context, info) => {
        //             return true;
        //         }
        //     )
        // }        

    }
};

//// SUBSCRIPTIONS SOURCES ////

const eventDescriptors = [
    {
        backendEventName: 'reportsHelloWorldEvent',
        gqlSubscriptionName: 'reportsHelloWorldSubscription',
        dataExtractor: (evt) => evt.data,// OPTIONAL, only use if needed
        onError: (error, descriptor) => console.log(`Error processing ${descriptor.backendEventName}`),// OPTIONAL, only use if needed
        onEvent: (evt, descriptor) => {} //console.log(`Event of type  ${descriptor.backendEventName} arraived`),// OPTIONAL, only use if needed
    },
];



/**
 * Connects every backend event to the right GQL subscription
 */
eventDescriptors.forEach(descriptor => {
    broker
        .getMaterializedViewsUpdates$([descriptor.backendEventName])
        .subscribe(
            evt => {
                if (descriptor.onEvent) {
                    descriptor.onEvent(evt, descriptor);
                }
                const payload = {};
                payload[descriptor.gqlSubscriptionName] = descriptor.dataExtractor ? descriptor.dataExtractor(evt) : evt.data
                pubsub.publish(descriptor.gqlSubscriptionName, payload);
            },

            error => {
                if (descriptor.onError) {
                    descriptor.onError(error, descriptor);
                }
                console.error(
                    `Error listening ${descriptor.gqlSubscriptionName}`,
                    error
                );
            },

            () =>
                console.log(
                    `${descriptor.gqlSubscriptionName} listener STOPED`
                )
        );
});



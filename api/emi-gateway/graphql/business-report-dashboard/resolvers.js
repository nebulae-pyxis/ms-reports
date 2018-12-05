const withFilter = require("graphql-subscriptions").withFilter;
const PubSub = require("graphql-subscriptions").PubSub;
const pubsub = new PubSub();
const Rx = require("rxjs");
const broker = require("../../broker/BrokerFactory")();
const RoleValidator = require('../../tools/RoleValidator');
const INTERNAL_SERVER_ERROR_CODE = 18001;
const USERS_PERMISSION_DENIED_ERROR_CODE = 18002;

function getResponseFromBackEnd$(response) {
    return Rx.Observable.of(response)
        .map(resp => {
            if (resp.result.code != 200) {
                const err = new Error();
                err.name = 'Error';
                err.message = resp.result.error;
                // this[Symbol()] = resp.result.error;
                Error.captureStackTrace(err, 'Error');
                throw err;
            }
            return resp.data;
        });
}


module.exports = {
    
    //// QUERY ///////
    Query: {
        businessReportDashboardBonusLineChart(root, args, context) {
            return RoleValidator.checkPermissions$(context.authToken.realm_access.roles, 'business-report-dashboard', 'businessReportDashboardBonusLineChart', USERS_PERMISSION_DENIED_ERROR_CODE, 'Permission denied', ['BUSINESS-OWNER','PLATFORM-ADMIN'])                
                .switchMapTo(
                    broker.forwardAndGetReply$("Report", "emigateway.graphql.query.businessReportDashboardBonusLineChart", { root, args, jwt: context.encodedToken }, 500)
                        .mergeMap(response => getResponseFromBackEnd$(response))
                ).toPromise();
        },
        businessReportDashboardNetBonusDistribution(root, args, context) {
            return RoleValidator.checkPermissions$(context.authToken.realm_access.roles, 'business-report-dashboard', 'businessReportDashboardNetBonusDistribution', USERS_PERMISSION_DENIED_ERROR_CODE, 'Permission denied', ['BUSINESS-OWNER','PLATFORM-ADMIN'])                
                .switchMapTo(
                    broker.forwardAndGetReply$("Report", "emigateway.graphql.query.businessReportDashboardNetBonusDistribution", { root, args, jwt: context.encodedToken }, 500)
                        .mergeMap(response => getResponseFromBackEnd$(response))
                ).toPromise();
        },
        businessReportDashboardNetSalesDistribution(root, args, context) {
            return RoleValidator.checkPermissions$(context.authToken.realm_access.roles, 'business-report-dashboard', 'businessReportDashboardNetSalesDistribution', USERS_PERMISSION_DENIED_ERROR_CODE, 'Permission denied', ['BUSINESS-OWNER','PLATFORM-ADMIN'])                
                .switchMapTo(
                    broker.forwardAndGetReply$("Report", "emigateway.graphql.query.businessReportDashboardNetSalesDistribution", { root, args, jwt: context.encodedToken }, 500)
                        .mergeMap(response => getResponseFromBackEnd$(response))
                ).toPromise();
        },
        businessReportDashboardSalesOverview(root, args, context) {
            return RoleValidator.checkPermissions$(context.authToken.realm_access.roles, 'business-report-dashboard', 'businessReportDashboardSalesOverview', USERS_PERMISSION_DENIED_ERROR_CODE, 'Permission denied', ['BUSINESS-OWNER','PLATFORM-ADMIN'])                
                .switchMapTo(
                    broker.forwardAndGetReply$("Report", "emigateway.graphql.query.businessReportDashboardSalesOverview", { root, args, jwt: context.encodedToken }, 500)
                        .mergeMap(response => getResponseFromBackEnd$(response))
                ).toPromise();
        },
        businessReportDashboardWalletStatusCards(root, args, context) {
            return RoleValidator.checkPermissions$(context.authToken.realm_access.roles, 'business-report-dashboard', 'businessReportDashboardWalletStatusCards', USERS_PERMISSION_DENIED_ERROR_CODE, 'Permission denied', ['BUSINESS-OWNER','PLATFORM-ADMIN'])                
                .switchMapTo(
                    broker.forwardAndGetReply$("Report", "emigateway.graphql.query.businessReportDashboardWalletStatusCards", { root, args, jwt: context.encodedToken }, 500)
                        .mergeMap(response => getResponseFromBackEnd$(response))
                ).toPromise();
        },
        

    },

    //// MUTATIONS ///////
    Mutation: {
    },
};



//// SUBSCRIPTIONS SOURCES ////

const eventDescriptors = [    
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

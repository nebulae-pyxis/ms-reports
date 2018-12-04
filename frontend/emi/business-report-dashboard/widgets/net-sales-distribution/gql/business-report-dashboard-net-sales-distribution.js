import gql from "graphql-tag";

// We use the gql tag to parse our query string into a query document

export const businessReportDashboardNetSalesDistribution = gql`
    query{
        businessReportDashboardNetSalesDistribution(businessId:""){
            timespan,
            datasets{
            timespan,
            dataset{
                product,percentage,value,count
            }
            }
        }
    }
`;


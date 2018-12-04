import gql from "graphql-tag";

// We use the gql tag to parse our query string into a query document

export const businessReportDashboardBonusLineChart = gql`
    query{
        businessReportDashboardBonusLineChart(businessId: "BUSINESS_ID"){
            timespan,scale,order,labels,datasets{order,label,data}
        }
    }
`;



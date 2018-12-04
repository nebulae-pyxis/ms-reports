import gql from "graphql-tag";

// We use the gql tag to parse our query string into a query document

export const businessReportDashboardSalesOverview = gql`
query{
  businessReportDashboardSalesOverview(businessId:""){
    timespan,
    datasets{
      timespan,
      scale,
      labels,
      datasets{
        mainSales,bonusSales,creditSales,mainBalance,bonusBalance,salesQty,bonusQty
      }
      
    }
  }
}
`;


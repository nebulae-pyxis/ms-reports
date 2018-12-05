import gql from "graphql-tag";

// We use the gql tag to parse our query string into a query document

export const businessReportDashboardSalesOverview = gql`
query{
  businessReportDashboardSalesOverview(businessId:"c81860b2-5da0-4c03-8774-445f244bc8d4"){
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


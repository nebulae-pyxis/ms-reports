import gql from "graphql-tag";

// We use the gql tag to parse our query string into a query document

export const businessReportDashboardWalletStatusCards = gql`
query{
  businessReportDashboardWalletStatusCards(businessId:""){
    spendingAllowed,
    pockets{
      order,name,balance,lastUpdate,currency
    }
  }
}
`;


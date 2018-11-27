import gql from "graphql-tag";

// We use the gql tag to parse our query string into a query document

export const getPosItems = gql`
query  ReportPosItems($businessId: String, $product: String, $posId: String   ){
  ReportPosItems(businessId: $businessId, product:$product, posId: $posId){
    _id
    lastUpdate
    businessId
    products
    pos {
      userName
      userId
      terminal
    }
    location {
      type
    }
  }
}`;

export const getBusinesses = gql`
query getBusinesses{
  ReportBusinesses{
    _id
    name
    products
  }
}`;

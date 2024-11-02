/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getMarketStats = /* GraphQL */ `query GetMarketStats {
  getMarketStats {
    totalMarketCap
    totalVolume24h
    btcDominance
    marketCapChange24h
    lastUpdated
    statusCode
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetMarketStatsQueryVariables,
  APITypes.GetMarketStatsQuery
>;

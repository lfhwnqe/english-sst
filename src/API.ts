/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type MarketStats = {
  __typename: "MarketStats",
  totalMarketCap?: number | null,
  totalVolume24h?: number | null,
  btcDominance?: number | null,
  marketCapChange24h?: number | null,
  lastUpdated?: string | null,
  statusCode?: number | null,
};

export type GetMarketStatsQueryVariables = {
};

export type GetMarketStatsQuery = {
  getMarketStats?:  {
    __typename: "MarketStats",
    totalMarketCap?: number | null,
    totalVolume24h?: number | null,
    btcDominance?: number | null,
    marketCapChange24h?: number | null,
    lastUpdated?: string | null,
    statusCode?: number | null,
  } | null,
};

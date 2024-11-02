"use client";
import { useState, useEffect } from "react";
import { client } from "@/app/config/amplify-config";
import { getMarketStats } from "@/src/graphql/queries";
import { GetMarketStatsQuery, MarketStats } from "@/src/API";
import { GraphQLResult } from "@aws-amplify/api";
import {
  FaBitcoin,
  FaChartLine,
  FaDollarSign,
  FaPercent,
} from "react-icons/fa";

// type MarketStats = {
//   totalMarketCap: number;
//   totalVolume24h: number;
//   btcDominance: number;
//   marketCapChange24h: number;
//   lastUpdated: string;
//   statusCode?: number;
// };

export default function Home() {
  const [marketStats, setMarketStats] = useState<MarketStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketStats = async () => {
      try {
        const response = (await client.graphql({
          query: getMarketStats,
        })) as GraphQLResult<GetMarketStatsQuery>;

        if (response.data?.getMarketStats) {
          setMarketStats(response?.data?.getMarketStats);
        }
      } catch (err) {
        console.error("Error fetching market stats:", err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketStats();
  }, []);

  if (loading)
    return <div className="text-center text-white text-xl">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 text-xl">Error: {error}</div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black flex items-center justify-center text-white">
      <div className="max-w-2xl w-full p-6 bg-opacity-90 backdrop-blur-md bg-gray-800 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-400 to-pink-600">
          Market Stats
        </h1>
        {marketStats ? (
          <ul className="space-y-6">
            <li className="flex items-center justify-between bg-gray-700 rounded-lg p-4 shadow-md">
              <FaDollarSign className="text-yellow-500 text-2xl" />
              <span className="text-lg font-semibold">Total Market Cap</span>
              <span className="text-xl font-bold text-yellow-300">
                ${marketStats?.totalMarketCap?.toLocaleString()}
              </span>
            </li>
            <li className="flex items-center justify-between bg-gray-700 rounded-lg p-4 shadow-md">
              <FaChartLine className="text-green-500 text-2xl" />
              <span className="text-lg font-semibold">Total Volume 24h</span>
              <span className="text-xl font-bold text-green-300">
                ${marketStats?.totalVolume24h?.toLocaleString()}
              </span>
            </li>
            <li className="flex items-center justify-between bg-gray-700 rounded-lg p-4 shadow-md">
              <FaBitcoin className="text-orange-500 text-2xl" />
              <span className="text-lg font-semibold">BTC Dominance</span>
              <span className="text-xl font-bold text-orange-300">
                {marketStats.btcDominance}%
              </span>
            </li>
            <li className="flex items-center justify-between bg-gray-700 rounded-lg p-4 shadow-md">
              <FaPercent className="text-pink-500 text-2xl" />
              <span className="text-lg font-semibold">
                Market Cap Change 24h
              </span>
              <span
                className={`text-xl font-bold ${
                  (marketStats?.marketCapChange24h as number) < 0
                    ? "text-red-400"
                    : "text-green-400"
                }`}
              >
                {marketStats.marketCapChange24h}%
              </span>
            </li>
            <li className="text-sm text-gray-400 mt-4">
              Last Updated:{" "}
              {new Date(marketStats?.lastUpdated as unknown as number).toLocaleString()}
            </li>
          </ul>
        ) : (
          <div>No data available</div>
        )}
      </div>
    </div>
  );
}

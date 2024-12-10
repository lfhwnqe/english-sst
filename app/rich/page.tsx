"use client";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface InvestmentParams {
  initialMonthly: number;
  yearsPhase1: number;
  yearsPhase2: number;
  annualIncrease: number;
  phase2Monthly: number;
  appreciationRate: number;
  dividendYield: number;
}

interface AnnualResult {
  year: number;
  monthlyInvestment: number;
  yearlyInvestment: number;
  returnAmount: number;
  totalValue: number;
  totalInvested: number;
  accumulatedReturn: number;
}

const InvestmentCalculator: React.FC = () => {
  const [params, setParams] = useState<InvestmentParams>({
    initialMonthly: 500,
    yearsPhase1: 10,
    yearsPhase2: 10,
    annualIncrease: 10,
    phase2Monthly: 3000,
    appreciationRate: 10,
    dividendYield: 2,
  });

  const [results, setResults] = useState<AnnualResult[]>([]);

  const calculateInvestment = (): void => {
    let currentMonthly = params.initialMonthly;
    let totalValue = 0;
    let totalInvested = 0;
    const annualResults: AnnualResult[] = [];
    const totalYears = params.yearsPhase1 + params.yearsPhase2;
    const totalReturn = (params.appreciationRate + params.dividendYield) / 100;

    for (let year = 1; year <= totalYears; year++) {
      const isPhase2 = year > params.yearsPhase1;

      if (isPhase2) {
        currentMonthly = params.phase2Monthly;
      } else if (year > 2) {
        currentMonthly = currentMonthly * (1 + params.annualIncrease / 100);
      }

      const yearlyInvestment = currentMonthly * 12;
      totalInvested += yearlyInvestment;

      const yearReturn = totalValue * totalReturn;
      totalValue = totalValue + yearReturn + yearlyInvestment;

      annualResults.push({
        year,
        monthlyInvestment: Math.round(currentMonthly),
        yearlyInvestment: Math.round(yearlyInvestment),
        returnAmount: Math.round(yearReturn),
        totalValue: Math.round(totalValue),
        totalInvested: Math.round(totalInvested),
        accumulatedReturn: Math.round(totalValue - totalInvested),
      });
    }

    setResults(annualResults);
  };

  useEffect(() => {
    calculateInvestment();
  }, [params]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen">
      <div className="rounded-lg shadow-lg p-6 flex flex-col gap-8">
        <h2 className="text-2xl font-bold mb-6">投资计算器</h2>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
              初始月投资额
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={params.initialMonthly}
              onChange={(e) =>
                setParams({ ...params, initialMonthly: Number(e.target.value) })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
              第一阶段年数
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={params.yearsPhase1}
              onChange={(e) =>
                setParams({ ...params, yearsPhase1: Number(e.target.value) })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
              年度增长率(%)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={params.annualIncrease}
              onChange={(e) =>
                setParams({ ...params, annualIncrease: Number(e.target.value) })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
              第二阶段月投资额
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={params.phase2Monthly}
              onChange={(e) =>
                setParams({ ...params, phase2Monthly: Number(e.target.value) })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
              第二阶段年数
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={params.yearsPhase2}
              onChange={(e) =>
                setParams({ ...params, yearsPhase2: Number(e.target.value) })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
              ETF年增值率(%)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={params.appreciationRate}
              onChange={(e) =>
                setParams({
                  ...params,
                  appreciationRate: Number(e.target.value),
                })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
              股息率(%)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={params.dividendYield}
              onChange={(e) =>
                setParams({ ...params, dividendYield: Number(e.target.value) })
              }
            />
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={results}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  tickFormatter={(value: number) => `第${value}年`}
                />
                <YAxis
                  tickFormatter={(value: number) => formatCurrency(value)}
                />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalValue"
                  name="总资产"
                  stroke="#8884d8"
                />
                <Line
                  type="monotone"
                  dataKey="totalInvested"
                  name="总投入"
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Results Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  年度
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  月投资额
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  年度投入
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  当年收益
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  年末总值
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  累计投入
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  累计收益
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.map((row: AnnualResult) => (
                <tr key={row.year} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    第{row.year}年
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(row.monthlyInvestment)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(row.yearlyInvestment)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(row.returnAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(row.totalValue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(row.totalInvested)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(row.accumulatedReturn)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCalculator;

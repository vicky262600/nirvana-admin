'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { apiFetch } from '../utils/apiClient';

const AnalyticsContainer = styled.div`
  flex: 4;
  padding: 20px;
`;

const CardsRow = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 28px 36px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const CardLabel = styled.div`
  font-size: 15px;
  color: #6b7280;
  margin-bottom: 8px;
`;

const CardValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #7451f8;
  display: flex;
  flex-direction: column;
`;

const CardValueSmall = styled.span`
  font-size: 15px;
  color: #6b7280;
  font-weight: 500;
  margin-top: 2px;
`;

const ChartSection = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 32px 24px;
  margin-bottom: 32px;
`;

const ChartTitle = styled.h2`
  font-size: 20px;
  color: #333;
  margin-bottom: 24px;
`;

const MonthSelect = styled.select`
  background: #f3f4f6;
  color: #374151;
  border: 1.5px solid #e5e7eb;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 15px;
  font-weight: 600;
  outline: none;
  margin-left: 16px;
`;

const monthNames = [
  '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const Analytics = () => {
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
  });

  const [salesData, setSalesData] = useState([]);
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    totalTax: 0,
  });
  const [loading, setLoading] = useState(true);

  // Initialize selectedMonth based on fetched data
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        // Fetch orders data to calculate revenue and tax
        const ordersRes = await apiFetch('/api/orders');
        if (!ordersRes.ok) throw new Error('Failed to fetch orders');
        const ordersData = await ordersRes.json();
        const orders = ordersData.orders || ordersData;

        // Calculate total revenue and tax from all orders
        let totalRevenue = 0;
        let totalTax = 0;
        const monthlyData = {};

        orders.forEach(order => {
          const orderDate = new Date(order.createdAt);
          const month = orderDate.getMonth() + 1; // getMonth() returns 0-11, we need 1-12
          const orderTotal = order.total || 0;
          const orderTax = order.tax || 0;

          totalRevenue += orderTotal;
          totalTax += orderTax;

          // Initialize month data if not exists
          if (!monthlyData[month]) {
            monthlyData[month] = { totalSales: 0, totalOrders: 0 };
          }
          monthlyData[month].totalSales += orderTotal;
          monthlyData[month].totalOrders += 1;
        });

        // Convert monthly data to array format for chart
        const formattedSales = Object.entries(monthlyData)
          .map(([month, data]) => ({
            _id: parseInt(month),
            totalSales: data.totalSales,
            totalOrders: data.totalOrders,
          }))
          .sort((a, b) => a._id - b._id)
          .map((d) => ({
            month: monthNames[d._id] || '',
            sales: d.totalSales,
            orders: d.totalOrders,
          }));

        // Fetch summary stats
        const summaryRes = await apiFetch('/api/admin/summary');
        if (!summaryRes.ok) throw new Error('Failed to fetch summary');
        const summaryData = await summaryRes.json();

        setSummary({
          totalOrders: summaryData.totalOrders ?? 0,
          totalUsers: summaryData.totalUsers ?? 0,
          totalProducts: summaryData.totalProducts ?? 0,
        });

        setRevenueData({
          totalRevenue,
          totalTax,
        });

        setSalesData(formattedSales);

        // Set selected month to current month if available, else first month in data
        const currentMonthName = monthNames[new Date().getMonth() + 1];
        setSelectedMonth(
          formattedSales.some(d => d.month === currentMonthName)
            ? currentMonthName
            : formattedSales[0]?.month || ''
        );
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading analytics...</div>;

  const months = salesData.map((d) => d.month);
  const monthData = salesData.find((d) => d.month === selectedMonth);

  return (
    <AnalyticsContainer>
      <CardsRow>
        <Card>
          <CardLabel>Total Revenue</CardLabel>
          <CardValue>
            ${revenueData.totalRevenue.toFixed(2)}
            <CardValueSmall>
              This month: <strong>${monthData?.sales?.toFixed(2) ?? '0.00'}</strong>
            </CardValueSmall>
            <MonthSelect
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ marginLeft: 0, marginTop: 8 }}
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </MonthSelect>
          </CardValue>
        </Card>

        <Card>
          <CardLabel>Total Tax Collected</CardLabel>
          <CardValue>
            ${revenueData.totalTax.toFixed(2)}
            <CardValueSmall>
              All time tax collection
            </CardValueSmall>
          </CardValue>
        </Card>

        <Card>
          <CardLabel>Total Orders</CardLabel>
          <CardValue>
            {summary.totalOrders}
            <CardValueSmall>
              This month: <strong>{monthData?.orders ?? 0}</strong>
            </CardValueSmall>
          </CardValue>
        </Card>

        <Card>
          <CardLabel>Total Customers</CardLabel>
          <CardValue>{summary.totalUsers}</CardValue>
        </Card>

        <Card>
          <CardLabel>Total Products</CardLabel>
          <CardValue>{summary.totalProducts}</CardValue>
        </Card>
      </CardsRow>

      <ChartSection>
        <ChartTitle>Sales Over the Year</ChartTitle>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart
            data={salesData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#7451f8"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartSection>
    </AnalyticsContainer>
  );
};

export default Analytics;

'use client';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import LineChart from '../components/LineChart';
import { apiFetch } from '../utils/apiClient';

const DashboardContainer = styled.div`
  flex: 4;
  padding: 20px;
`;

const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FeaturedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const FeaturedItem = styled.div`
  flex: 1;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  background-color: white;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0px 0px 20px -10px rgba(0, 0, 0, 0.75);
  }
`;

const FeaturedTitle = styled.span`
  font-size: 20px;
  color: #555;
`;

const FeaturedMoneyContainer = styled.div`
  margin: 10px 0;
  display: flex;
  align-items: center;
`;

const FeaturedMoney = styled.span`
  font-size: 30px;
  font-weight: bold;
  color: #333;
`;

const FeaturedMoneyRate = styled.span.withConfig({
  shouldForwardProp: prop => prop !== 'negative',
})`
  display: flex;
  align-items: center;
  margin-left: 20px;
  color: ${props => (props.negative ? 'red' : 'green')};
`;

const FeaturedIcon = styled.span.withConfig({
  shouldForwardProp: prop => prop !== 'negative',
})`
  font-size: 14px;
  margin-left: 5px;
  color: ${props => (props.negative ? 'red' : 'green')};
`;

const FeaturedSub = styled.span`
  font-size: 15px;
  color: gray;
`;

const ChartsContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const monthNames = [
  '',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const Dashboard = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenueChange, setRevenueChange] = useState(0);

  const [taxData, setTaxData] = useState({
    currentMonthTax: 0,
    lastMonthTax: 0,
    taxChange: 0,
    allTimeTax: 0,
  });

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to calculate both revenue and tax totals from orders
  const calculateDashboardData = (orders) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Initialize counters
    let currentMonthRevenue = 0;
    let lastMonthRevenue = 0;
    let currentMonthTax = 0;
    let lastMonthTax = 0;
    let allTimeTax = 0;

    // Group orders by month for chart data
    const monthlyData = {};

    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const month = orderDate.getMonth() + 1; // getMonth() returns 0-11, we need 1-12
      const year = orderDate.getFullYear();
      const orderTotal = order.total || 0;
      const orderTax = order.tax || 0;

      allTimeTax += orderTax;

      // Initialize month data if not exists
      if (!monthlyData[month]) {
        monthlyData[month] = { totalSales: 0, totalTax: 0 };
      }
      monthlyData[month].totalSales += orderTotal;
      monthlyData[month].totalTax += orderTax;

      // Current month
      if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
        currentMonthRevenue += orderTotal;
        currentMonthTax += orderTax;
      }

      // Last month
      if (orderDate.getMonth() === lastMonth && orderDate.getFullYear() === lastYear) {
        lastMonthRevenue += orderTotal;
        lastMonthTax += orderTax;
      }
    });

    // Calculate percentage changes
    const revenueChange = lastMonthRevenue > 0 ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;
    const taxChange = lastMonthTax > 0 ? ((currentMonthTax - lastMonthTax) / lastMonthTax) * 100 : 0;

    // Convert monthly data to array format for chart
    const incomeData = Object.entries(monthlyData)
      .map(([month, data]) => ({
        _id: parseInt(month),
        totalSales: data.totalSales
      }))
      .sort((a, b) => a._id - b._id);

    return {
      incomeData,
      currentMonthRevenue,
      lastMonthRevenue,
      revenueChange: parseFloat(revenueChange.toFixed(1)),
      currentMonthTax,
      lastMonthTax,
      taxChange: parseFloat(taxChange.toFixed(1)),
      allTimeTax,
    };
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch orders once and calculate both revenue and tax data
        const ordersRes = await apiFetch('/api/orders');
        if (!ordersRes.ok) throw new Error('Failed to fetch orders');
        const ordersData = await ordersRes.json();
        const orders = ordersData.orders || ordersData;
        
        // Calculate both revenue and tax data from orders
        const dashboardData = calculateDashboardData(orders);
        
        // Set income data for chart
        setIncomeData(
          dashboardData.incomeData.map(d => ({
            month: monthNames[d._id],
            value: d.totalSales,
          }))
        );

        // Set revenue data
        setTotalRevenue(dashboardData.currentMonthRevenue);
        setRevenueChange(dashboardData.revenueChange);

        // Set tax data
        setTaxData({
          currentMonthTax: dashboardData.currentMonthTax,
          lastMonthTax: dashboardData.lastMonthTax,
          taxChange: dashboardData.taxChange,
          allTimeTax: dashboardData.allTimeTax,
        });

        // Fetch summary stats
        const statsRes = await apiFetch('/api/admin/summary');
        if (!statsRes.ok) throw new Error('Failed to fetch summary stats');
        const statsData = await statsRes.json();
        setStats(statsData);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div>Loading dashboard data...</div>;
  if (error) return <div>Error loading dashboard: {error}</div>;

  return (
    <DashboardContainer>
      <DashboardWrapper>
        <FeaturedGrid>
          <FeaturedItem>
            <FeaturedTitle>Total Revenue</FeaturedTitle>
            <FeaturedMoneyContainer>
              <FeaturedMoney>${totalRevenue.toFixed(2)}</FeaturedMoney>
              <FeaturedMoneyRate negative={revenueChange < 0}>
                {revenueChange > 0 ? '+' : ''}
                {revenueChange}%{' '}
                <FeaturedIcon negative={revenueChange < 0}>
                  {revenueChange < 0 ? '📉' : '📈'}
                </FeaturedIcon>
              </FeaturedMoneyRate>
            </FeaturedMoneyContainer>
            <FeaturedSub>Compared to last month</FeaturedSub>
          </FeaturedItem>

          <FeaturedItem>
            <FeaturedTitle>Tax Collected</FeaturedTitle>
            <FeaturedMoneyContainer>
              <FeaturedMoney>${taxData.currentMonthTax.toFixed(2)}</FeaturedMoney>
              <FeaturedMoneyRate negative={taxData.taxChange < 0}>
                {taxData.taxChange > 0 ? '+' : ''}
                {taxData.taxChange}%{' '}
                <FeaturedIcon negative={taxData.taxChange < 0}>
                  {taxData.taxChange < 0 ? '📉' : '📈'}
                </FeaturedIcon>
              </FeaturedMoneyRate>
            </FeaturedMoneyContainer>
            <FeaturedSub>This month's tax collection</FeaturedSub>
          </FeaturedItem>

          <FeaturedItem>
            <FeaturedTitle>Total Orders</FeaturedTitle>
            <FeaturedMoneyContainer>
              <FeaturedMoney>{stats.totalOrders}</FeaturedMoney>
            </FeaturedMoneyContainer>
            <FeaturedSub>All time orders count</FeaturedSub>
          </FeaturedItem>

          <FeaturedItem>
            <FeaturedTitle>Total Products</FeaturedTitle>
            <FeaturedMoneyContainer>
              <FeaturedMoney>{stats.totalProducts}</FeaturedMoney>
            </FeaturedMoneyContainer>
            <FeaturedSub>All available products</FeaturedSub>
          </FeaturedItem>

          <FeaturedItem>
            <FeaturedTitle>Total Customers</FeaturedTitle>
            <FeaturedMoneyContainer>
              <FeaturedMoney>{stats.totalUsers}</FeaturedMoney>
            </FeaturedMoneyContainer>
            <FeaturedSub>All registered customers</FeaturedSub>
          </FeaturedItem>
        </FeaturedGrid>

        <ChartsContainer>
          <LineChart title="Sales Overview" data={incomeData} />
        </ChartsContainer>
      </DashboardWrapper>
    </DashboardContainer>
  );
};

export default Dashboard;

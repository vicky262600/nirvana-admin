import React from 'react';
import styled from 'styled-components';

const ChartContainer = styled.div`
  flex: 1;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  background-color: white;
`;

const ChartTitle = styled.h3`
  margin-bottom: 20px;
  color: #333;
  font-size: 18px;
`;

const SVG = styled.svg`
  width: 100%;
  height: 200px;
`;

const Line = styled.path`
  fill: none;
  stroke: #7451f8;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const Area = styled.path`
  fill: url(#gradient);
  opacity: 0.3;
`;

const GridLine = styled.line`
  stroke: #e0e0e0;
  stroke-width: 1;
`;

const DataPoint = styled.circle`
  fill: #7451f8;
  stroke: white;
  stroke-width: 2;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    fill: #5b3fd8;
    r: 6;
  }
`;

const LineChart = ({ data = [], title = "Line Chart" }) => {
  const fallbackData = [
    { month: 'Jan', value: 12 },
    { month: 'Feb', value: 100},
    { month: 'Mar', value: 80 },
    { month: 'Apr', value: 37 },
    { month: 'May', value: 69},
    { month: 'Jun', value: 66},
  ];

  const rawData = data.length > 0 ? data : fallbackData;

  // Clean and validate data
  const chartData = rawData.filter(
    d => d && typeof d.value === 'number' && !isNaN(d.value) && isFinite(d.value)
  );

  // If chartData is still empty, provide a safe backup
  const finalData = chartData.length > 0 ? chartData : fallbackData;

  // Additional safety check - ensure we have at least 2 data points for a line
  if (finalData.length < 2) {
    return (
      <ChartContainer>
        <ChartTitle>{title}</ChartTitle>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '200px',
          color: '#666',
          fontSize: '14px'
        }}>
          Insufficient data to display chart
        </div>
      </ChartContainer>
    );
  }

  const width = 800;
  const height = 200;
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const values = finalData.map(d => d.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const valueRange = maxValue === minValue ? 1 : maxValue - minValue;

  const xScale = (index) => {
    if (isNaN(index) || finalData.length <= 1) return margin.left;
    return margin.left + (index / (finalData.length - 1)) * chartWidth;
  };

  const yScale = (value) => {
    if (isNaN(value) || valueRange === 0) return margin.top + chartHeight / 2;
    return margin.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;
  };

  const linePath = finalData.map((d, i) => {
    const x = xScale(i);
    const y = yScale(d.value);
    // Ensure we have valid numbers
    if (isNaN(x) || isNaN(y)) {
      return i === 0 ? `M ${margin.left} ${margin.top + chartHeight / 2}` : '';
    }
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).filter(segment => segment !== '').join(' ');

  const areaPath = finalData.map((d, i) => {
    const x = xScale(i);
    const y = yScale(d.value);
    // Ensure we have valid numbers
    if (isNaN(x) || isNaN(y)) {
      return i === 0 ? `M ${margin.left} ${margin.top + chartHeight / 2}` : '';
    }
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).filter(segment => segment !== '').join(' ') +
    ` L ${xScale(finalData.length - 1)} ${margin.top + chartHeight}` +
    ` L ${xScale(0)} ${margin.top + chartHeight} Z`;

  const gridLines = [];
  for (let i = 0; i <= 4; i++) {
    const y = margin.top + (i / 4) * chartHeight;
    gridLines.push(
      <GridLine key={i} x1={margin.left} y1={y} x2={margin.left + chartWidth} y2={y} />
    );
  }

  return (
    <ChartContainer>
      <ChartTitle>{title}</ChartTitle>
      <SVG viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7451f8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7451f8" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Grid */}
        {gridLines}

        {/* Area */}
        <Area d={areaPath} />

        {/* Line */}
        <Line d={linePath} />

        {/* Data points */}
        {finalData.map((d, i) => {
          const x = xScale(i);
          const y = yScale(d.value);
          // Only render data points with valid coordinates
          if (isNaN(x) || isNaN(y)) return null;
          return (
            <DataPoint
              key={i}
              cx={x}
              cy={y}
              r={4}
              data-value={d.value}
              data-month={d.month}
            />
          );
        })}

        {/* X-axis labels */}
        {finalData.map((d, i) => {
          const x = xScale(i);
          // Only render labels with valid coordinates
          if (isNaN(x)) return null;
          return (
            <text
              key={i}
              x={x}
              y={height - 10}
              textAnchor="middle"
              fontSize="10"
              fill="#666"
            >
              {d.month}
            </text>
          );
        })}
      </SVG>
    </ChartContainer>
  );
};

export default LineChart;

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

const Tooltip = styled.div`
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  pointer-events: none;
  z-index: 10;
  display: ${props => props.show ? 'block' : 'none'};
`;

const LineChart = ({ data = [], title = "Line Chart" }) => {
  // Sample data if none provided
  const chartData = data.length > 0 ? data : [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 78 },
    { month: 'Mar', value: 90 },
    { month: 'Apr', value: 81 },
    { month: 'May', value: 95 },
    { month: 'Jun', value: 88 },
    { month: 'Jul', value: 92 },
    { month: 'Aug', value: 85 },
    { month: 'Sep', value: 98 },
    { month: 'Oct', value: 87 },
    { month: 'Nov', value: 93 },
    { month: 'Dec', value: 89 }
  ];

  const width = 800;
  const height = 200;
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const maxValue = Math.max(...chartData.map(d => d.value));
  const minValue = Math.min(...chartData.map(d => d.value));
  const valueRange = maxValue - minValue;

  const xScale = (index) => margin.left + (index / (chartData.length - 1)) * chartWidth;
  const yScale = (value) => margin.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;

  // Create path for the line
  const linePath = chartData.map((d, i) => {
    const x = xScale(i);
    const y = yScale(d.value);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Create path for the area
  const areaPath = chartData.map((d, i) => {
    const x = xScale(i);
    const y = yScale(d.value);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ') + ` L ${xScale(chartData.length - 1)} ${margin.top + chartHeight} L ${xScale(0)} ${margin.top + chartHeight} Z`;

  // Create grid lines
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
        
        {/* Grid lines */}
        {gridLines}
        
        {/* Area under the line */}
        <Area d={areaPath} />
        
        {/* Line */}
        <Line d={linePath} />
        
        {/* Data points */}
        {chartData.map((d, i) => (
          <DataPoint
            key={i}
            cx={xScale(i)}
            cy={yScale(d.value)}
            r="4"
            data-value={d.value}
            data-month={d.month}
          />
        ))}
        
        {/* X-axis labels */}
        {chartData.map((d, i) => (
          <text
            key={i}
            x={xScale(i)}
            y={height - 10}
            textAnchor="middle"
            fontSize="10"
            fill="#666"
          >
            {d.month}
          </text>
        ))}
      </SVG>
    </ChartContainer>
  );
};

export default LineChart; 
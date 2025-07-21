import React from 'react';
import styled from 'styled-components';
import LineChart from '../components/LineChart';

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
  margin: 0px 20px;
  padding: 30px;
  border-radius: 10px;
  cursor: pointer;
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
  margin: 10px 0px;
  display: flex;
  align-items: center;
`;

const FeaturedMoney = styled.span`
  font-size: 30px;
  font-weight: bold;
  color: #333;
`;

const FeaturedMoneyRate = styled.span`
  display: flex;
  align-items: center;
  margin-left: 20px;
  color: ${props => props.negative ? 'red' : 'green'};
`;

const FeaturedIcon = styled.span`
  font-size: 14px;
  margin-left: 5px;
  color: ${props => props.negative ? 'red' : 'green'};
`;

const FeaturedSub = styled.span`
  font-size: 15px;
  color: gray;
`;

const ChartsContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const Dashboard = () => {
  return (
    <DashboardContainer>
      <DashboardWrapper>
        <FeaturedGrid>
          <FeaturedItem>
            <FeaturedTitle>Total Revenue</FeaturedTitle>
            <FeaturedMoneyContainer>
              <FeaturedMoney>$2,415</FeaturedMoney>
              <FeaturedMoneyRate>
                +12.5% <FeaturedIcon>📈</FeaturedIcon>
              </FeaturedMoneyRate>
            </FeaturedMoneyContainer>
            <FeaturedSub>Compared to last month</FeaturedSub>
          </FeaturedItem>
          
          <FeaturedItem>
            <FeaturedTitle>Orders</FeaturedTitle>
            <FeaturedMoneyContainer>
              <FeaturedMoney>1,234</FeaturedMoney>
              <FeaturedMoneyRate>
                +12.5% <FeaturedIcon>📈</FeaturedIcon>
              </FeaturedMoneyRate>
            </FeaturedMoneyContainer>
            <FeaturedSub>Compared to last month</FeaturedSub>
          </FeaturedItem>
          
          <FeaturedItem>
            <FeaturedTitle>Products</FeaturedTitle>
            <FeaturedMoneyContainer>
              <FeaturedMoney>567</FeaturedMoney>
              <FeaturedMoneyRate>
                +5.2% <FeaturedIcon>📈</FeaturedIcon>
              </FeaturedMoneyRate>
            </FeaturedMoneyContainer>
            <FeaturedSub>Compared to last month</FeaturedSub>
          </FeaturedItem>
          
          <FeaturedItem>
            <FeaturedTitle>Customers</FeaturedTitle>
            <FeaturedMoneyContainer>
              <FeaturedMoney>890</FeaturedMoney>
              <FeaturedMoneyRate negative>
                -2.1% <FeaturedIcon negative>📉</FeaturedIcon>
              </FeaturedMoneyRate>
            </FeaturedMoneyContainer>
            <FeaturedSub>Compared to last month</FeaturedSub>
          </FeaturedItem>
        </FeaturedGrid>
        
        <ChartsContainer>
          <LineChart 
            title="Sales Overview"
            data={[
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
            ]}
          />
        </ChartsContainer>
      </DashboardWrapper>
    </DashboardContainer>
  );
};

export default Dashboard; 
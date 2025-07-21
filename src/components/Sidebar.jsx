import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";

const SidebarContainer = styled.div`
  width: 250px;
  height: calc(100vh - 50px);
  background-color: rgb(251, 251, 255);
  position: sticky;
  top: 50px;
`;

const SidebarWrapper = styled.div`
  padding: 15px;
  color: #555;
  height: 100%;
  overflow-y: auto;
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const SidebarMenu = styled.div`
  margin-bottom: 8px;
`;

const SidebarTitle = styled.h3`
  font-size: 12px;
  color: rgb(187, 186, 186);
  margin-bottom: 6px;
`;

const SidebarList = styled.ul`
  list-style: none;
  padding: 3px;
`;

const SidebarListItem = styled.li`
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 8px;
  margin-bottom: 1px;
  font-size: 14px;

  &:hover {
    background-color: rgb(240, 240, 255);
  }

  &.active {
    background-color: rgb(240, 240, 255);
  }
`;

const SidebarIcon = styled.span`
  margin-right: 8px;
  font-size: 18px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <SidebarContainer>
      <SidebarWrapper>
        <SidebarMenu>
          <SidebarList>
            <StyledLink to="/dashboard">
              <SidebarListItem className={currentPath === "/dashboard" ? "active" : ""}>
                <SidebarIcon>🏠</SidebarIcon>
                Dashboard
              </SidebarListItem>
            </StyledLink>
            <StyledLink to="/products">
              <SidebarListItem className={currentPath === "/products" ? "active" : ""}>
                <SidebarIcon>🛍️</SidebarIcon>
                Products
              </SidebarListItem>
            </StyledLink>
            <StyledLink to="/orders">
              <SidebarListItem className={currentPath === "/orders" ? "active" : ""}>
                <SidebarIcon>📦</SidebarIcon>
                Orders
              </SidebarListItem>
            </StyledLink>
            <StyledLink to="/customers">
              <SidebarListItem className={currentPath === "/customers" ? "active" : ""}>
                <SidebarIcon>👥</SidebarIcon>
                Customers
              </SidebarListItem>
            </StyledLink>
            <StyledLink to="/analytics">
              <SidebarListItem className={currentPath === "/analytics" ? "active" : ""}>
                <SidebarIcon>📊</SidebarIcon>
                Analytics
              </SidebarListItem>
            </StyledLink>
            <StyledLink to="/settings">
              <SidebarListItem className={currentPath === "/settings" ? "active" : ""}>
                <SidebarIcon>⚙️</SidebarIcon>
                Settings
              </SidebarListItem>
            </StyledLink>
          </SidebarList>
        </SidebarMenu>
      </SidebarWrapper>
    </SidebarContainer>
  );
} 
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { apiFetch } from "../utils/apiClient";

const CustomersContainer = styled.div`
  flex: 4;
  padding: 20px;
`;

const TableWrapper = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 900px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin-bottom: 8px;
`;

const SubTitle = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
`;

const SearchContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 12px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const SearchButton = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  background: #7451f8;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  &:disabled {
    background: #999;
    cursor: not-allowed;
  }
`;

const CustomersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 8px;
  background: #f3f4f6;
  color: #374151;
  font-size: 14px;
  font-weight: 700;
`;

const Td = styled.td`
  padding: 12px 8px;
  font-size: 14px;
  border-bottom: 1px solid #e5e7eb;
`;

const AdminBadge = styled.span`
  background: ${({ isAdmin }) => (isAdmin ? "#7451f8" : "#e5e7eb")};
  color: ${({ isAdmin }) => (isAdmin ? "white" : "#374151")};
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
`;

const Customers = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);

  // Load last 20 users initially
  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers(search = "") {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      if (search) query.append("search", search);
      query.append("limit", "20");

      const res = await apiFetch(`/api/users?${query.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      setUsers(data.users);
      setTotalUsers(data.totalUsers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = () => {
    setSearching(true);
    fetchUsers(searchTerm).then(() => setSearching(false));
  };

  return (
    <CustomersContainer>
      <TableWrapper>
        <Title>Customers</Title>
        <SubTitle>Total Users: {totalUsers}</SubTitle>

        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <SearchButton onClick={handleSearch} disabled={searching}>
            {searching ? "Searching..." : "Search"}
          </SearchButton>
        </SearchContainer>

        {loading ? (
          <div>Loading customers...</div>
        ) : error ? (
          <div>Error loading customers: {error}</div>
        ) : (
          <CustomersTable>
            <thead>
              <tr>
                <Th>User ID</Th>
                <Th>First Name</Th>
                <Th>Last Name</Th>
                <Th>Email</Th>
                <Th>Is Admin</Th>
                <Th>Registered</Th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <Td>{user._id}</Td>
                  <Td>{user.firstName}</Td>
                  <Td>{user.lastName}</Td>
                  <Td>{user.email}</Td>
                  <Td>
                    <AdminBadge isAdmin={user.isAdmin}>
                      {user.isAdmin ? "Yes" : "No"}
                    </AdminBadge>
                  </Td>
                  <Td>{new Date(user.createdAt).toLocaleDateString()}</Td>
                </tr>
              ))}
            </tbody>
          </CustomersTable>
        )}
      </TableWrapper>
    </CustomersContainer>
  );
};

export default Customers;

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { apiFetch } from '../utils/apiClient';

const statusOptions = ['pending', 'shipped', 'delivered', 'cancelled'];

const OrdersContainer = styled.div`
  flex: 4;
  padding: 20px;
`;

const TableWrapper = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin-bottom: 24px;
`;

const SearchContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 12px;
  max-width: 600px;
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

const OrdersTable = styled.table`
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

const ExpandButton = styled.button`
  background: #7451f8;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
  &:hover {
    background: #5b3fd8;
  }
`;

const ItemsRow = styled.tr`
  background: #f9fafb;
`;

const ItemsCell = styled.td`
  padding: 16px 8px;
  border-bottom: 1px solid #e5e7eb;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatusBadge = styled.span`
  background: ${({ status }) =>
    status === 'pending' ? '#fbbf24' :
    status === 'shipped' ? '#3b82f6' :
    status === 'delivered' ? '#10b981' :
    status === 'cancelled' ? '#ef4444' :
    '#e5e7eb'};
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
`;

const StatusSelect = styled.select`
  background: #f3f4f6;
  color: #374151;
  border: 1.5px solid #e5e7eb;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 13px;
  font-weight: 600;
  outline: none;
  margin-right: 8px;
`;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);

  // Fetch orders, optionally filtered by search term
  async function fetchOrders(search = '') {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);

      const res = await apiFetch(`/api/orders?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setOrders(data.orders || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleExpand = (orderId) => {
    setExpanded(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await apiFetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update status');

      setOrders(prev => prev.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleSearch = () => {
    setSearching(true);
    fetchOrders(searchTerm);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error loading orders: {error}</div>;

  return (
    <OrdersContainer>
      <TableWrapper>
        <Title>Orders</Title>

        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search orders by email, name or order ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <SearchButton onClick={handleSearch} disabled={searching}>
            {searching ? 'Searching...' : 'Search'}
          </SearchButton>
        </SearchContainer>

        <OrdersTable>
          <thead>
            <tr>
              <Th>Order ID</Th>
              <Th>User ID</Th>
              <Th>Shipping Name</Th>
              <Th>Email</Th>
              <Th>Total</Th>
              <Th>Status</Th>
              <Th>Created</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <React.Fragment key={order._id}>
                <tr>
                  <Td>{order._id}</Td>
                  <Td>{order.userId}</Td>
                  <Td>{order.shippingInfo.firstName} {order.shippingInfo.lastName}</Td>
                  <Td>{order.shippingInfo.email}</Td>
                  <Td>${order.total.toFixed(2)}</Td>
                  <Td>
                    <StatusSelect
                      value={order.status}
                      onChange={e => handleStatusChange(order._id, e.target.value)}
                    >
                      {statusOptions.map(opt => (
                        <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                      ))}
                    </StatusSelect>
                    <StatusBadge status={order.status}>{order.status}</StatusBadge>
                  </Td>
                  <Td>{new Date(order.createdAt).toLocaleString()}</Td>
                  <Td>
                    <ExpandButton onClick={() => toggleExpand(order._id)}>
                      {expanded[order._id] ? 'Hide Items' : 'Show Items'}
                    </ExpandButton>
                  </Td>
                </tr>
                {expanded[order._id] && (
                  <ItemsRow>
                    <ItemsCell colSpan={8}>
                      <div style={{ marginBottom: '16px', background: '#f3f4f6', borderRadius: '8px', padding: '16px' }}>
                        <div><strong>Shipping Info</strong></div>
                        <div>Name: {order.shippingInfo.firstName} {order.shippingInfo.lastName}</div>
                        <div>Email: {order.shippingInfo.email}</div>
                        <div>Address: {order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}, {order.shippingInfo.country || '-'}</div>
                      </div>
                      <ItemList>
                        {order.items.map((item, idx) => (
                          <Item key={idx}>
                            <ItemImage src={item.image} alt={item.name} />
                            <ItemInfo>
                              <div><strong>{item.name}</strong></div>
                              <div>Price: ${item.price.toFixed(2)}</div>
                              <div>Size: {item.selectedSize || '-'}</div>
                              <div>Color: {item.selectedColor || '-'}</div>
                              <div>Quantity: {item.selectedQuantity}</div>
                            </ItemInfo>
                          </Item>
                        ))}
                      </ItemList>
                    </ItemsCell>
                  </ItemsRow>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </OrdersTable>
      </TableWrapper>
    </OrdersContainer>
  );
};

export default Orders;

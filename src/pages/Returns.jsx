import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { apiFetch } from '../utils/apiClient';

const ReturnsContainer = styled.div`
  flex: 4;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin: 0;
`;

const ControlsRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 8px;
  flex: 1;
  max-width: 400px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;
  &:focus {
    border-color: #7451f8;
    box-shadow: 0 0 0 3px rgba(116, 81, 248, 0.1);
  }
`;

const FilterSelect = styled.select`
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  outline: none;
  min-width: 120px;
  &:focus {
    border-color: #7451f8;
    box-shadow: 0 0 0 3px rgba(116, 81, 248, 0.1);
  }
`;

const TableWrapper = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ReturnsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 16px 12px;
  background: #f9fafb;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
`;

const Td = styled.td`
  padding: 16px 12px;
  font-size: 14px;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: top;
`;

const StatusBadge = styled.span`
  background: ${({ status }) =>
    status === 'pending' ? '#fbbf24' :
    status === 'approved' ? '#10b981' :
    status === 'rejected' ? '#ef4444' :
    status === 'refunded' ? '#3b82f6' :
    '#e5e7eb'};
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
`;

const ActionButton = styled.button`
  background: ${({ action }) => action === 'approve' ? '#10b981' : '#ef4444'};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 8px;
  &:hover {
    background: ${({ action }) => action === 'approve' ? '#059669' : '#dc2626'};
    transform: translateY(-1px);
  }
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
`;

const ViewButton = styled.button`
  background: #7451f8;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: #5b3fd8;
    transform: translateY(-1px);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  color: #333;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  &:hover {
    color: #374151;
  }
`;

const ModalSection = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  color: #374151;
  margin-bottom: 12px;
  font-weight: 600;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoLabel = styled.span`
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
  text-transform: uppercase;
  font-weight: 500;
`;

const InfoValue = styled.span`
  font-size: 14px;
  color: #374151;
  font-weight: 500;
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ItemCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  background: #f9fafb;
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const ItemTitle = styled.h4`
  font-size: 14px;
  color: #374151;
  margin: 0;
  font-weight: 600;
`;

const ItemPrice = styled.span`
  font-size: 14px;
  color: #059669;
  font-weight: 600;
`;

const ItemDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
  font-size: 13px;
  color: #6b7280;
`;

const RefundSection = styled.div`
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 20px;
  margin-top: 24px;
`;

const RefundSlider = styled.div`
  margin-bottom: 16px;
`;

const SliderLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const Slider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e5e7eb;
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #7451f8;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #7451f8;
    cursor: pointer;
    border: none;
  }
`;

const RefundAmount = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #059669;
  text-align: center;
  margin-bottom: 16px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  outline: none;
  &:focus {
    border-color: #7451f8;
    box-shadow: 0 0 0 3px rgba(116, 81, 248, 0.1);
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 16px;
  color: #6b7280;
`;

const ErrorMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 16px;
  color: #ef4444;
  background: #fef2f2;
  border-radius: 8px;
  margin: 20px 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
`;

const Notification = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 16px 20px;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  z-index: 1001;
  animation: slideIn 0.3s ease;
  
  ${({ type }) => type === 'success' ? `
    background: #10b981;
  ` : `
    background: #ef4444;
  `}
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const Returns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState({});
  
  // Filters and search
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [refundPercentage, setRefundPercentage] = useState(100);
  const [refundReason, setRefundReason] = useState('');
  
  // Notifications
  const [notification, setNotification] = useState(null);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Fetch return requests
  const fetchReturns = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);

      // Use the correct API endpoint
      const apiUrl = `/api/returns?${params.toString()}`;
      console.log('Fetching from API endpoint:', apiUrl);
      
      const res = await apiFetch(apiUrl);
      
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      console.log('API Response:', data); // Debug log
      
      // Ensure we always set an array
      let returnsArray = [];
      
      if (Array.isArray(data.returns)) {
        returnsArray = data.returns;
      } else if (Array.isArray(data.requests)) {
        returnsArray = data.requests; // Your API returns data in 'requests' field
      } else if (Array.isArray(data)) {
        returnsArray = data;
      } else if (data && typeof data === 'object') {
        // If data is an object, check for common field names
        if (Array.isArray(data.returnRequests)) {
          returnsArray = data.returnRequests;
        } else if (Array.isArray(data.return_requests)) {
          returnsArray = data.return_requests;
        } else if (Array.isArray(data.data)) {
          returnsArray = data.data;
        }
      }
      
      console.log('Processed returns array:', returnsArray); // Debug log
      console.log('Number of requests found:', returnsArray.length);
      if (returnsArray.length > 0) {
        console.log('First request sample:', JSON.stringify(returnsArray[0], null, 2));
        console.log('First request keys:', Object.keys(returnsArray[0]));
      }
      setReturns(returnsArray);
    } catch (err) {
      console.log('API Error Details:', {
        message: err.message,
        stack: err.stack,
        status: err.status
      });
      setError(err.message);
      setReturns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, [statusFilter, searchTerm]);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle status filter
  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  // Manual refresh function
  const handleRefresh = () => {
    console.log('Manual refresh triggered');
    fetchReturns();
  };

  // Test API endpoint function
  const testAPIEndpoint = async () => {
    console.log('=== API TEST START ===');
    console.log('Current window location:', window.location.origin);
    console.log('Testing /api/returns endpoint...');
    console.log('Testing /api/returns endpoint...');
    
    try {
      console.log('Making request to /api/returns...');
      const res = await apiFetch('/api/returns');
      
      console.log('Response status:', res.status);
      console.log('Response headers:', Object.fromEntries(res.headers.entries()));
      
      if (res.ok) {
        const data = await res.json();
        console.log('API Response data:', data);
        console.log('Data type:', typeof data);
        console.log('Is array:', Array.isArray(data));
        console.log('Data keys (if object):', data && typeof data === 'object' ? Object.keys(data) : 'N/A');
        console.log('Number of items:', Array.isArray(data) ? data.length : 'Not an array');
      } else {
        const errorText = await res.text();
        console.log('Error response:', errorText);
      }
    } catch (error) {
      console.log('Fetch error:', error.message);
      console.log('Error details:', error);
    }
    console.log('=== API TEST END ===');
  };

  // Open modal with return details
  const openModal = (returnRequest) => {
    setSelectedReturn(returnRequest);
    setRefundPercentage(returnRequest.refundPercentage || 100);
    setRefundReason(returnRequest.refundReason || '');
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedReturn(null);
    setRefundPercentage(100);
    setRefundReason('');
  };

  // Calculate total refund amount
  const calculateRefundAmount = () => {
    if (!selectedReturn) return 0;
    const totalItemValue = selectedReturn.items.reduce((sum, item) => {
      return sum + (item.price * item.returnQuantity);
    }, 0);
    return (totalItemValue * refundPercentage) / 100;
  };

  // Process return (approve/reject)
  const processReturn = async (action) => {
    if (!selectedReturn) return;
    
    setProcessing(prev => ({ ...prev, [selectedReturn._id]: true }));
    
    try {
      const response = await apiFetch(`/api/returns/${selectedReturn._id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          action,
          refundPercentage: action === 'approve' ? refundPercentage : 0,
          refundReason: refundReason.trim() || undefined
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${action} return request`);
      }

      const result = await response.json();
      console.log('API Response:', result);

      // Update the return request status in the local state
      setReturns(prev => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return prevArray.map(ret =>
          ret._id === selectedReturn._id 
            ? { 
                ...ret, 
                status: action === 'approve' ? 'refunded' : 'rejected',
                refundPercentage: action === 'approve' ? refundPercentage : 0,
                refundReason: refundReason.trim() || undefined,
                refundAmount: action === 'approve' ? (result.refundAmount || calculateRefundAmount()) : 0
              } 
            : ret
        );
      });
      
      // Show detailed success message
      if (action === 'approve') {
        showNotification(
          `Return approved! Refunded $${result.refundAmount?.toFixed(2) || calculateRefundAmount().toFixed(2)} (${refundPercentage}%)`, 
          'success'
        );
      } else {
        showNotification(`Return request rejected successfully!`, 'success');
      }
      closeModal();
    } catch (err) {
      console.log('API Error:', err.message);
      
      // Show specific error message
      if (err.message.includes('No payment ID found')) {
        showNotification('Error: No payment information found for this order', 'error');
      } else if (err.message.includes('Invalid refund amount')) {
        showNotification('Error: Invalid refund amount calculated', 'error');
      } else if (err.message.includes('Request not found')) {
        showNotification('Error: Return request not found', 'error');
      } else if (err.message.includes('Order not found')) {
        showNotification('Error: Associated order not found', 'error');
      } else {
        showNotification(`Error: ${err.message}`, 'error');
      }
    } finally {
      setProcessing(prev => ({ ...prev, [selectedReturn._id]: false }));
    }
  };

  if (loading) return <LoadingSpinner>Loading return requests...</LoadingSpinner>;
  if (error) return <ErrorMessage>Error loading return requests: {error}</ErrorMessage>;

  // Ensure returns is always an array
  const returnsArray = Array.isArray(returns) ? returns : [];

  // Debug information
  console.log('Current state:', {
    returns: returns,
    returnsArray: returnsArray,
    loading: loading,
    error: error,
    statusFilter: statusFilter,
    searchTerm: searchTerm
  });

  return (
    <ReturnsContainer>
      <Header>
        <Title>Return Payment Management</Title>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={handleRefresh}
            style={{
              background: '#7451f8',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Refresh
          </button>
          <button 
            onClick={testAPIEndpoint}
            style={{
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Test API
          </button>
        </div>
      </Header>

      <ControlsRow>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search by customer name or order ID..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </SearchContainer>
        
        <FilterSelect value={statusFilter} onChange={handleStatusFilter}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="refunded">Refunded</option>
        </FilterSelect>
      </ControlsRow>

      <TableWrapper>
        <ReturnsTable>
          <thead>
            <tr>
              <Th>Return ID</Th>
              <Th>Order ID</Th>
              <Th>Customer</Th>
              <Th>Items</Th>
              <Th>Reason</Th>
              <Th>Status</Th>
              <Th>Refund Amount</Th>
              <Th>Created</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {returnsArray.map(returnRequest => {
              // Safely extract data with fallbacks based on your ReturnRequest model
              const id = returnRequest._id || 'N/A';
              
              // Handle orderId - could be ObjectId string or populated order object
              const orderId = typeof returnRequest.orderId === 'object' && returnRequest.orderId?._id 
                ? returnRequest.orderId._id 
                : returnRequest.orderId || 'N/A';
              
              // Handle userId - could be ObjectId string or populated user object
              const customerName = returnRequest.userId?.name || 
                                 returnRequest.userId?.firstName + ' ' + returnRequest.userId?.lastName ||
                                 'N/A';
              const customerEmail = returnRequest.userId?.email || 'N/A';
              
              // Return request specific fields
              const items = returnRequest.items || [];
              const reason = returnRequest.reason || 'N/A';
              const description = returnRequest.description || '';
              const status = returnRequest.status || 'pending';
              const refundPercentage = returnRequest.refundPercentage || 0;
              const refundAmount = returnRequest.refundAmount || 0;
              const refundReason = returnRequest.refundReason || '';
              const returnTrackingNumber = returnRequest.returnTrackingNumber || '';
              const createdAt = returnRequest.createdAt || new Date();

              return (
                <tr key={id}>
                  <Td>{id}</Td>
                  <Td>{orderId}</Td>
                  <Td>
                    <div>
                      <div style={{ fontWeight: 600 }}>{customerName}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {customerEmail}
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <div style={{ fontSize: '12px' }}>
                      {items.length || 0} item(s)
                    </div>
                  </Td>
                  <Td>
                    <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {reason}
                    </div>
                  </Td>
                  <Td>
                    <StatusBadge status={status}>
                      {status}
                    </StatusBadge>
                  </Td>
                  <Td>
                    {refundAmount > 0 ? (
                      <span style={{ color: '#059669', fontWeight: 600 }}>
                        ${Number(refundAmount).toFixed(2)}
                      </span>
                    ) : (
                      <span style={{ color: '#6b7280' }}>-</span>
                    )}
                  </Td>
                  <Td>
                    <div style={{ fontSize: '12px' }}>
                      {new Date(createdAt).toLocaleDateString()}
                    </div>
                  </Td>
                  <Td>
                    <ViewButton onClick={() => openModal(returnRequest)}>
                      View Details
                    </ViewButton>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </ReturnsTable>
        
        {returnsArray.length === 0 && !loading && (
          <EmptyState>
            <div style={{ fontSize: '18px', marginBottom: '8px' }}>No return requests found</div>
            <div style={{ fontSize: '14px', color: '#9ca3af' }}>
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Return requests will appear here when customers submit them'
              }
            </div>
          </EmptyState>
        )}
      </TableWrapper>

      {/* Modal */}
      {showModal && selectedReturn && (
        <Modal onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Return Request Details</ModalTitle>
              <CloseButton onClick={closeModal}>&times;</CloseButton>
            </ModalHeader>

            <ModalSection>
              <SectionTitle>Customer Information</SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Customer Name</InfoLabel>
                  <InfoValue>{selectedReturn.userId?.name || selectedReturn.userId?.firstName + ' ' + selectedReturn.userId?.lastName || 'N/A'}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Email</InfoLabel>
                  <InfoValue>{selectedReturn.userId?.email || 'N/A'}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Order ID</InfoLabel>
                  <InfoValue>{typeof selectedReturn.orderId === 'object' && selectedReturn.orderId?._id ? selectedReturn.orderId._id : selectedReturn.orderId}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Status</InfoLabel>
                  <InfoValue>
                    <StatusBadge status={selectedReturn.status}>
                      {selectedReturn.status}
                    </StatusBadge>
                  </InfoValue>
                </InfoItem>
              </InfoGrid>
            </ModalSection>

            <ModalSection>
              <SectionTitle>Return Details</SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Reason</InfoLabel>
                  <InfoValue>{selectedReturn.reason}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Description</InfoLabel>
                  <InfoValue>{selectedReturn.description || 'No description provided'}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Created</InfoLabel>
                  <InfoValue>{new Date(selectedReturn.createdAt).toLocaleString()}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Tracking Number</InfoLabel>
                  <InfoValue>{selectedReturn.returnTrackingNumber || 'Not provided'}</InfoValue>
                </InfoItem>
              </InfoGrid>
            </ModalSection>

            <ModalSection>
              <SectionTitle>Items to Return</SectionTitle>
              <ItemsList>
                {selectedReturn.items?.map((item, idx) => (
                  <ItemCard key={idx}>
                    <ItemHeader>
                      <ItemTitle>{item.title}</ItemTitle>
                      <ItemPrice>${item.price.toFixed(2)}</ItemPrice>
                    </ItemHeader>
                    <ItemDetails>
                      <div>Size: {item.selectedSize || '-'}</div>
                      <div>Color: {item.selectedColor || '-'}</div>
                      <div>Quantity: {item.selectedQuantity}</div>
                      <div>Returning: {item.returnQuantity}</div>
                    </ItemDetails>
                  </ItemCard>
                ))}
              </ItemsList>
            </ModalSection>

            {selectedReturn.status === 'pending' && (
              <RefundSection>
                <SectionTitle>Process Return</SectionTitle>
                
                <RefundSlider>
                  <SliderLabel>
                    <span>Refund Percentage</span>
                    <span>{refundPercentage}%</span>
                  </SliderLabel>
                  <Slider
                    type="range"
                    min="0"
                    max="100"
                    value={refundPercentage}
                    onChange={(e) => setRefundPercentage(parseInt(e.target.value))}
                  />
                </RefundSlider>

                <RefundAmount>
                  Refund Amount: ${calculateRefundAmount().toFixed(2)}
                </RefundAmount>

                <div style={{ marginBottom: '16px' }}>
                  <InfoLabel>Admin Notes (Optional)</InfoLabel>
                  <TextArea
                    placeholder="Add notes about the refund decision..."
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                  />
                </div>

                <ModalActions>
                  <ActionButton
                    action="reject"
                    onClick={() => processReturn('reject')}
                    disabled={processing[selectedReturn._id]}
                  >
                    {processing[selectedReturn._id] ? 'Processing...' : 'Reject Return'}
                  </ActionButton>
                  <ActionButton
                    action="approve"
                    onClick={() => processReturn('approve')}
                    disabled={processing[selectedReturn._id]}
                  >
                    {processing[selectedReturn._id] ? 'Processing...' : 'Approve & Refund'}
                  </ActionButton>
                </ModalActions>
              </RefundSection>
            )}

            {selectedReturn.status !== 'pending' && (
              <ModalSection>
                <SectionTitle>Processing Details</SectionTitle>
                <InfoGrid>
                  <InfoItem>
                    <InfoLabel>Refund Percentage</InfoLabel>
                    <InfoValue>{selectedReturn.refundPercentage || 0}%</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Refund Amount</InfoLabel>
                    <InfoValue>${selectedReturn.refundAmount?.toFixed(2) || '0.00'}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Admin Notes</InfoLabel>
                    <InfoValue>{selectedReturn.refundReason || 'No notes provided'}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Return Tracking</InfoLabel>
                    <InfoValue>{selectedReturn.returnTrackingNumber || 'Not provided'}</InfoValue>
                  </InfoItem>
                </InfoGrid>
              </ModalSection>
            )}
          </ModalContent>
        </Modal>
      )}

      {/* Notification */}
      {notification && (
        <Notification type={notification.type}>
          {notification.message}
        </Notification>
      )}
    </ReturnsContainer>
  );
};

export default Returns;

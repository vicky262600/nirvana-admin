import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Orders from './pages/Orders';
import Returns from './pages/Returns';
import Customers from './pages/Customers';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';

const AdminLayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Container = styled.div`
  display: flex;
  flex: 1;
`;

const MainContent = styled.main`
  flex: 1;
  background-color: #f5f5f5;
`;

// Layout component for admin pages
function AdminLayout({ children }) {
  return (
    <AdminLayoutContainer>
      <Topbar />
      <Container>
        <Sidebar />
        <MainContent>
          {children}
        </MainContent>
      </Container>
    </AdminLayoutContainer>
  );
}

function App() {
  const admin = useSelector((state) => state.auth.currentUser?.isAdmin);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {admin ? (
          <>
            <Route path="/dashboard" element={
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            } />
            <Route path="/products" element={
              <AdminLayout>
                <Products />
              </AdminLayout>
            } />
            <Route path="/add-product" element={
              <AdminLayout>
                <AddProduct />
              </AdminLayout>
            } />
            <Route path="/products/edit/:id" element={
              <AdminLayout>
                <EditProduct />
              </AdminLayout>
            } />
            <Route path="/orders" element={
              <AdminLayout>
                <Orders />
              </AdminLayout>
            } />
            <Route path="/returns" element={
              <AdminLayout>
                <Returns />
              </AdminLayout>
            } />
            <Route path="/customers" element={
              <AdminLayout>
                <Customers />
              </AdminLayout>
            } />
            <Route path="/analytics" element={
              <AdminLayout>
                <Analytics />
              </AdminLayout>
            } />
            <Route path="/settings" element={
              <AdminLayout>
                <Settings />
              </AdminLayout>
            } />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;

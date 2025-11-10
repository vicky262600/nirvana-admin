import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/apiClient';

const ProductsContainer = styled.div`
  flex: 4;
  padding: 20px;
`;

const ProductsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin: 0;
`;

const AddButton = styled.button`
  background: #7451f8;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s ease;
  &:hover {
    background: #5b3fd8;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const ProductCard = styled.div`
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const ProductName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
`;

const ProductPrice = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const OriginalPrice = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #999;
  text-decoration: line-through;
`;

const SalePrice = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #ef4444;
`;

const RegularPrice = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #7451f8;
`;

const Badge = styled.span`
  position: absolute;
  top: 16px;
  right: ${(props) => (props.variant === 'new' ? '16px' : '80px')};
  background: ${(props) => (props.variant === 'sale' ? '#ef4444' : '#10b981')};
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
`;

const ProductCategory = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 12px;
`;

const CategoryTag = styled.span`
  background: #f0f0f0;
  color: #666;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
`;

const ProductStock = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
`;

const StockStatus = styled.span`
  color: ${(props) => (props.inStock ? '#22c55e' : '#ef4444')};
  font-size: 14px;
  font-weight: 500;
`;

const VariantsInfo = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 8px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
  &.edit {
    background: #3b82f6;
    color: white;
    &:hover {
      background: #2563eb;
    }
  }
  &.delete {
    background: #ef4444;
    color: white;
    &:hover {
      background: #dc2626;
    }
    &:disabled {
      background: #fca5a5;
      cursor: not-allowed;
    }
  }
`;

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await apiFetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = () => navigate('/add-product');
  const handleEditProduct = (productId) => navigate(`/products/edit/${productId}`);

  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    try {
      setDeletingId(productId);
      const res = await apiFetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to delete product');
      }

      setProducts((prev) => prev.filter((product) => product._id !== productId));
    } catch (error) {
      alert('Error deleting product: ' + error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const calculateTotalStock = (variants = []) => {
    return variants.reduce((total, variant) => total + (variant.quantity || 0), 0);
  };

  const getUniqueColors = (variants = []) => [...new Set(variants.map((v) => v.color))];
  const getUniqueSizes = (variants = []) => [...new Set(variants.map((v) => v.size))];

  if (loading) return <p className="p-8 text-lg">Loading products...</p>;

  return (
    <ProductsContainer>
      <ProductsWrapper>
        <Header>
          <Title>Products</Title>
          <AddButton onClick={handleAddProduct}>
            <span>➕</span> Add Product
          </AddButton>
        </Header>

        <ProductsGrid>
          {products.map((product) => {
            const totalStock = calculateTotalStock(product.variants);
            const uniqueColors = getUniqueColors(product.variants);
            const uniqueSizes = getUniqueSizes(product.variants);

            return (
              <ProductCard key={product._id}>
                {/* Badges */}
                {product.isOnSale && <Badge variant="sale">Sale</Badge>}
                {product.isNew && <Badge variant="new">New</Badge>}

                <ProductImage src={product.images?.[0] || '/no-image.png'} alt={product.title} />
                <ProductName>{product.title}</ProductName>

                <ProductPrice>
                  {product.isOnSale ? (
                    <>
                      <OriginalPrice>${product.price}</OriginalPrice>
                      <SalePrice>${product.salePrice}</SalePrice>
                    </>
                  ) : (
                    <RegularPrice>${product.price}</RegularPrice>
                  )}
                </ProductPrice>

                <ProductCategory>
                  {product.categories?.map((category, index) => (
                    <CategoryTag key={index}>{category}</CategoryTag>
                  ))}
                </ProductCategory>

                <ProductStock>
                  <StockStatus inStock={totalStock > 0}>
                    {totalStock > 0 ? `In Stock (${totalStock})` : 'Out of Stock'}
                  </StockStatus>
                </ProductStock>

                <VariantsInfo>
                  {uniqueColors.length} colors • {uniqueSizes.length} sizes
                </VariantsInfo>

                <ActionButtons>
                  <ActionButton className="edit" onClick={() => handleEditProduct(product._id)}>
                    Edit
                  </ActionButton>
                  <ActionButton
                    className="delete"
                    onClick={() => handleDeleteProduct(product._id)}
                    disabled={deletingId === product._id}
                  >
                    {deletingId === product._id ? 'Deleting...' : 'Delete'}
                  </ActionButton>
                </ActionButtons>
              </ProductCard>
            );
          })}
        </ProductsGrid>
      </ProductsWrapper>
    </ProductsContainer>
  );
};

export default Products;

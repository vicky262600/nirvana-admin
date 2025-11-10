// src/pages/AddProduct.jsx

import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase'; // adjust path
import { apiFetch } from '../utils/apiClient';

// ─── Styled Components ─────────────────────────────────────────────────────────

const AddProductContainer = styled.div`
  flex: 4;
  padding: 20px;
`;
const FormWrapper = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: auto;
`;
const Header = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 30px;
`;
const Title = styled.h1`font-size: 24px; color: #333; margin: 0;`;
const BackButton = styled.button`
  background: #6b7280; color: white; border: none; padding: 10px 20px;
  border-radius: 8px; font-size: 14px; font-weight: 600;
  cursor: pointer; display: flex; align-items: center; gap: 8px;
  &:hover { background: #4b5563; }
`;
const Form = styled.form`display: flex; flex-direction: column; gap: 24px;`;
const FormSection = styled.div`display: flex; flex-direction: column; gap: 16px;`;
const SectionTitle = styled.h3`
  font-size: 18px; color: #333; margin: 0;
  padding-bottom: 8px; border-bottom: 2px solid #f3f4f6;
`;
const FormGroup = styled.div`display: flex; flex-direction: column; gap: 8px;`;
const Label = styled.label`font-size: 14px; font-weight: 600; color: #374151;`;

const Input = styled.input`
  padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 8px;
  font-size: 14px; &:focus { outline: none; border-color: #7451f8; }
`;

const TextArea = styled.textarea`
  padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 8px;
  font-size: 14px; min-height: 100px; resize: vertical;
  &:focus { outline: none; border-color: #7451f8; }
`;

const ImageInput = styled.div`
  border: 2px dashed #d1d5db; border-radius: 8px; padding: 20px;
  text-align: center; cursor: pointer; &:hover { border-color: #7451f8; }
`;

const ImagePreview = styled.div`
  display: flex; flex-wrap: wrap; gap: 12px; margin-top: 12px;
`;
const ImagePreviewItem = styled.div`
  position: relative; width: 100px; height: 100px; border-radius: 8px; overflow: hidden;
`;
const PreviewImage = styled.img`
  width: 100%; height: 100%; object-fit: cover;
`;
const RemoveImage = styled.button`
  position: absolute; top: 4px; right: 4px; background: #ef4444; color: white;
  border: none; border-radius: 50%; width: 20px; height: 20px;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
`;

const CategoryInput = styled.div`
  display: flex; gap: 8px; flex-wrap: wrap;
`;
const CategoryTag = styled.span`
  background: #7451f8; color: white; padding: 6px 12px;
  border-radius: 20px; font-size: 12px; font-weight: 500;
  display: flex; align-items: center; gap: 6px;
`;
const RemoveCategory = styled.button`
  background: none; border: none; color: white; cursor: pointer;
  font-size: 14px; padding: 0; width: 16px; height: 16px;
`;

const CheckboxGroup = styled.div`
  display: flex; align-items: center; gap: 12px;
`;
const Checkbox = styled.input`
  width: 18px; height: 18px; accent-color: #7451f8;
`;

const VariantsSection = styled.div`
  border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px;
`;
const VariantsHeader = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 16px;
`;
const AddVariantButton = styled.button`
  background: #10b981; color: white; border: none; padding: 8px 16px;
  border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;
  &:hover { background: #059669; }
`;
const VariantsList = styled.div`display: flex; flex-direction: column; gap: 12px;`;
const VariantItem = styled.div`
  display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 12px;
  align-items: center; padding: 12px; background: #f9fafb; border-radius: 6px;
`;
const RemoveVariant = styled.button`
  background: #ef4444; color: white; border: none;
  border-radius: 4px; width: 24px; height: 24px;
  font-size: 12px; cursor: pointer;
`;

const SubmitButton = styled.button`
  background: #7451f8; color: white; border: none;
  padding: 16px 32px; border-radius: 8px; font-size: 16px;
  font-weight: 600; cursor: pointer; transition: background 0.2s ease;
  margin-top: 20px;
  &:hover { background: #5b3fd8; }
  &:disabled { background: #9ca3af; cursor: not-allowed; }
`;

// ─── Component Logic ─────────────────────────────────────────────────────────

const AddProduct = () => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categories: [],
    price: '',
    isOnSale: false,
    isNew: false,
    salePrice: '',
    variants: []
  });
  const [newCategory, setNewCategory] = useState('');
  const [newVariant, setNewVariant] = useState({ size: '', color: '', quantity: '' });

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = e => {
    const files = Array.from(e.target.files);
    setPreviewUrls(prev => [
      ...prev,
      ...files.map(f => URL.createObjectURL(f))
    ]);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeImage = index => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addCategory = () => {
    if (newCategory.trim() && !formData.categories.includes(newCategory.trim())) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()]
      }));
      setNewCategory('');
    }
  };
  const removeCategory = cat => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== cat)
    }));
  };

  const addVariant = () => {
    if (newVariant.size && newVariant.color && newVariant.quantity) {
      const exists = formData.variants.some(
        v => v.size === newVariant.size && v.color === newVariant.color
      );
      if (!exists) {
        setFormData(prev => ({
          ...prev,
          variants: [
            ...prev.variants,
            { ...newVariant, quantity: parseInt(newVariant.quantity, 10) }
          ]
        }));
        setNewVariant({ size: '', color: '', quantity: '' });
      }
    }
  };
  const removeVariant = index => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const uploadImages = async () => {
    const urls = [];
    
    for (const file of selectedFiles) {
      try {
        const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
        
        // Use uploadBytesResumable for better progress tracking
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        // Wait for upload to complete
        await new Promise((resolve, reject) => {
          uploadTask.on('state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Upload progress for ${file.name}: ${progress}%`);
            },
            (error) => {
              console.error('Upload error:', error);
              reject(error);
            },
            () => {
              console.log(`Upload completed for ${file.name}`);
              resolve(uploadTask.snapshot);
            }
          );
        });
        
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        urls.push(url);
        
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        throw new Error(`Failed to upload ${file.name}. Please check your Firebase Storage configuration and CORS settings. Error: ${error.message}`);
      }
    }
    return urls;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      alert('Please upload at least 1 image');
      return;
    }
    try {
      const imageUrls = await uploadImages();
      const productPayload = {
        ...formData,
        images: imageUrls
      };

      const res = await apiFetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(productPayload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Create failed');
      }

      alert('Product created!');
      navigate('/products');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const canSubmit =
    formData.title &&
    selectedFiles.length > 0 &&
    formData.variants.length > 0;

  return (
    <AddProductContainer>
      <FormWrapper>
        <Header>
          <Title>Add New Product</Title>
          <BackButton onClick={() => navigate('/products')}>
            ← Back
          </BackButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          {/* Basic section */}
          <FormSection>
            <SectionTitle>Basic Information</SectionTitle>
            <FormGroup>
              <Label>Title *</Label>
              <Input
                type="text" name="title" value={formData.title}
                onChange={handleInputChange} placeholder="Product title" required
              />
            </FormGroup>
            <FormGroup>
              <Label>Description *</Label>
              <TextArea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Product description" required
              />
            </FormGroup>
          </FormSection>

          {/* Images */}
          <FormSection>
            <SectionTitle>Images *</SectionTitle>
            <ImageInput>
              <input
                type="file" multiple accept="image/*"
                onChange={handleImageUpload} style={{ display: 'none' }}
                id="image-upload"
              />
              <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
                📷 Click to upload
              </label>
            </ImageInput>
            {previewUrls.length > 0 && (
              <ImagePreview>
                {previewUrls.map((url, i) => (
                  <ImagePreviewItem key={i}>
                    <PreviewImage src={url} />
                    <RemoveImage type="button" onClick={() => removeImage(i)}>
                      ×
                    </RemoveImage>
                  </ImagePreviewItem>
                ))}
              </ImagePreview>
            )}
          </FormSection>

          {/* Categories */}
          <FormSection>
            <SectionTitle>Categories</SectionTitle>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Input
                type="text"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                placeholder="New category"
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCategory();
                  }
                }}
              />
              <button
                type="button"
                onClick={addCategory}
                style={{
                  background: '#7451f8',
                  color: 'white',
                  border: 'none',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                Add
              </button>
            </div>
            {formData.categories.length > 0 && (
              <CategoryInput>
                {formData.categories.map((cat, i) => (
                  <CategoryTag key={i}>
                    {cat}
                    <RemoveCategory type="button" onClick={() => removeCategory(cat)}>
                      ×
                    </RemoveCategory>
                  </CategoryTag>
                ))}
              </CategoryInput>
            )}
          </FormSection>
          <CheckboxGroup>
  <Checkbox
    type="checkbox"
    name="isNew"
    checked={formData.isNew || false}
    onChange={handleInputChange}
  />
  <Label>Mark as New</Label>
</CheckboxGroup>


          {/* Pricing */}
          <FormSection>
            <SectionTitle>Pricing</SectionTitle>
            <FormGroup>
              <Label>Regular Price *</Label>
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </FormGroup>
            <CheckboxGroup>
              <Checkbox
                type="checkbox"
                name="isOnSale"
                checked={formData.isOnSale}
                onChange={handleInputChange}
              />
              <Label>On Sale</Label>
            </CheckboxGroup>
            {formData.isOnSale && (
              <FormGroup>
                <Label>Sale Price *</Label>
                <Input
                  type="number"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </FormGroup>
            )}
          </FormSection>

          {/* Variants */}
          <FormSection>
            <SectionTitle>Variants (size, color, stock)</SectionTitle>
            <VariantsSection>
              <VariantsHeader>
                <div>Add size, color & quantity</div>
                <AddVariantButton type="button" onClick={addVariant}>
                  + Add Variant
                </AddVariantButton>
              </VariantsHeader>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <Input
                  type="text"
                  placeholder="Size"
                  value={newVariant.size}
                  onChange={e => setNewVariant(prev => ({ ...prev, size: e.target.value }))}
                />
                <Input
                  type="text"
                  placeholder="Color"
                  value={newVariant.color}
                  onChange={e => setNewVariant(prev => ({ ...prev, color: e.target.value }))}
                />
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={newVariant.quantity}
                  onChange={e => setNewVariant(prev => ({ ...prev, quantity: e.target.value }))}
                  min="0"
                />
              </div>
              {formData.variants.length > 0 && (
                <VariantsList>
                  {formData.variants.map((v, i) => (
                    <VariantItem key={i}>
                      <div>{v.size}</div>
                      <div>{v.color}</div>
                      <div>{v.quantity}</div>
                      <RemoveVariant type="button" onClick={() => removeVariant(i)}>
                        ×
                      </RemoveVariant>
                    </VariantItem>
                  ))}
                </VariantsList>
              )}
            </VariantsSection>
          </FormSection>

          <SubmitButton type="submit" disabled={!canSubmit}>
            Create Product
          </SubmitButton>
        </Form>
      </FormWrapper>
    </AddProductContainer>
  );
};

export default AddProduct;

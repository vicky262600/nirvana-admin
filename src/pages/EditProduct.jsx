import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase"; 
import { apiFetch } from "../utils/apiClient";

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
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin: 0;
`;

const BackButton = styled.button`
  background: #6b7280;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s ease;

  &:hover {
    background: #4b5563;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  color: #333;
  margin: 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #f3f4f6;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #7451f8;
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #7451f8;
  }
`;

const ImageInput = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #7451f8;
  }

  input {
    display: none;
  }
`;

const ImagePreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
`;

const ImagePreviewItem = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveImage = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CategoryInput = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const CategoryTag = styled.span`
  background: #7451f8;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const RemoveCategory = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #7451f8;
`;

const VariantsSection = styled.div`
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
`;

const VariantsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const AddVariantButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #059669;
  }
`;

const VariantsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const VariantItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
`;

const RemoveVariant = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SubmitButton = styled.button`
  background: #7451f8;
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
  margin-top: 20px;

  &:hover {
    background: #5b3fd8;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    images: [],
    categories: [],
    price: "",
    onSale: false,
    salePrice: "",
    variants: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [newVariant, setNewVariant] = useState({
    size: "",
    color: "",
    quantity: "",
  });

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await apiFetch(`/api/products/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch product: ${res.statusText}`);

        const data = await res.json();

        setFormData({
          title: data.title || "",
          description: data.description || "",
          images: data.images || [],
          categories: data.categories || [],
          price: data.price || "",
          onSale: data.isOnSale || false,
          salePrice: data.salePrice || "",
          variants: data.variants || [],
        });
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
  
    // Upload all files and get their URLs
    const uploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
  
        uploadTask.on(
          "state_changed",
          null,
          (error) => reject(error),
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    });
  
    try {
      const urls = await Promise.all(uploadPromises);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...urls],
      }));
    } catch (error) {
      console.error("Error uploading images: ", error);
    }
  };
  

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addCategory = () => {
    if (newCategory.trim() && !formData.categories.includes(newCategory.trim())) {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()],
      }));
      setNewCategory("");
    }
  };

  const removeCategory = (category) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== category),
    }));
  };

  const addVariant = () => {
    if (newVariant.size && newVariant.color && newVariant.quantity) {
      const variantExists = formData.variants.some(
        (v) => v.size === newVariant.size && v.color === newVariant.color
      );
      if (!variantExists) {
        setFormData((prev) => ({
          ...prev,
          variants: [
            ...prev.variants,
            { ...newVariant, quantity: parseInt(newVariant.quantity, 10) },
          ],
        }));
        setNewVariant({ size: "", color: "", quantity: "" });
      }
    }
  };

  const removeVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiFetch(`/api/products/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          images: formData.images,
          categories: formData.categories,
          price: Number(formData.price),
          isOnSale: formData.onSale,
          salePrice: formData.salePrice ? Number(formData.salePrice) : 0,
          variants: formData.variants,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update product");
      }

      navigate("/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <AddProductContainer>
      <FormWrapper>
        <Header>
          <Title>Edit Product</Title>
          <BackButton onClick={() => navigate("/products")}>← Back to Products</BackButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          <FormSection>
            <SectionTitle>Basic Information</SectionTitle>

            <FormGroup>
              <Label>Product Title *</Label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter product title"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Description *</Label>
              <TextArea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
              />
            </FormGroup>
          </FormSection>

          <FormSection>
            <SectionTitle>Images</SectionTitle>

            <FormGroup>
              <Label>Product Images *</Label>
              <ImageInput>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  id="image-upload"
                />
                <label htmlFor="image-upload" style={{ cursor: "pointer" }}>
                  <div>📷 Click to upload images</div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginTop: "8px",
                    }}
                  >
                    Upload multiple images for your product
                  </div>
                </label>
              </ImageInput>

              {formData.images.length > 0 && (
                <ImagePreview>
                  {formData.images.map((image, index) => (
                    <ImagePreviewItem key={index}>
                      <PreviewImage src={image} alt={`Preview ${index + 1}`} />
                      <RemoveImage onClick={() => removeImage(index)}>×</RemoveImage>
                    </ImagePreviewItem>
                  ))}
                </ImagePreview>
              )}
            </FormGroup>
          </FormSection>

          <FormSection>
            <SectionTitle>Categories</SectionTitle>

            <FormGroup>
              <Label>Product Categories</Label>
              <div style={{ display: "flex", gap: "8px" }}>
                <Input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter category"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addCategory())
                  }
                />
                <button
                  type="button"
                  onClick={addCategory}
                  style={{
                    background: "#7451f8",
                    color: "white",
                    border: "none",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Add
                </button>
              </div>

              {formData.categories.length > 0 && (
                <CategoryInput>
                  {formData.categories.map((category, index) => (
                    <CategoryTag key={index}>
                      {category}
                      <RemoveCategory onClick={() => removeCategory(category)}>
                        ×
                      </RemoveCategory>
                    </CategoryTag>
                  ))}
                </CategoryInput>
              )}
            </FormGroup>
          </FormSection>

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
                name="onSale"
                checked={formData.onSale}
                onChange={handleInputChange}
              />
              <Label>On Sale</Label>
            </CheckboxGroup>

            {formData.onSale && (
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
                  required={formData.onSale}
                />
              </FormGroup>
            )}
          </FormSection>

          <FormSection>
            <SectionTitle>Variants (Size & Color)</SectionTitle>

            <VariantsSection>
              <VariantsHeader>
                <div>Add size and color combinations with quantities</div>
                <AddVariantButton type="button" onClick={addVariant}>
                  + Add Variant
                </AddVariantButton>
              </VariantsHeader>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <Input
                  type="text"
                  placeholder="Size (e.g., S, M, L, XL)"
                  value={newVariant.size}
                  onChange={(e) =>
                    setNewVariant((prev) => ({ ...prev, size: e.target.value }))
                  }
                />
                <Input
                  type="text"
                  placeholder="Color (e.g., Red, Blue, Black)"
                  value={newVariant.color}
                  onChange={(e) =>
                    setNewVariant((prev) => ({ ...prev, color: e.target.value }))
                  }
                />
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={newVariant.quantity}
                  onChange={(e) =>
                    setNewVariant((prev) => ({ ...prev, quantity: e.target.value }))
                  }
                  min="0"
                />
              </div>

              {formData.variants.length > 0 && (
                <VariantsList>
                  {formData.variants.map((variant, index) => (
                    <VariantItem key={index}>
                      <div>{variant.size}</div>
                      <div>{variant.color}</div>
                      <div>{variant.quantity}</div>
                      <RemoveVariant onClick={() => removeVariant(index)}>
                        ×
                      </RemoveVariant>
                    </VariantItem>
                  ))}
                </VariantsList>
              )}
            </VariantsSection>
          </FormSection>

          <SubmitButton
            type="submit"
            disabled={
              !formData.title ||
              !formData.description ||
              formData.images.length === 0 ||
              formData.variants.length === 0 ||
              loading
            }
          >
            {loading ? "Updating..." : "Update Product"}
          </SubmitButton>
        </Form>
      </FormWrapper>
    </AddProductContainer>
  );
};

export default EditProduct;

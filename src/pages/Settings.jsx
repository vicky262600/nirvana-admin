import React, { useState } from 'react';
import styled from 'styled-components';

const SettingsContainer = styled.div`
  flex: 4;
  padding: 20px;
`;

const FormWrapper = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  color: #374151;
  margin-bottom: 12px;
  margin-top: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #374151;
  margin-bottom: 6px;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1.5px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 16px;
  background: #f3f4f6;
  outline: none;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1.5px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 16px;
  background: #f3f4f6;
  outline: none;
`;

const SaveButton = styled.button`
  background: #7451f8;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
  margin-top: 16px;
  &:hover {
    background: #5b3fd8;
  }
`;

const LogoPreview = styled.div`
  margin-bottom: 16px;
  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
  }
`;

const Settings = () => {
  const [storeInfo, setStoreInfo] = useState({
    name: 'Nirvana Clothing',
    email: 'contact@nirvanaclothing.com',
    address: '123 Fashion Ave, New York, NY, USA',
  });
  const [preferences, setPreferences] = useState({
    currency: 'USD',
    language: 'en',
  });
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const handleStoreInfoChange = e => {
    setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value });
  };

  const handlePreferencesChange = e => {
    setPreferences({ ...preferences, [e.target.name]: e.target.value });
  };

  const handleLogoChange = e => {
    const file = e.target.files[0];
    setLogo(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setLogoPreview(null);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Placeholder for save logic
    alert('Settings saved! (Not really, this is a demo)');
  };

  return (
    <SettingsContainer>
      <FormWrapper>
        <Title>Store Settings</Title>
        <form onSubmit={handleSubmit}>
          <SectionTitle>Store Information</SectionTitle>
          <Label htmlFor="name">Store Name</Label>
          <Input
            id="name"
            name="name"
            value={storeInfo.name}
            onChange={handleStoreInfoChange}
            required
          />
          <Label htmlFor="email">Contact Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={storeInfo.email}
            onChange={handleStoreInfoChange}
            required
          />
          <Label htmlFor="address">Store Address</Label>
          <Input
            id="address"
            name="address"
            value={storeInfo.address}
            onChange={handleStoreInfoChange}
            required
          />

          <SectionTitle>Store Logo</SectionTitle>
          <LogoPreview>
            {logoPreview ? (
              <img src={logoPreview} alt="Store Logo Preview" />
            ) : (
              <span style={{ color: '#aaa', fontSize: '13px' }}>No logo uploaded</span>
            )}
          </LogoPreview>
          <Input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            style={{ background: 'white', padding: 0 }}
          />

          <SectionTitle>Store Preferences</SectionTitle>
          <Label htmlFor="currency">Currency</Label>
          <Select
            id="currency"
            name="currency"
            value={preferences.currency}
            onChange={handlePreferencesChange}
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="INR">INR - Indian Rupee</option>
          </Select>
          <Label htmlFor="language">Language</Label>
          <Select
            id="language"
            name="language"
            value={preferences.language}
            onChange={handlePreferencesChange}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </Select>

          <SaveButton type="submit">Save Changes</SaveButton>
        </form>
      </FormWrapper>
    </SettingsContainer>
  );
};

export default Settings; 
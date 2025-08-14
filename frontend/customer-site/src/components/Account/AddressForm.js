import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const AddressForm = ({ address, onSave, onCancel, loading }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    address: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
    isDefault: false,
  });

  useEffect(() => {
    if (address) {
      setFormData({
        address: address.address || '',
        street: address.street || '',
        city: address.city || '',
        postalCode: address.postalCode || '',
        country: address.country || '',
        phone: address.phone || '',
        isDefault: address.isDefault || false,
      });
    }
  }, [address]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formAddressLine">
        <Form.Label>{t('checkoutPage.shipping.address')}</Form.Label>
        <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} required />
      </Form.Group>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="formStreet">
            <Form.Label>{t('checkoutPage.shipping.street')}</Form.Label>
            <Form.Control type="text" name="street" value={formData.street} onChange={handleChange} />
          </Form.Group>
        </Col>
        <Col md={6}>
           <Form.Group className="mb-3" controlId="formCity">
            <Form.Label>{t('checkoutPage.shipping.city')}</Form.Label>
            <Form.Control type="text" name="city" value={formData.city} onChange={handleChange} required />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="formPostalCode">
            <Form.Label>{t('checkoutPage.shipping.postalCode')}</Form.Label>
            <Form.Control type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="formCountry">
            <Form.Label>{t('checkoutPage.shipping.country')}</Form.Label>
            <Form.Control type="text" name="country" value={formData.country} onChange={handleChange} required />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3" controlId="formPhone">
        <Form.Label>{t('checkoutPage.shipping.phone')}</Form.Label>
        <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formIsDefault">
        <Form.Check
          type="checkbox"
          name="isDefault"
          label={t('accountPage.addresses.setDefault', 'Set as default address')}
          checked={formData.isDefault}
          onChange={handleChange}
        />
      </Form.Group>
      <div className="d-flex justify-content-end">
        <Button variant="secondary" onClick={onCancel} className="me-2" disabled={loading}>
          {t('common.cancel', 'Cancel')}
        </Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? <Spinner as="span" animation="border" size="sm" /> : t('common.save', 'Save')}
        </Button>
      </div>
    </Form>
  );
};

export default AddressForm;

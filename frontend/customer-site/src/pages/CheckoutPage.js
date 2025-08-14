import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Form, Button, Card, ListGroup, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { createOrder as apiCreateOrder } from '../services/apiService';
import AddressForm from '../components/Account/AddressForm';
import { Modal } from 'react-bootstrap';


const CheckoutPage = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const navigate = useNavigate();
  const { user, token, isAuthenticated, loading: authLoading, addUserAddress, operationLoading } = useAuth();
  const { cartItems, cartTotals, clearClientCart, loading: cartLoading, error: cartError } = useCart();

  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showNewAddressModal, setShowNewAddressModal] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    street: '',
    houseNumber: '',
    city: '',
    postalCode: '',
    country: '', // Default or fetched from user profile
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('CashOnDelivery'); // Default payment method
  const [status, setStatus] = useState({ loading: false, error: null, success: null });

  useEffect(() => {
    if (user && user.addresses && user.addresses.length > 0) {
        const defaultAddress = user.addresses.find(addr => addr.isDefault) || user.addresses[0];
        setSelectedAddressId(defaultAddress._id);
        setShippingAddress(defaultAddress);
    }
    if (!authLoading && !isAuthenticated) {
        navigate('/account/login?redirect=/checkout');
    }
    if (!cartLoading && cartItems.length === 0 && !authLoading) {
        navigate('/cart'); // Redirect to cart if it's empty
    }

  }, [user, isAuthenticated, authLoading, cartItems, cartLoading, navigate]);

  const handleShippingChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    const selected = user.addresses.find(addr => addr._id === addressId);
    setShippingAddress(selected);
  };

  const handleAddNewAddress = async (addressData) => {
    await addUserAddress(addressData);
    setShowNewAddressModal(false);
    // The useEffect hook will find the new address and set it as selected
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setStatus({ loading: false, error: t('checkoutPage.error.emptyCart'), success: null });
      return;
    }
    setStatus({ loading: true, error: null, success: null });

    const orderData = {
      orderItems: cartItems.map(item => ({
        product: item.product._id,
        name_en: item.product.name_en, // Storing names at time of order
        name_ar: item.product.name_ar,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.images && item.product.images.length > 0 ? item.product.images[0] : '',
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice: cartTotals.subtotal,
      taxPrice: cartTotals.tax, // Assuming tax is calculated in cartTotals
      shippingPrice: cartTotals.shipping, // Assuming shipping is calculated
      totalPrice: cartTotals.total,
    };

    try {
      const response = await apiCreateOrder(orderData, token);
      if (response.data && response.data.success) {
        setStatus({ loading: false, error: null, success: t('checkoutPage.success.orderPlaced', { orderId: response.data.data._id }) });
        await clearClientCart(); // Clear cart from context and backend
        // Redirect to order confirmation page or account/orders
        setTimeout(() => navigate(`/account/orders`), 5000); // Redirect after 5s
      } else {
        setStatus({ loading: false, error: response.data.message || t('checkoutPage.error.orderDefault'), success: null });
      }
    } catch (err) {
      setStatus({ loading: false, error: err.error || err.message || t('checkoutPage.error.orderNetwork'), success: null });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat(currentLang === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
    }).format(price);
  };

  if (authLoading || cartLoading) {
    return <Container className="my-5 text-center"><Spinner animation="border" /></Container>;
  }
  if (cartError) {
     return <Container className="my-5"><Alert variant="danger">{cartError}</Alert></Container>;
  }


  return (
    <Container className="my-5 checkout-page">
      <Helmet>
        <title>{t('pageTitles.checkout')}</title>
      </Helmet>
      <h1 className="mb-4 page-main-title">{t('checkoutPage.title')}</h1>

      {status.success && <Alert variant="success">{status.success}</Alert>}
      {status.error && <Alert variant="danger">{status.error}</Alert>}

      {!status.success && (
        <Form onSubmit={handleSubmitOrder}>
          <Row>
            <Col md={7} className="mb-4">
              <h4>{t('checkoutPage.shipping.title')}</h4>
              {user?.addresses && user.addresses.length > 0 ? (
                <div className="mb-3">
                  {user.addresses.map(addr => (
                    <Card key={addr._id} className={`mb-2 ${selectedAddressId === addr._id ? 'border-primary' : ''}`}>
                      <Card.Body>
                        <Form.Check
                          type="radio"
                          id={`addr-${addr._id}`}
                          name="shippingAddress"
                          checked={selectedAddressId === addr._id}
                          onChange={() => handleAddressSelect(addr._id)}
                          label={
                            <div>
                              <strong>{addr.address}, {addr.street}</strong><br/>
                              {addr.city}, {addr.postalCode}, {addr.country}<br/>
                              {addr.phone}
                            </div>
                          }
                        />
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              ) : (
                <Alert variant="info">{t('checkoutPage.noAddresses', 'You have no saved addresses. Please add one.')}</Alert>
              )}

              <Button variant="secondary" onClick={() => setShowNewAddressModal(true)}>
                {t('checkoutPage.addNewAddress', 'Add New Address')}
              </Button>

              <h4 className="mt-4">{t('checkoutPage.payment.title')}</h4>
              <Form.Group className="mb-3">
                <Form.Check
                  type="radio"
                  id="paymentCashOnDelivery"
                  name="paymentMethod"
                  value="CashOnDelivery"
                  label={t('checkoutPage.payment.cashOnDelivery')}
                  checked={paymentMethod === 'CashOnDelivery'}
                  onChange={handlePaymentMethodChange}
                />
                {/* Add other payment methods here, e.g., Credit Card via Stripe Elements */}
                <Form.Check
                  type="radio"
                  id="paymentCreditCard"
                  name="paymentMethod"
                  value="CreditCard"
                  label={t('checkoutPage.payment.creditCard')}
                  checked={paymentMethod === 'CreditCard'}
                  onChange={handlePaymentMethodChange}
                  disabled // Placeholder
                />
              </Form.Group>
            </Col>

            <Col md={5}>
              <h4>{t('checkoutPage.summary.title')}</h4>
              <Card>
                <ListGroup variant="flush">
                  {cartItems.map(item => ( item.product &&
                    <ListGroup.Item key={item.product._id} className="d-flex justify-content-between align-items-center">
                      <span>{currentLang === 'ar' ? item.product.name_ar : item.product.name_en} x {item.quantity}</span>
                      <span>{formatPrice(item.product.price * item.quantity)}</span>
                    </ListGroup.Item>
                  ))}
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>{t('checkoutPage.summary.subtotal')}</span>
                    <strong>{formatPrice(cartTotals.subtotal)}</strong>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>{t('checkoutPage.summary.shipping')}</span>
                    <strong>{cartTotals.shipping > 0 ? formatPrice(cartTotals.shipping) : t('checkoutPage.summary.freeShipping')}</strong>
                  </ListGroup.Item>
                   <ListGroup.Item className="d-flex justify-content-between">
                    <span>{t('checkoutPage.summary.tax')}</span>
                    <strong>{formatPrice(cartTotals.tax)}</strong>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between fw-bold h5">
                    <span>{t('checkoutPage.summary.total')}</span>
                    <span>{formatPrice(cartTotals.total)}</span>
                  </ListGroup.Item>
                </ListGroup>
                <Card.Body>
                  <div className="d-grid">
                    <Button variant="primary" type="submit" size="lg" disabled={status.loading || cartItems.length === 0}>
                      {status.loading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" />{' '}
                          {t('checkoutPage.placingOrder')}
                        </>
                      ) : t('checkoutPage.placeOrderButton')}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Form>
      )}

      <Modal show={showNewAddressModal} onHide={() => setShowNewAddressModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('checkoutPage.addNewAddressTitle', 'Add a New Shipping Address')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddressForm
            onSave={handleAddNewAddress}
            onCancel={() => setShowNewAddressModal(false)}
            loading={operationLoading}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CheckoutPage;

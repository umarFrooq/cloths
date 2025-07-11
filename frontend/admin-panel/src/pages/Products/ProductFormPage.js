import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Form, Button, Spinner, Alert, Card, InputGroup } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import {
    getAdminProductById,
    createAdminProduct,
    updateAdminProduct,
    getAdminCategories // To populate category dropdown
} from '../../services/adminApiService';
// import './ProductFormPage.css'; // Optional

const ProductFormPage = () => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;
    const navigate = useNavigate();
    const { productId } = useParams(); // For editing existing product
    const isEditMode = Boolean(productId);

    const initialFormData = {
        name_en: '', name_ar: '',
        description_en: '', description_ar: '',
        price: '', category: '', stock: '', sku: '',
        images: [''], // Start with one empty image URL field
        tags_en: '', tags_ar: '', // Store as comma-separated strings in form
        isActive: true,
    };
    const [formData, setFormData] = useState(initialFormData);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false); // For form submission
    const [pageLoading, setPageLoading] = useState(isEditMode); // For fetching product/categories data
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const fetchProductAndCategories = useCallback(async () => {
        setPageLoading(true);
        setError(null);
        try {
            const catResponse = await getAdminCategories();
            if (catResponse.data && catResponse.data.success) {
                setCategories(catResponse.data.data);
            } else {
                throw new Error(catResponse.data.message || 'Failed to load categories');
            }

            if (isEditMode) {
                const prodResponse = await getAdminProductById(productId);
                if (prodResponse.data && prodResponse.data.success) {
                    const productData = prodResponse.data.data;
                    setFormData({
                        name_en: productData.name_en || '',
                        name_ar: productData.name_ar || '',
                        description_en: productData.description_en || '',
                        description_ar: productData.description_ar || '',
                        price: productData.price || '',
                        category: productData.category?._id || productData.category || '', // Handle populated vs ID
                        stock: productData.stock || 0,
                        sku: productData.sku || '',
                        images: productData.images && productData.images.length > 0 ? productData.images : [''],
                        tags_en: productData.tags_en ? productData.tags_en.join(', ') : '',
                        tags_ar: productData.tags_ar ? productData.tags_ar.join(', ') : '',
                        isActive: productData.isActive !== undefined ? productData.isActive : true,
                    });
                } else {
                    throw new Error(prodResponse.data.message || `Failed to load product ${productId}`);
                }
            }
        } catch (err) {
            setError(err.message || 'Error loading data for product form.');
            console.error("Error in form page load:", err);
        } finally {
            setPageLoading(false);
        }
    }, [isEditMode, productId]);

    useEffect(() => {
        fetchProductAndCategories();
    }, [fetchProductAndCategories]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleImageChange = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const addImageField = () => {
        setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
    };

    const removeImageField = (index) => {
        if (formData.images.length > 1) { // Keep at least one field
            const newImages = formData.images.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, images: newImages }));
        } else { // If only one, clear it
            setFormData(prev => ({ ...prev, images: ['']}));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const productPayload = {
            ...formData,
            price: parseFloat(formData.price) || 0,
            stock: parseInt(formData.stock, 10) || 0,
            images: formData.images.filter(img => img.trim() !== ''), // Remove empty image strings
            tags_en: formData.tags_en.split(',').map(tag => tag.trim()).filter(tag => tag),
            tags_ar: formData.tags_ar.split(',').map(tag => tag.trim()).filter(tag => tag),
        };
        if (!productPayload.category) delete productPayload.category; // Don't send empty category

        try {
            let response;
            if (isEditMode) {
                response = await updateAdminProduct(productId, productPayload);
            } else {
                response = await createAdminProduct(productPayload);
            }

            if (response.data && response.data.success) {
                setSuccess(isEditMode ? t('admin.products.form.updateSuccess') : t('admin.products.form.createSuccess'));
                setTimeout(() => navigate('/admin/products'), 2000); // Redirect after 2s
                if (!isEditMode) setFormData(initialFormData); // Clear form on create
            } else {
                throw new Error(response.data.message || (isEditMode ? t('admin.products.form.updateError') : t('admin.products.form.createError')));
            }
        } catch (err) {
            setError(err.message || err.error || 'An unexpected error occurred.');
            console.error("Submit error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;
    }
    // Initial load error for product/categories
    if (error && !loading && isEditMode && !formData.name_en) { // Check if form data is not loaded due to error
         return <Container className="mt-3"><Alert variant="danger">{error}</Alert></Container>;
    }


    return (
        <>
            <Helmet>
                <title>
                    {isEditMode ? t('admin.products.form.editTitle', { name: formData.name_en || 'Product' }) : t('admin.products.form.newTitle')}
                    {' | '}{t('adminPanel.title')}
                </title>
            </Helmet>
            <Container fluid className="p-4">
                <Row className="mb-3">
                    <Col>
                        <h2 className="admin-page-title">
                            {isEditMode ? t('admin.products.form.editPageHeader', { name: formData.name_en || 'Product' }) : t('admin.products.form.newPageHeader')}
                        </h2>
                    </Col>
                </Row>
                <Card className="shadow-sm">
                    <Card.Body>
                        {error && !loading && <Alert variant="danger">{error}</Alert>}
                        {success && <Alert variant="success">{success}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            {/* Names */}
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="name_en">
                                        <Form.Label>{t('admin.products.form.nameEnLabel')} <span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="text" name="name_en" value={formData.name_en} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="name_ar">
                                        <Form.Label>{t('admin.products.form.nameArLabel')} <span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="text" name="name_ar" value={formData.name_ar} onChange={handleChange} required dir="rtl" />
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Descriptions */}
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="description_en">
                                        <Form.Label>{t('admin.products.form.descriptionEnLabel')} <span className="text-danger">*</span></Form.Label>
                                        <Form.Control as="textarea" rows={4} name="description_en" value={formData.description_en} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="description_ar">
                                        <Form.Label>{t('admin.products.form.descriptionArLabel')} <span className="text-danger">*</span></Form.Label>
                                        <Form.Control as="textarea" rows={4} name="description_ar" value={formData.description_ar} onChange={handleChange} required dir="rtl" />
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Price, Category, Stock, SKU */}
                            <Row>
                                <Col md={3}>
                                    <Form.Group className="mb-3" controlId="price">
                                        <Form.Label>{t('admin.products.form.priceLabel')} <span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3" controlId="category">
                                        <Form.Label>{t('admin.products.form.categoryLabel')} <span className="text-danger">*</span></Form.Label>
                                        <Form.Select name="category" value={formData.category} onChange={handleChange} required>
                                            <option value="">{t('admin.products.form.selectCategory')}</option>
                                            {categories.map(cat => (
                                                <option key={cat._id} value={cat._id}>
                                                    {currentLang === 'ar' && cat.name_ar ? cat.name_ar : cat.name_en}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3" controlId="stock">
                                        <Form.Label>{t('admin.products.form.stockLabel')} <span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0" />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3" controlId="sku">
                                        <Form.Label>{t('admin.products.form.skuLabel')}</Form.Label>
                                        <Form.Control type="text" name="sku" value={formData.sku} onChange={handleChange} />
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Images */}
                            <Form.Group className="mb-3" controlId="images">
                                <Form.Label>{t('admin.products.form.imagesLabel')}</Form.Label>
                                {formData.images.map((imgUrl, index) => (
                                    <InputGroup className="mb-2" key={index}>
                                        <Form.Control
                                            type="text"
                                            placeholder={t('admin.products.form.imageUrlPlaceholder', {num: index + 1})}
                                            value={imgUrl}
                                            onChange={(e) => handleImageChange(index, e.target.value)}
                                        />
                                        <Button variant="outline-danger" onClick={() => removeImageField(index)} disabled={formData.images.length === 1 && imgUrl === ''}>
                                            {t('admin.products.form.removeImageButton')}
                                        </Button>
                                    </InputGroup>
                                ))}
                                <Button variant="outline-secondary" size="sm" onClick={addImageField}>
                                    {t('admin.products.form.addImageButton')}
                                </Button>
                                <Form.Text className="d-block">{t('admin.products.form.imagesTip')}</Form.Text>
                            </Form.Group>

                            {/* Tags */}
                             <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="tags_en">
                                        <Form.Label>{t('admin.products.form.tagsEnLabel')}</Form.Label>
                                        <Form.Control type="text" name="tags_en" value={formData.tags_en} onChange={handleChange} />
                                        <Form.Text>{t('admin.products.form.tagsTip')}</Form.Text>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="tags_ar">
                                        <Form.Label>{t('admin.products.form.tagsArLabel')}</Form.Label>
                                        <Form.Control type="text" name="tags_ar" value={formData.tags_ar} onChange={handleChange} dir="rtl" />
                                         <Form.Text>{t('admin.products.form.tagsTip')}</Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Is Active */}
                            <Form.Group className="mb-4" controlId="isActive">
                                <Form.Check
                                    type="switch"
                                    name="isActive"
                                    label={t('admin.products.form.isActiveLabel')}
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Button variant="success" type="submit" disabled={loading || pageLoading}>
                                {loading ? <Spinner as="span" animation="border" size="sm" /> : (isEditMode ? t('admin.products.form.saveChangesButton') : t('admin.products.form.createProductButton'))}
                            </Button>
                            <Button variant="secondary" className="ms-2" onClick={() => navigate('/admin/products')} disabled={loading || pageLoading}>
                                {t('admin.common.cancelButton')}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default ProductFormPage;

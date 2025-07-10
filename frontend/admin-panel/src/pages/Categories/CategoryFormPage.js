import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Form, Button, Spinner, Alert, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import {
    getAdminCategoryById,
    createAdminCategory,
    updateAdminCategory
} from '../../services/adminApiService';

const CategoryFormPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { categoryId } = useParams();
    const isEditMode = Boolean(categoryId);

    const initialFormData = { name_en: '', name_ar: '' };
    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(isEditMode);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const fetchCategory = useCallback(async () => {
        if (!isEditMode) {
            setPageLoading(false);
            return;
        }
        setPageLoading(true);
        setError(null);
        try {
            const response = await getAdminCategoryById(categoryId);
            if (response.data && response.data.success) {
                const categoryData = response.data.data;
                setFormData({
                    name_en: categoryData.name_en || '',
                    name_ar: categoryData.name_ar || '',
                    // Add other fields if category model expands e.g. description, image
                });
            } else {
                throw new Error(response.data.message || `Failed to load category ${categoryId}`);
            }
        } catch (err) {
            setError(err.message || 'Error loading category data.');
            console.error("Error in category form page load:", err);
        } finally {
            setPageLoading(false);
        }
    }, [isEditMode, categoryId]);

    useEffect(() => {
        fetchCategory();
    }, [fetchCategory]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            let response;
            if (isEditMode) {
                response = await updateAdminCategory(categoryId, formData);
            } else {
                response = await createAdminCategory(formData);
            }

            if (response.data && response.data.success) {
                setSuccess(isEditMode ? t('admin.categories.form.updateSuccess') : t('admin.categories.form.createSuccess'));
                setTimeout(() => navigate('/admin/categories'), 2000);
                if (!isEditMode) setFormData(initialFormData);
            } else {
                throw new Error(response.data.message || (isEditMode ? t('admin.categories.form.updateError') : t('admin.categories.form.createError')));
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
    // Initial load error for category data
    if (error && !loading && isEditMode && !formData.name_en) {
         return <Container className="mt-3"><Alert variant="danger">{error}</Alert></Container>;
    }

    return (
        <>
            <Helmet>
                <title>
                    {isEditMode ? t('admin.categories.form.editTitle', { name: formData.name_en || 'Category' }) : t('admin.categories.form.newTitle')}
                    {' | '}{t('adminPanel.title')}
                </title>
            </Helmet>
            <Container fluid className="p-4">
                <Row className="mb-3">
                    <Col>
                        <h2 className="admin-page-title">
                            {isEditMode ? t('admin.categories.form.editPageHeader', { name: formData.name_en || 'Category' }) : t('admin.categories.form.newPageHeader')}
                        </h2>
                    </Col>
                </Row>
                <Card className="shadow-sm">
                    <Card.Body>
                        {error && !loading && <Alert variant="danger">{error}</Alert>}
                        {success && <Alert variant="success">{success}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="name_en">
                                <Form.Label>{t('admin.categories.form.nameEnLabel')} <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="text" name="name_en" value={formData.name_en} onChange={handleChange} required />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="name_ar">
                                <Form.Label>{t('admin.categories.form.nameArLabel')} <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="text" name="name_ar" value={formData.name_ar} onChange={handleChange} required dir="rtl" />
                            </Form.Group>

                            {/* Add fields for description_en, description_ar, image if model expands */}

                            <Button variant="success" type="submit" disabled={loading || pageLoading}>
                                {loading ? <Spinner as="span" animation="border" size="sm" /> : (isEditMode ? t('admin.categories.form.saveChangesButton') : t('admin.categories.form.createCategoryButton'))}
                            </Button>
                            <Button variant="secondary" className="ms-2" onClick={() => navigate('/admin/categories')} disabled={loading || pageLoading}>
                                {t('admin.common.cancelButton')}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default CategoryFormPage;

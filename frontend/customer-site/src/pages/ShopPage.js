import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Spinner, Alert, Pagination, Form } from 'react-bootstrap'; // Removed Button for now
import { useSearchParams } from 'react-router-dom'; // useNavigate removed, setSearchParams updates URL
import { getProducts, getCategories } from '../services/apiService';
import ProductCard from '../components/Products/ProductCard';
import FilterSidebar from '../components/Shop/FilterSidebar';
import CategoryBanner from '../components/Shop/CategoryBanner';
// import './ShopPage.css'; // Optional for specific styling

const ShopPage = () => {
  const { t, i18n } = useTranslation();
  // const navigate = useNavigate(); // Not strictly needed if setSearchParams handles URL updates for state
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters and Sorting State - initialize from URL search params
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '-createdAt'); // Default sort: newest
  const [selectedBrands, setSelectedBrands] = useState(searchParams.getAll('brand') || []);
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || '',
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page'), 10) || 1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 12;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response.data && response.data.success) {
          setCategories(response.data.data);
        }
      } catch (catError) {
        console.error("Failed to fetch categories for shop filter:", catError);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    // Update local state if URL search params change (e.g., browser back/forward)
    setSelectedCategory(searchParams.get('category') || '');
    setSearchTerm(searchParams.get('search') || '');
    setSortBy(searchParams.get('sort') || '-createdAt');
    setCurrentPage(parseInt(searchParams.get('page'), 10) || 1);
    setPriceRange({
        min: searchParams.get('minPrice') || '',
        max: searchParams.get('maxPrice') || '',
    });
    setSelectedBrands(searchParams.getAll('brand') || []);
  }, [searchParams]);


  useEffect(() => {
    const fetchShopProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          page: currentPage,
          limit: productsPerPage,
          sort: sortBy,
          lang: i18n.language,
        };
        if (selectedCategory) params.category = selectedCategory;
        if (searchTerm) params.search = searchTerm;
        if (priceRange.min) params.minPrice = priceRange.min;
        if (priceRange.max) params.maxPrice = priceRange.max;
        if (selectedBrands.length > 0) params.brand = selectedBrands.join(',');

        const response = await getProducts(params);
        if (response.data && response.data.success) {
          setProducts(response.data.data);
          setTotalProducts(response.data.totalProducts || 0);
          if (response.data.totalProducts && response.data.data.length > 0) {
            setTotalPages(Math.ceil(response.data.totalProducts / productsPerPage));
          } else {
            setTotalPages(0);
          }
        } else {
          setError(response.data.message || t('shopPage.error.fetchDefault'));
          setProducts([]);
          setTotalPages(0);
        }
      } catch (err) {
        setError(err.error || err.message || t('shopPage.error.fetchNetwork'));
        setProducts([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchShopProducts();
  }, [selectedCategory, searchTerm, sortBy, currentPage, i18n.language, t, priceRange.min, priceRange.max, selectedBrands]);

  // Function to update URL search params, which triggers the useEffect above
  const updateFiltersInUrl = (newFilters) => {
    const currentParams = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        currentParams.set(key, value);
      } else {
        currentParams.delete(key);
      }
    });
    // Reset page to 1 when filters change, unless page is the filter being changed
    if (!newFilters.hasOwnProperty('page')) {
        currentParams.set('page', '1');
    }
    setSearchParams(currentParams, { replace: true });
  };

  const handleCategoryChange = (e) => {
    updateFiltersInUrl({ category: e.target.value, page: '1' });
  };

  const handleSortChange = (e) => {
    updateFiltersInUrl({ sort: e.target.value, page: '1' });
  };

  const handlePriceChange = (field, value) => {
    setPriceRange(prev => ({ ...prev, [field]: value }));
  };

  const handlePriceFilterSubmit = () => {
    updateFiltersInUrl({ minPrice: priceRange.min, maxPrice: priceRange.max, page: '1' });
  };

  const handleBrandChange = (brand) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(newBrands);
    updateFiltersInUrl({ brand: newBrands, page: '1' });
  };

  const handleSearchTermChange = (e) => { // Renamed from handleSearchChange to avoid conflict
    setSearchTerm(e.target.value); // Update local state for input control
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFiltersInUrl({ search: searchTerm, page: '1' });
  };

  const handlePageChange = (pageNumber) => {
    updateFiltersInUrl({ page: pageNumber.toString() });
  };

  const currentCategory = categories.find(cat => cat._id === selectedCategory);

  return (
    <Container className="my-1 shop-page">
      <Helmet>
        <title>{currentCategory ? (i18n.language === 'ar' ? currentCategory.name_ar : currentCategory.name_en) : t('pageTitles.shop', 'المتجــــــر')}</title>
      </Helmet>

      {currentCategory && <CategoryBanner category={currentCategory} />}

      <Row>
        <Col md={3}>
          <FilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            sortBy={sortBy}
            searchTerm={searchTerm}
            onCategoryChange={handleCategoryChange}
            onSortChange={handleSortChange}
            onSearchChange={handleSearchTermChange}
            onSearchSubmit={handleSearchSubmit}
            priceRange={priceRange}
            onPriceChange={handlePriceChange}
            onPriceSubmit={handlePriceFilterSubmit}
            selectedBrands={selectedBrands}
            onBrandChange={handleBrandChange}
          />
        </Col>
        <Col md={9}>
          {loading && (
            <div className="text-center my-5">
              <Spinner animation="border" /> <p>{t('shopPage.loadingProducts', 'Loading products...')}</p>
            </div>
          )}
          {error && <Alert variant="danger">{error}</Alert>}

          {!loading && !error && products.length === 0 && (
            <Alert variant="info">{t('shopPage.noProductsFound', 'No products found matching your criteria.')}</Alert>
          )}

          {!loading && !error && products.length > 0 && (
            <>
              <p className="text-muted mb-3">
                {t('shopPage.resultsCount', 'Showing {{count}} of {{total}} products', { count: products.length, total: totalProducts })}
              </p>
              <Row>
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </Row>
              {totalPages > 1 && (
                <Pagination className="justify-content-center mt-4">
                  {[...Array(totalPages).keys()].map(number => (
                    <Pagination.Item
                        key={number + 1}
                        active={number + 1 === currentPage}
                        onClick={() => handlePageChange(number + 1)}
                    >
                      {number + 1}
                    </Pagination.Item>
                  ))}
                </Pagination>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ShopPage;

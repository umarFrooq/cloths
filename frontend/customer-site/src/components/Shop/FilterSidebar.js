import React from 'react';
import { Form, Card, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const FilterSidebar = ({
  categories,
  selectedCategory,
  sortBy,
  searchTerm,
  onCategoryChange,
  onSortChange,
  onSearchChange,
  onSearchSubmit,
  priceRange,
  onPriceChange,
  onPriceSubmit,
  selectedBrands,
  onBrandChange,
}) => {
  const { t, i18n } = useTranslation();

  return (
    <Card className="p-3">
      <h4 className="mb-3">{t('shopPage.filters.title', 'Filters')}</h4>

      {/* Price Range Filter */}
      <Form.Group className="mb-3">
        <Form.Label>{t('shopPage.filters.priceRange', 'Price Range')}</Form.Label>
        <div className="d-flex align-items-center">
          <Form.Control
            type="number"
            placeholder={t('shopPage.filters.minPrice', 'Min')}
            value={priceRange.min}
            onChange={(e) => onPriceChange('min', e.target.value)}
            min="0"
          />
          <span className="mx-2">-</span>
          <Form.Control
            type="number"
            placeholder={t('shopPage.filters.maxPrice', 'Max')}
            value={priceRange.max}
            onChange={(e) => onPriceChange('max', e.target.value)}
            min="0"
          />
        </div>
        <Button variant="primary" onClick={onPriceSubmit} className="w-100 mt-2">
          {t('shopPage.filters.applyPrice', 'Apply Price')}
        </Button>
      </Form.Group>

      {/* Brand Filter */}
      <Form.Group className="mb-3">
        <Form.Label>{t('shopPage.filters.brand', 'Brand')}</Form.Label>
        {['Apple', 'Samsung', 'Sony', 'LG'].map(brand => (
          <Form.Check
            type="checkbox"
            key={brand}
            id={`brand-${brand}`}
            label={brand}
            checked={selectedBrands.includes(brand)}
            onChange={() => onBrandChange(brand)}
          />
        ))}
      </Form.Group>

      {/* Category Filter */}
      <Form.Group controlId="categoryFilter" className="mb-3">
        <Form.Label>{t('shopPage.filters.category', 'Category')}</Form.Label>
        <Form.Select value={selectedCategory} onChange={onCategoryChange}>
          <option value="">{t('shopPage.filters.allCategories', 'All Categories')}</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>
              {i18n.language === 'ar' ? cat.name_ar : cat.name_en}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* Sort By */}
      <Form.Group controlId="sortProducts" className="mb-3">
        <Form.Label>{t('shopPage.filters.sortBy', 'Sort By')}</Form.Label>
        <Form.Select value={sortBy} onChange={onSortChange}>
          <option value="-createdAt">{t('shopPage.filters.sortNewest', 'Newest')}</option>
          <option value="price">{t('shopPage.filters.sortPriceAsc', 'Price: Low to High')}</option>
          <option value="-price">{t('shopPage.filters.sortPriceDesc', 'Price: High to Low')}</option>
          <option value="-averageRating">{t('shopPage.filters.sortPopularity', 'Popularity')}</option>
        </Form.Select>
      </Form.Group>

      {/* Search Filter */}
      <Form onSubmit={onSearchSubmit}>
        <Form.Label>{t('shopPage.filters.searchProducts', 'Search Products')}</Form.Label>
        <Form.Control
            type="search"
            placeholder={t('shopPage.filters.searchPlaceholder', 'Enter keyword...')}
            value={searchTerm}
            onChange={onSearchChange}
        />
      </Form>
    </Card>
  );
};

export default FilterSidebar;

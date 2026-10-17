import { Product, CategoryKey } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'auro-item-01',
    nameMn: 'Placeholder 01',
    nameEn: 'Placeholder 01',
    category: 'new',
    categoryMn: 'Шинэ загвар',
    categoryEn: 'New In',
    gender: 'women',
    imagePlaceholderText: 'PLACEHOLDER 01',
    descriptionMn: 'Placeholder',
    descriptionEn: 'Placeholder',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { nameMn: 'Өнгө 1', nameEn: 'Color 1', hex: '#262626' },
      { nameMn: 'Өнгө 2', nameEn: 'Color 2', hex: '#d4cbbd' }
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 'auro-item-02',
    nameMn: 'Placeholder 02',
    nameEn: 'Placeholder 02',
    category: 'men',
    categoryMn: '✦ MEN',
    categoryEn: '✦ MEN',
    gender: 'men',
    imagePlaceholderText: 'PLACEHOLDER 02',
    descriptionMn: 'Placeholder',
    descriptionEn: 'Placeholder',
    sizes: ['M', 'L', 'XL'],
    colors: [
      { nameMn: 'Өнгө 1', nameEn: 'Color 1', hex: '#1c1b1a' },
      { nameMn: 'Өнгө 2', nameEn: 'Color 2', hex: '#63594c' }
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 'auro-item-03',
    nameMn: 'Placeholder 03',
    nameEn: 'Placeholder 03',
    category: 'women',
    categoryMn: '✦ WOMEN',
    categoryEn: '✦ WOMEN',
    gender: 'women',
    imagePlaceholderText: 'PLACEHOLDER 03',
    descriptionMn: 'Placeholder',
    descriptionEn: 'Placeholder',
    sizes: ['S', 'M', 'L'],
    colors: [
      { nameMn: 'Өнгө 1', nameEn: 'Color 1', hex: '#8a7d6e' }
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 'auro-item-04',
    nameMn: 'Placeholder 04',
    nameEn: 'Placeholder 04',
    category: 'men',
    categoryMn: '✦ MEN',
    categoryEn: '✦ MEN',
    gender: 'men',
    imagePlaceholderText: 'PLACEHOLDER 04',
    descriptionMn: 'Placeholder',
    descriptionEn: 'Placeholder',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { nameMn: 'Өнгө 1', nameEn: 'Color 1', hex: '#2b2927' }
    ],
    inStock: true,
    featured: false,
  },
  {
    id: 'auro-item-05',
    nameMn: 'Placeholder 05',
    nameEn: 'Placeholder 05',
    category: 'women',
    categoryMn: '✦ WOMEN',
    categoryEn: '✦ WOMEN',
    gender: 'women',
    imagePlaceholderText: 'PLACEHOLDER 05',
    descriptionMn: 'Placeholder',
    descriptionEn: 'Placeholder',
    sizes: ['S', 'M'],
    colors: [
      { nameMn: 'Өнгө 1', nameEn: 'Color 1', hex: '#cfc6b6' }
    ],
    inStock: true,
    featured: false,
  },
  {
    id: 'auro-item-06',
    nameMn: 'Placeholder 06',
    nameEn: 'Placeholder 06',
    category: 'new',
    categoryMn: 'Шинэ загвар',
    categoryEn: 'New In',
    gender: 'unisex',
    imagePlaceholderText: 'PLACEHOLDER 06',
    descriptionMn: 'Placeholder',
    descriptionEn: 'Placeholder',
    inStock: true,
    featured: false,
  }
];

export const CATEGORIES: { key: CategoryKey; labelMn: string; labelEn: string; count: number }[] = [
  { key: 'all', labelMn: 'Бүх бараа', labelEn: 'All Products', count: PRODUCTS.length },
  { key: 'men', labelMn: '✦ MEN', labelEn: '✦ MEN', count: 2 },
  { key: 'women', labelMn: '✦ WOMEN', labelEn: '✦ WOMEN', count: 2 },
  { key: 'new', labelMn: 'Шинэ загвар', labelEn: 'New In', count: 2 },
];

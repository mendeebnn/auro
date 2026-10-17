import React, { useState, useMemo, useRef } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X, Tag } from 'lucide-react';
import { Product, Language, CategoryKey } from '../types';
import { CATEGORIES } from '../data/products';
import { ProductCard } from './ProductCard';

interface CollectionPageProps {
  products: Product[];
  lang: Language;
  onSelectProduct: (product: Product) => void;
  onAddToCart?: (product: Product, quantity: number) => void;
  selectedCategory?: CategoryKey;
}

export const CollectionPage: React.FC<CollectionPageProps> = ({
  products,
  lang,
  onSelectProduct,
  onAddToCart,
  selectedCategory: initialCategory = 'all',
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'name-asc' | 'name-desc'>('featured');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const quickKeywords: { labelMn: string; labelEn: string; query: string }[] = [
    { labelMn: '✦ MEN', labelEn: '✦ MEN', query: 'men' },
    { labelMn: '✦ WOMEN', labelEn: '✦ WOMEN', query: 'women' },
    { labelMn: 'Шинэ загвар', labelEn: 'New In', query: 'new' },
  ];

  // Tokenized search
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Advanced tokenized search
    const cleanQuery = searchQuery.trim().toLowerCase();
    if (cleanQuery) {
      const tokens = cleanQuery.split(/\s+/).filter(Boolean);

      result = result.filter((p) => {
        const searchCorpus = [
          p.nameMn,
          p.nameEn,
          p.descriptionMn,
          p.descriptionEn,
          p.categoryMn,
          p.categoryEn,
          p.gender || '',
          p.imagePlaceholderText,
          ...(p.sizes || []),
        ]
          .join(' ')
          .toLowerCase();

        return tokens.every((token) => searchCorpus.includes(token));
      });
    }

    // Sorting
    if (sortBy === 'name-asc') {
      result.sort((a, b) =>
        (lang === 'mn' ? a.nameMn : a.nameEn).localeCompare(lang === 'mn' ? b.nameMn : b.nameEn)
      );
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) =>
        (lang === 'mn' ? b.nameMn : b.nameEn).localeCompare(lang === 'mn' ? a.nameMn : a.nameEn)
      );
    } else {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [products, activeCategory, searchQuery, sortBy, lang]);

  const handleApplyKeyword = (kwQuery: string) => {
    setSearchQuery(kwQuery);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleClearAll = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setSortBy('featured');
  };

  const hasActiveFilters = searchQuery.trim() !== '' || activeCategory !== 'all';

  return (
    <div className="bg-[#fcfbfa] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title Section */}
        <div className="border-b border-[#eae5dc] pb-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="text-left">
              <p className="text-xs uppercase tracking-[0.2em] text-[#7a7367] font-semibold mb-2">
                AURO | FASHION STORE 🖤
              </p>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#191817]">
                {lang === 'mn' ? 'Бүх бүтээгдэхүүн' : 'All Products'}
              </h1>
            </div>

            {/* Product Count Display */}
            <div className="text-xs text-[#736c61] uppercase tracking-wider font-mono tabular-nums">
              {lang === 'mn'
                ? `Нийт: ${filteredProducts.length} бүтээгдэхүүн`
                : `Showing: ${filteredProducts.length} pieces`}
            </div>
          </div>

          {/* Interactive Searchable Toolbar */}
          <div className="mt-8 space-y-4">
            
            {/* Search Bar */}
            <div className="relative w-full">
              <div
                className={`flex items-center w-full bg-white border transition-all ${
                  isSearchFocused
                    ? 'border-[#191817] ring-1 ring-[#191817] shadow-xs'
                    : 'border-[#ded7ca] hover:border-[#b8b0a2]'
                }`}
              >
                <div className="pl-3.5 pr-2 text-[#787165]">
                  <Search className="w-4 h-4 stroke-[1.8]" />
                </div>

                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder={
                    lang === 'mn'
                      ? 'Хайх (жишээ: Placeholder, MEN, WOMEN)...'
                      : 'Search (e.g. Placeholder, MEN, WOMEN)...'
                  }
                  className="w-full py-3 text-xs sm:text-sm text-[#191817] placeholder-[#9e9587] bg-transparent focus:outline-hidden"
                />

                {/* Right controls */}
                <div className="flex items-center gap-2 pr-3 shrink-0">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-[#8c8476] hover:text-[#191817] p-1 cursor-pointer transition-colors"
                      title={lang === 'mn' ? 'Хайлтыг арилгах' : 'Clear search'}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <span className="hidden sm:inline-block text-[11px] font-mono text-[#8c8476] bg-[#f5f2ec] px-2 py-0.5 border border-[#e5dfd3]">
                    {filteredProducts.length} {lang === 'mn' ? 'илэрц' : 'results'}
                  </span>
                </div>
              </div>

              {/* Quick Keywords Strip */}
              <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                <span className="text-[#8c8476] shrink-0 font-medium flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  <span>{lang === 'mn' ? 'Түлхүүр:' : 'Tags:'}</span>
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  {quickKeywords.map((kw, idx) => {
                    const isSelected = searchQuery.toLowerCase() === kw.query.toLowerCase();
                    return (
                      <button
                        key={idx}
                        onClick={() => handleApplyKeyword(kw.query)}
                        className={`px-2.5 py-1 text-[11px] tracking-wide uppercase transition-colors cursor-pointer border rounded-xs ${
                          isSelected
                            ? 'bg-[#191817] text-white border-[#191817]'
                            : 'bg-white text-[#575045] border-[#e2dcd2] hover:border-[#191817] hover:text-[#191817]'
                        }`}
                      >
                        {lang === 'mn' ? kw.labelMn : kw.labelEn}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Category Filter Buttons & Sort Toolbar */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-2">
              
              {/* Category Segmented Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setActiveCategory(cat.key)}
                      className={`px-3.5 py-2 text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                        isActive
                          ? 'bg-[#191817] text-[#fcfbfa] border-[#191817]'
                          : 'bg-white text-[#5c564c] border-[#e2dcd2] hover:border-[#b8b0a2] hover:text-[#191817]'
                      }`}
                    >
                      {lang === 'mn' ? cat.labelMn : cat.labelEn}
                    </button>
                  );
                })}
              </div>

              {/* Sort Selector & Reset Button */}
              <div className="flex items-center gap-3">
                {hasActiveFilters && (
                  <button
                    onClick={handleClearAll}
                    className="text-xs text-[#787165] hover:text-[#191817] underline transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {lang === 'mn' ? 'Шүүлтүүрийг цэвэрлэх' : 'Reset All'}
                  </button>
                )}

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none pl-3 pr-8 py-2 text-xs bg-white border border-[#e2dcd2] text-[#191817] font-semibold focus:outline-hidden focus:border-[#191817] cursor-pointer"
                  >
                    <option value="featured">{lang === 'mn' ? 'Эхлээд онцлох' : 'Featured First'}</option>
                    <option value="name-asc">{lang === 'mn' ? 'Нэр: А-Я' : 'Name: A to Z'}</option>
                    <option value="name-desc">{lang === 'mn' ? 'Нэр: Я-А' : 'Name: Z to A'}</option>
                  </select>
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#8f8779] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                lang={lang}
                onSelect={onSelectProduct}
                onQuickAdd={(p) => onAddToCart && onAddToCart(p, 1)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-20 text-center border border-dashed border-[#dcd6cc] bg-[#f7f5f0] p-8 max-w-xl mx-auto">
            <SlidersHorizontal className="w-8 h-8 text-[#999080] mx-auto mb-3" />
            <p className="text-base font-semibold text-[#191817]">
              {lang === 'mn' ? 'Бүтээгдэхүүн олдсонгүй' : 'No pieces found'}
            </p>
            <button
              onClick={handleClearAll}
              className="mt-6 px-5 py-2.5 bg-[#191817] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#333] transition-colors cursor-pointer"
            >
              {lang === 'mn' ? 'Шүүлтүүрийг арилгах' : 'Clear Filters'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

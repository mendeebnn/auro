/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProductCard } from './components/ProductCard';
import { CollectionPage } from './components/CollectionPage';
import { ProductDetail } from './components/ProductDetail';
import { CartDrawer } from './components/CartDrawer';
import { InstagramSection } from './components/InstagramSection';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';
import { PRODUCTS as DEFAULT_PRODUCTS } from './data/products';
import { Product, CartItem, Language, PageView, CategoryKey } from './types';
import { ArrowRight, Sparkles } from 'lucide-react';

const STORAGE_KEY_CART = 'auro_mongolia_cart';
const STORAGE_KEY_LANG = 'auro_mongolia_lang';
const STORAGE_KEY_PRODUCTS = 'auro_mongolia_products';

export default function App() {
  const [currentView, setCurrentView] = useState<PageView>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#admin') {
      return 'admin';
    }
    return 'home';
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all');
  const [cartOpen, setCartOpen] = useState(false);

  // Dynamic Products state (persisted to localStorage)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  });

  // Sync products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.warn('Storage error saving products', e);
    }
  }, [products]);

  // Language state (persisted)
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LANG);
      return saved === 'en' || saved === 'mn' ? saved : 'mn';
    } catch {
      return 'mn';
    }
  });

  // Cart state (persisted)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Listen for hash changes (e.g. #admin)
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      } else if (window.location.hash === '' && currentView === 'admin') {
        setCurrentView('home');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [currentView]);

  // Sync lang to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [lang]);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [cartItems]);

  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  // Cart actions
  const handleAddToCart = (product: Product, quantity: number, size?: string, color?: string) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (it) =>
          it.product.id === product.id &&
          it.selectedSize === size &&
          it.selectedColor === color
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      } else {
        return [...prev, { product, quantity, selectedSize: size, selectedColor: color }];
      }
    });
  };

  const handleBuyNow = (product: Product, quantity: number, size?: string, color?: string) => {
    handleAddToCart(product, quantity, size, color);
    setCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((it) => (it.product.id === productId ? { ...it, quantity } : it))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((it) => it.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Navigation handlers
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: PageView) => {
    setCurrentView(view);
    if (view === 'admin') {
      window.location.hash = 'admin';
    } else {
      if (window.location.hash === '#admin') {
        history.replaceState(null, '', ' ');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (cat: CategoryKey) => {
    setSelectedCategory(cat);
    setCurrentView('collection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in admin view, render AdminPanel directly
  if (currentView === 'admin') {
    return (
      <AdminPanel
        products={products}
        onUpdateProducts={setProducts}
        onExit={() => handleNavigate('home')}
        lang={lang}
      />
    );
  }

  const featuredProducts = products.filter((p) => p.featured).slice(0, 3);
  const displayFeatured = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbfa] text-[#191817]">
      {/* Top Header */}
      <Header
        currentView={currentView}
        setCurrentView={handleNavigate}
        lang={lang}
        setLang={setLang}
        cartCount={totalCartCount}
        onOpenCart={() => setCartOpen(true)}
        onSelectCategory={handleSelectCategory}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            {/* Hero Section */}
            <HeroSection
              lang={lang}
              onExplore={handleNavigate}
              onSelectCategory={handleSelectCategory}
            />

            {/* Featured Best Sellers Section (3-Column Desktop Grid) */}
            <section className="py-16 sm:py-24 border-b border-[#eae5dc]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                  <div className="text-left">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#7a7367] font-semibold mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#8c8273]" />
                      <span>{lang === 'mn' ? 'Онцлох бүтээгдэхүүнүүд' : 'Featured Collection'}</span>
                    </div>
                    <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#191817]">
                      {lang === 'mn' ? 'Шинэ загварууд' : 'New In Selection'}
                    </h2>
                  </div>

                  <button
                    onClick={() => handleNavigate('collection')}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#191817] hover:text-[#524b41] transition-colors cursor-pointer group"
                  >
                    <span>{lang === 'mn' ? 'Бүх барааг үзэх' : 'Shop All Products'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {displayFeatured.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      lang={lang}
                      onSelect={handleSelectProduct}
                      onQuickAdd={(p) => handleAddToCart(p, 1)}
                    />
                  ))}
                </div>

              </div>
            </section>

            {/* Instagram Social Section */}
            <InstagramSection lang={lang} />
          </>
        )}

        {currentView === 'collection' && (
          <CollectionPage
            products={products}
            lang={lang}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            selectedCategory={selectedCategory}
          />
        )}

        {currentView === 'product-detail' && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            allProducts={products}
            lang={lang}
            onBack={() => handleNavigate('collection')}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        )}
      </main>

      {/* Cart / E-Commerce Checkout Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        lang={lang}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* Footer */}
      <Footer
        lang={lang}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

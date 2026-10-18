import React, { useState, useEffect } from 'react';
import {
  Package,
  ShoppingBag,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  X,
  Search,
  Filter,
  ArrowLeft,
  KeyRound,
  Download,
  Upload,
  RotateCcw,
  Phone,
  Clock,
  Sparkles,
  Image as ImageIcon,
  Check,
  Eye,
  AlertTriangle,
  Copy,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Product, OrderDetails, CategoryKey, Language } from '../types';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../data/products';
import { AuroLogo } from './AuroLogo';

interface AdminPanelProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  onExit: () => void;
  lang: Language;
}

const STORAGE_KEY_PASS = 'auro_admin_passcode';
const STORAGE_KEY_ORDERS = 'auro_orders';
const DEFAULT_PASSCODE = '1234';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  onUpdateProducts,
  onExit,
  lang,
}) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('auro_admin_authed') === 'true';
  });
  const [enteredPasscode, setEnteredPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  // Active tab inside admin
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'settings'>('overview');

  // Orders state
  const [orders, setOrders] = useState<OrderDetails[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ORDERS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Product modal state (Add / Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states for Product Modal
  const [formNameMn, setFormNameMn] = useState('');
  const [formNameEn, setFormNameEn] = useState('');
  const [formCategory, setFormCategory] = useState<CategoryKey>('new');
  const [formGender, setFormGender] = useState<'men' | 'women' | 'unisex'>('unisex');
  const [formPlaceholderText, setFormPlaceholderText] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formDescMn, setFormDescMn] = useState('');
  const [formDescEn, setFormDescEn] = useState('');
  const [formSizes, setFormSizes] = useState<string[]>(['S', 'M', 'L']);
  const [formInStock, setFormInStock] = useState(true);
  const [formFeatured, setFormFeatured] = useState(false);
  const [formColorList, setFormColorList] = useState<{ nameMn: string; nameEn: string; hex: string }[]>([
    { nameMn: 'Хар', nameEn: 'Black', hex: '#191817' },
    { nameMn: 'Шаргал', nameEn: 'Oatmeal', hex: '#e4dacf' }
  ]);

  // Product Filters
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<'all' | CategoryKey>('all');

  // Order Filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Settings
  const [currentPasscode, setCurrentPasscode] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_PASS) || DEFAULT_PASSCODE;
  });
  const [newPasscode, setNewPasscode] = useState('');
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // Logo management state
  const [logoInputUrl, setLogoInputUrl] = useState('');
  const [currentLogo, setCurrentLogo] = useState<string | null>(() => {
    try {
      return localStorage.getItem('auro_custom_logo') || null;
    } catch {
      return null;
    }
  });

  const handleSaveLogoUrl = (url: string) => {
    if (url.trim()) {
      localStorage.setItem('auro_custom_logo', url.trim());
      setCurrentLogo(url.trim());
      window.dispatchEvent(new Event('auro_logo_updated'));
      showToast('Брэндийн лого амжилттай солигдлоо!');
    }
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        localStorage.setItem('auro_custom_logo', result);
        setCurrentLogo(result);
        window.dispatchEvent(new Event('auro_logo_updated'));
        showToast('Брэндийн лого амжилттай хадгалагдлаа!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = () => {
    localStorage.removeItem('auro_custom_logo');
    setCurrentLogo(null);
    setLogoInputUrl('');
    window.dispatchEvent(new Event('auro_logo_updated'));
    showToast('Анхны том AURO векторт лого сэргээгдлээ!');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Listen for storage changes if customer submits order
  useEffect(() => {
    const handleStorageUpdate = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_ORDERS);
        if (stored) {
          setOrders(JSON.parse(stored));
        }
      } catch (e) {
        console.warn(e);
      }
    };

    window.addEventListener('auro_orders_updated', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);
    return () => {
      window.removeEventListener('auro_orders_updated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  const saveOrdersToStorage = (updated: OrderDetails[]) => {
    setOrders(updated);
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPasscode.trim() === currentPasscode) {
      setIsAuthenticated(true);
      sessionStorage.setItem('auro_admin_authed', 'true');
      setPasscodeError('');
    } else {
      setPasscodeError('Нууц код буруу байна. (Анхны тохиргоо: 1234)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('auro_admin_authed');
    setEnteredPasscode('');
  };

  // Open Product Modal (New or Edit)
  const openNewProductModal = () => {
    setEditingProduct(null);
    setFormNameMn(`Placeholder 0${products.length + 1}`);
    setFormNameEn(`Placeholder 0${products.length + 1}`);
    setFormCategory('new');
    setFormGender('unisex');
    setFormPlaceholderText('NEW LUXURY PIECE');
    setFormImageUrl('');
    setFormDescMn('AURO загварын шинэ загвар. Дээд зэрэглэлийн хийц, өдөр тутмын тансаг мэдрэмж.');
    setFormDescEn('New AURO silhouette. Premium everyday luxury craftsmanship.');
    setFormSizes(['S', 'M', 'L']);
    setFormInStock(true);
    setFormFeatured(false);
    setFormColorList([
      { nameMn: 'Хар', nameEn: 'Black', hex: '#191817' },
      { nameMn: 'Шаргал', nameEn: 'Oatmeal', hex: '#e4dacf' }
    ]);
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setFormNameMn(product.nameMn);
    setFormNameEn(product.nameEn);
    setFormCategory(product.category);
    setFormGender(product.gender || 'unisex');
    setFormPlaceholderText(product.imagePlaceholderText || '');
    setFormImageUrl(product.imageUrl || '');
    setFormDescMn(product.descriptionMn);
    setFormDescEn(product.descriptionEn);
    setFormSizes(product.sizes || ['Free']);
    setFormInStock(product.inStock);
    setFormFeatured(product.featured);
    setFormColorList(product.colors || []);
    setIsProductModalOpen(true);
  };

  // Handle Save Product (Create / Update)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNameMn.trim()) {
      alert('Бүтээгдэхүүний нэрийг оруулна уу.');
      return;
    }

    const categoryNames: Record<CategoryKey, { mn: string; en: string }> = {
      all: { mn: 'Бүгд', en: 'All' },
      new: { mn: 'Шинэ загвар', en: 'New Arrival' },
      men: { mn: 'Эрэгтэй', en: 'Men' },
      women: { mn: 'Эмэгтэй', en: 'Women' },
    };

    if (editingProduct) {
      // Update existing
      const updated = products.map((p) => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            nameMn: formNameMn,
            nameEn: formNameEn || formNameMn,
            category: formCategory,
            categoryMn: categoryNames[formCategory].mn,
            categoryEn: categoryNames[formCategory].en,
            gender: formGender,
            imagePlaceholderText: formPlaceholderText || formNameMn.toUpperCase(),
            imageUrl: formImageUrl.trim() ? formImageUrl.trim() : undefined,
            descriptionMn: formDescMn,
            descriptionEn: formDescEn || formDescMn,
            sizes: formSizes,
            colors: formColorList,
            inStock: formInStock,
            featured: formFeatured,
          };
        }
        return p;
      });
      onUpdateProducts(updated);
      showToast('Бүтээгдэхүүн амжилттай шинэчлэгдлээ!');
    } else {
      // Add new
      const newProduct: Product = {
        id: `auro-item-${Date.now().toString().slice(-5)}`,
        nameMn: formNameMn,
        nameEn: formNameEn || formNameMn,
        category: formCategory,
        categoryMn: categoryNames[formCategory].mn,
        categoryEn: categoryNames[formCategory].en,
        gender: formGender,
        imagePlaceholderText: formPlaceholderText || formNameMn.toUpperCase(),
        imageUrl: formImageUrl.trim() ? formImageUrl.trim() : undefined,
        descriptionMn: formDescMn,
        descriptionEn: formDescEn || formDescMn,
        sizes: formSizes,
        colors: formColorList,
        inStock: formInStock,
        featured: formFeatured,
      };
      onUpdateProducts([newProduct, ...products]);
      showToast('Шинэ бүтээгдэхүүн нэмэгдлээ!');
    }
    setIsProductModalOpen(false);
  };

  // Delete product
  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`"${name}" бүтээгдэхүүнийг устгахдаа итгэлтэй байна уу?`)) {
      const updated = products.filter((p) => p.id !== id);
      onUpdateProducts(updated);
      showToast('Бүтээгдэхүүнийг устгалаа.');
    }
  };

  // Quick toggle in stock
  const toggleStock = (id: string) => {
    const updated = products.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p));
    onUpdateProducts(updated);
  };

  // Quick toggle featured
  const toggleFeatured = (id: string) => {
    const updated = products.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p));
    onUpdateProducts(updated);
  };

  // Reset to default catalog
  const handleResetCatalog = () => {
    if (window.confirm('Анхны бүх бүтээгдэхүүний жагсаалтыг сэргээх үү?')) {
      onUpdateProducts(DEFAULT_PRODUCTS);
      showToast('Анхны каталог сэргээгдлээ!');
    }
  };

  // Image file upload handler (converts to base64 for instant storage)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Зургийн хэмжээ 2MB-аас бага байх шаардлагатай.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Change order status
  const updateOrderStatus = (orderId: string, status: OrderDetails['status']) => {
    const updated = orders.map((o) => (o.orderId === orderId ? { ...o, status } : o));
    saveOrdersToStorage(updated);
    showToast(`Захиалга ${orderId}-ийн төлөв шинэчлэгдлээ.`);
  };

  // Delete order
  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm(`Захиалга ${orderId}-ийг устгах уу?`)) {
      const updated = orders.filter((o) => o.orderId !== orderId);
      saveOrdersToStorage(updated);
      showToast('Захиалгыг устгалаа.');
    }
  };

  // Clear all orders
  const handleClearOrders = () => {
    if (window.confirm('Бүх хүсэлт, захиалгын түүхийг цэвэрлэхдээ итгэлтэй байна уу?')) {
      saveOrdersToStorage([]);
      showToast('Захиалгын түүхийг цэвэрлэлээ.');
    }
  };

  // Add demo order for testing
  const handleAddTestOrder = () => {
    const sampleProduct = products[0] || DEFAULT_PRODUCTS[0];
    const demoOrder: OrderDetails = {
      orderId: `AURO-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [
        {
          product: sampleProduct,
          quantity: 1,
          selectedSize: 'M',
          selectedColor: 'Хар'
        }
      ],
      customerName: 'Туршилтын Хэрэглэгч',
      customerPhone: '9911-0000',
      city: 'Улаанбаатар',
      district: 'Сүхбаатар дүүрэг',
      streetAddress: '1-р хороо, 22-р байр 15 тоот',
      notes: 'Орой 18 цагаас хойш хүргэж өгнө үү.',
      createdAt: new Date().toLocaleString('mn-MN'),
      status: 'new'
    };
    saveOrdersToStorage([demoOrder, ...orders]);
    showToast('Туршилтын захиалга нэмэгдлээ!');
  };

  // Copy order summary text for Instagram / SMS
  const handleCopyOrderText = (order: OrderDetails) => {
    const text = [
      `[AURO Захиалга: ${order.orderId}]`,
      `Харилцагч: ${order.customerName}`,
      `Утас: ${order.customerPhone}`,
      `Хаяг: ${order.city}, ${order.district}, ${order.streetAddress}`,
      `Тэмдэглэл: ${order.notes || 'Байхгүй'}`,
      `Бараанууд:`,
      ...order.items.map(
        (it) => `• ${it.product.nameMn} (${it.quantity}ш) [Размер: ${it.selectedSize || 'Standard'}] [Өнгө: ${it.selectedColor || 'Default'}]`
      ),
      `Төлөв: ${order.status || 'Шинэ'}`
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopiedOrderId(order.orderId);
    setTimeout(() => setCopiedOrderId(null), 2000);
    showToast('Захиалгын мэдээлэл хуулагдлаа.');
  };

  // Change Admin Passcode
  const handleSavePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasscode.trim() || newPasscode.length < 4) {
      alert('Нууц код дор хаяж 4 оронтой байх ёстой.');
      return;
    }
    localStorage.setItem(STORAGE_KEY_PASS, newPasscode.trim());
    setCurrentPasscode(newPasscode.trim());
    setNewPasscode('');
    showToast('Админ нууц код амжилттай шинэчлэгдлээ!');
  };

  // Export JSON backup
  const handleExportData = () => {
    const backupData = {
      auro_backup_version: '1.0',
      exported_at: new Date().toISOString(),
      products,
      orders
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auro-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Нөөц файл татагдлаа.');
  };

  // Import JSON backup
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.products && Array.isArray(parsed.products)) {
          onUpdateProducts(parsed.products);
        }
        if (parsed.orders && Array.isArray(parsed.orders)) {
          saveOrdersToStorage(parsed.orders);
        }
        showToast('Өгөгдөл амжилттай сэргээгдлээ!');
      } catch (err) {
        alert('Файл буруу форматтай байна.');
      }
    };
    reader.readAsText(file);
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.nameMn.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.id.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory =
      productCategoryFilter === 'all' || p.category === productCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderId.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerPhone.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus =
      orderStatusFilter === 'all' || (o.status || 'new') === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingOrdersCount = orders.filter((o) => !o.status || o.status === 'new').length;

  // 1. LOGIN SCREEN (If not authenticated)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#141312] text-[#fcfbfa] flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md bg-[#1d1b19] border border-[#332f2a] rounded-sm p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#2a2622] text-[#d6cdbf] mb-4 border border-[#3d3730]">
              <KeyRound className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h1 className="font-serif-luxury text-3xl font-medium tracking-wider text-white">
              AURO ADMIN PORTAL
            </h1>
            <p className="text-xs uppercase tracking-widest text-[#a39887] mt-1">
              Дэлгүүрийн удирдлагын систем
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#c7beaf] mb-1.5">
                Админ Нууц код (PIN)
              </label>
              <input
                type="password"
                required
                autoFocus
                value={enteredPasscode}
                onChange={(e) => setEnteredPasscode(e.target.value)}
                placeholder="Анхны код: 1234"
                className="w-full px-4 py-3 bg-[#141312] border border-[#3d3730] text-white text-sm tracking-widest text-center focus:outline-hidden focus:border-[#d6cdbf] placeholder:text-[#5e574d] rounded-xs"
              />
              {passcodeError && (
                <p className="text-xs text-rose-400 mt-2 text-center">{passcodeError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#fcfbfa] text-[#141312] hover:bg-[#eae5dc] text-xs uppercase tracking-[0.2em] font-bold transition-colors cursor-pointer rounded-xs"
            >
              Нэвтрэх
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#2e2a25] flex items-center justify-between text-xs text-[#827869]">
            <span>Анхны нууц код: 1234</span>
            <button
              type="button"
              onClick={onExit}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Дэлгүүр рүү буцах</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. MAIN ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#191817] flex flex-col font-sans-clean">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#191817] text-white px-5 py-3 rounded-xs shadow-2xl flex items-center gap-3 text-xs tracking-wider border border-[#333]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Header */}
      <header className="bg-[#141312] text-white border-b border-[#292622] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onExit}
              className="p-1.5 text-[#9e9587] hover:text-white transition-colors cursor-pointer"
              title="Дэлгүүрийн сайт руу буцах"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <AuroLogo size="sm" inverted={true} />
              <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#a39887] border-l border-[#3d3730] pl-3">
                ADMIN PORTAL
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExit}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#c9c1b3] hover:text-white border border-[#3d3730] hover:border-[#595045] transition-colors rounded-xs cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Дэлгүүр харах</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-[#292622] hover:bg-[#3d3832] text-xs text-[#eae5dc] uppercase tracking-wider font-semibold transition-colors rounded-xs cursor-pointer"
            >
              Гарах
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto border-t border-[#24211e]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-semibold tracking-wider uppercase whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-white text-white'
                : 'border-transparent text-[#948b7d] hover:text-[#d1c8ba]'
            }`}
          >
            Хяналтын самбар
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-4 text-xs font-semibold tracking-wider uppercase whitespace-nowrap border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'products'
                ? 'border-white text-white'
                : 'border-transparent text-[#948b7d] hover:text-[#d1c8ba]'
            }`}
          >
            <span>Бүтээгдэхүүн</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-[#2d2925] rounded-full text-[#d6cdbf]">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 text-xs font-semibold tracking-wider uppercase whitespace-nowrap border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-white text-white'
                : 'border-transparent text-[#948b7d] hover:text-[#d1c8ba]'
            }`}
          >
            <span>Захиалга & Лавлагаа</span>
            {pendingOrdersCount > 0 ? (
              <span className="text-[10px] px-1.5 py-0.2 bg-amber-500 text-black font-bold rounded-full">
                {pendingOrdersCount}
              </span>
            ) : (
              <span className="text-[10px] px-1.5 py-0.2 bg-[#2d2925] rounded-full text-[#d6cdbf]">
                {orders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 text-xs font-semibold tracking-wider uppercase whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'border-white text-white'
                : 'border-transparent text-[#948b7d] hover:text-[#d1c8ba]'
            }`}
          >
            Тохиргоо & Нөөц
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 bg-white border border-[#ded8cb] rounded-xs shadow-xs">
                <div className="flex items-center justify-between text-[#787164] mb-3">
                  <span className="text-xs uppercase tracking-wider font-semibold">Нийт бүтээгдэхүүн</span>
                  <Package className="w-5 h-5" />
                </div>
                <p className="font-serif-luxury text-3xl font-bold text-[#191817]">
                  {products.length}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-[#787164]">
                  <span>Бэлэн: {products.filter((p) => p.inStock).length}</span>
                  <span>•</span>
                  <span>Дууссан: {products.filter((p) => !p.inStock).length}</span>
                </div>
              </div>

              <div className="p-5 bg-white border border-[#ded8cb] rounded-xs shadow-xs">
                <div className="flex items-center justify-between text-[#787164] mb-3">
                  <span className="text-xs uppercase tracking-wider font-semibold">Шинэ загвар (New)</span>
                  <Sparkles className="w-5 h-5 text-amber-600" />
                </div>
                <p className="font-serif-luxury text-3xl font-bold text-[#191817]">
                  {products.filter((p) => p.category === 'new').length}
                </p>
                <p className="mt-2 text-xs text-[#787164]">
                  Шинэ загварын ангилалд
                </p>
              </div>

              <div className="p-5 bg-white border border-[#ded8cb] rounded-xs shadow-xs">
                <div className="flex items-center justify-between text-[#787164] mb-3">
                  <span className="text-xs uppercase tracking-wider font-semibold">MEN / WOMEN</span>
                  <div className="text-[10px] font-mono uppercase bg-[#f0eae1] px-1.5 py-0.5 rounded-2xs text-[#524a3e]">
                    Gender
                  </div>
                </div>
                <p className="font-serif-luxury text-3xl font-bold text-[#191817]">
                  {products.filter((p) => p.category === 'men').length} / {products.filter((p) => p.category === 'women').length}
                </p>
                <p className="mt-2 text-xs text-[#787164]">
                  {products.filter((p) => p.category === 'men').length} Men, {products.filter((p) => p.category === 'women').length} Women
                </p>
              </div>

              <div className="p-5 bg-white border border-[#ded8cb] rounded-xs shadow-xs">
                <div className="flex items-center justify-between text-[#787164] mb-3">
                  <span className="text-xs uppercase tracking-wider font-semibold">Хүсэлт & Захиалга</span>
                  <ShoppingBag className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="font-serif-luxury text-3xl font-bold text-[#191817]">
                  {orders.length}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-amber-700 font-medium">
                  <span>Шинэ хүсэлт: {pendingOrdersCount}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left 2 Cols: Recent Inquiries */}
              <div className="lg:col-span-2 bg-white border border-[#ded8cb] rounded-xs p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#eae5dc]">
                  <h2 className="text-sm uppercase tracking-wider font-bold text-[#191817]">
                    Сүүлийн хүсэлт & захиалгууд
                  </h2>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#6e675b] hover:text-[#191817] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Бүгдийг харах</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="py-12 text-center text-[#787164] space-y-3">
                    <ShoppingBag className="w-8 h-8 mx-auto text-[#aba396] stroke-[1.5]" />
                    <p className="text-sm font-medium">Одоогоор ирсэн захиалга алга байна.</p>
                    <button
                      onClick={handleAddTestOrder}
                      className="px-4 py-2 bg-[#191817] text-white text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#333] transition-colors cursor-pointer"
                    >
                      + Туршилтын захиалга үүсгэх
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-[#f0eae1]">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.orderId} className="py-3 flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#191817]">
                              {order.orderId}
                            </span>
                            <span
                              className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-2xs ${
                                !order.status || order.status === 'new'
                                  ? 'bg-amber-100 text-amber-800'
                                  : order.status === 'contacted'
                                  ? 'bg-blue-100 text-blue-800'
                                  : order.status === 'completed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-stone-200 text-stone-700'
                              }`}
                            >
                              {order.status === 'contacted'
                                ? 'Холбогдсон'
                                : order.status === 'completed'
                                ? 'Баталгаажсан'
                                : order.status === 'cancelled'
                                ? 'Цуцалсан'
                                : 'Шинэ хүсэлт'}
                            </span>
                          </div>
                          <p className="text-xs text-[#524a3e]">
                            <span className="font-semibold">{order.customerName}</span> ({order.customerPhone})
                          </p>
                          <p className="text-[11px] text-[#7d7568]">
                            {order.items.length} бүтээгдэхүүн • {order.createdAt}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyOrderText(order)}
                            className="p-1.5 text-[#6b6456] hover:text-[#191817] border border-[#ded8cb] hover:border-[#191817] rounded-xs cursor-pointer"
                            title="Хуулах"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setActiveTab('orders')}
                            className="text-xs font-semibold text-[#191817] underline underline-offset-4 cursor-pointer"
                          >
                            Нээх
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right 1 Col: Quick Control Panel */}
              <div className="space-y-6">
                <div className="bg-white border border-[#ded8cb] rounded-xs p-6 shadow-xs space-y-4">
                  <h2 className="text-sm uppercase tracking-wider font-bold text-[#191817] pb-2 border-b border-[#eae5dc]">
                    Шуурхай үйлдэл
                  </h2>
                  <div className="space-y-2.5">
                    <button
                      onClick={openNewProductModal}
                      className="w-full py-2.5 px-3 bg-[#191817] text-white hover:bg-[#333] text-xs uppercase tracking-wider font-semibold rounded-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Шинэ бүтээгдэхүүн нэмэх</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="w-full py-2.5 px-3 bg-white border border-[#191817] text-[#191817] hover:bg-[#f7f5f0] text-xs uppercase tracking-wider font-semibold rounded-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Захиалга шалгах ({pendingOrdersCount})</span>
                    </button>
                    <button
                      onClick={handleExportData}
                      className="w-full py-2 px-3 border border-[#ded8cb] text-[#635c4f] hover:text-[#191817] hover:border-[#191817] text-xs uppercase tracking-wider font-semibold rounded-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Өгөгдөл нөөцлөх (JSON)</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-[#ece7df] border border-[#ded6ca] rounded-xs text-xs text-[#524a3e] space-y-2">
                  <p className="font-semibold text-[#191817] uppercase tracking-wider">
                    Зөвлөмж
                  </p>
                  <p>
                    Хэрэглэгчид сагсаа баталгаажуулж Инстаграм лавлагаа үүсгэхэд захиалга нь шууд энэ админ самбарт нэмэгддэг. Та хүссэн үедээ утас руу нь залгах болон Инстаграм хариу бэлтгэх боломжтой.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= TAB 2: PRODUCTS ================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 border border-[#ded8cb] rounded-xs shadow-xs">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-[#8a8172] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Бүтээгдэхүүн хайх..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#fbf9f5] border border-[#ded8cb] focus:outline-hidden focus:border-[#191817] rounded-xs"
                  />
                  {productSearch && (
                    <button
                      onClick={() => setProductSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a8172] hover:text-black cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value as any)}
                  className="px-3 py-2 text-xs bg-[#fbf9f5] border border-[#ded8cb] text-[#191817] rounded-xs focus:outline-hidden focus:border-[#191817]"
                >
                  <option value="all">Бүх ангилал</option>
                  <option value="new">Шинэ загвар</option>
                  <option value="men">MEN (Эрэгтэй)</option>
                  <option value="women">WOMEN (Эмэгтэй)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={openNewProductModal}
                  className="px-4 py-2 bg-[#191817] text-white hover:bg-[#333] text-xs uppercase tracking-wider font-semibold rounded-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Шинэ бараа нэмэх</span>
                </button>
                <button
                  onClick={handleResetCatalog}
                  className="px-3 py-2 border border-[#ded8cb] hover:border-rose-400 text-[#7a7263] hover:text-rose-600 text-xs font-semibold rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Анхны каталогийг сэргээх"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Сэргээх</span>
                </button>
              </div>
            </div>

            {/* Products Table / Cards */}
            <div className="bg-white border border-[#ded8cb] rounded-xs shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#f7f4ed] border-b border-[#ded8cb] text-[#615a4e] uppercase tracking-wider">
                      <th className="py-3 px-4 font-semibold">Зураг</th>
                      <th className="py-3 px-4 font-semibold">Бүтээгдэхүүний нэр</th>
                      <th className="py-3 px-4 font-semibold">Ангилал</th>
                      <th className="py-3 px-4 font-semibold">Хэмжээ</th>
                      <th className="py-3 px-4 font-semibold">Нөөц</th>
                      <th className="py-3 px-4 font-semibold">Онцлох</th>
                      <th className="py-3 px-4 font-semibold text-right">Үйлдэл</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0eae1]">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-[#7a7263]">
                          Тохирох бүтээгдэхүүн олдсонгүй.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-[#fbf9f5] transition-colors">
                          {/* Image preview */}
                          <td className="py-3 px-4">
                            <div className="w-14 h-14 bg-[#ede7df] border border-[#ded6ca] rounded-xs overflow-hidden flex items-center justify-center shrink-0">
                              {p.imageUrl ? (
                                <img
                                  src={p.imageUrl}
                                  alt={p.nameMn}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="text-center p-1">
                                  <ImageIcon className="w-4 h-4 mx-auto text-[#7d7568]" />
                                  <span className="text-[7px] font-mono text-[#696154] block mt-0.5">
                                    PLACEHOLDER
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Name & ID */}
                          <td className="py-3 px-4">
                            <p className="font-semibold text-sm text-[#191817]">{p.nameMn}</p>
                            <p className="text-[11px] text-[#70685b]">{p.nameEn}</p>
                            <span className="font-mono text-[9px] text-[#8f8576] block mt-0.5">
                              ID: {p.id}
                            </span>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4">
                            <span className="font-mono text-[10px] uppercase px-2 py-0.5 bg-[#f0eae1] text-[#4d463b] rounded-2xs border border-[#e0d8cc]">
                              {p.categoryMn}
                            </span>
                          </td>

                          {/* Sizes */}
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {(p.sizes || []).map((s) => (
                                <span
                                  key={s}
                                  className="text-[9px] px-1.5 py-0.2 bg-[#f5f0e6] text-[#61594d] border border-[#ded7ca] rounded-2xs"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Stock status toggle */}
                          <td className="py-3 px-4">
                            <button
                              onClick={() => toggleStock(p.id)}
                              className={`px-2 py-1 rounded-2xs text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                                p.inStock
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                              }`}
                            >
                              {p.inStock ? 'Бэлэн байгаа' : 'Дууссан'}
                            </button>
                          </td>

                          {/* Featured toggle */}
                          <td className="py-3 px-4">
                            <button
                              onClick={() => toggleFeatured(p.id)}
                              className={`px-2 py-1 rounded-2xs text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                                p.featured
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                              }`}
                            >
                              {p.featured ? '✦ Онцлох' : 'Энгийн'}
                            </button>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => openEditProductModal(p)}
                                className="p-1.5 text-[#5e574c] hover:text-[#191817] hover:bg-[#ede7df] rounded-xs transition-colors cursor-pointer"
                                title="Засах"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.nameMn)}
                                className="p-1.5 text-[#736c61] hover:text-rose-600 hover:bg-rose-50 rounded-xs transition-colors cursor-pointer"
                                title="Устгах"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: ORDERS & INQUIRIES ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 border border-[#ded8cb] rounded-xs shadow-xs">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-[#8a8172] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Дугаар, нэр, утсаар хайх..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#fbf9f5] border border-[#ded8cb] focus:outline-hidden focus:border-[#191817] rounded-xs"
                  />
                  {orderSearch && (
                    <button
                      onClick={() => setOrderSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a8172] hover:text-black cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-[#fbf9f5] border border-[#ded8cb] text-[#191817] rounded-xs focus:outline-hidden focus:border-[#191817]"
                >
                  <option value="all">Бүх төлөв</option>
                  <option value="new">Шинэ хүсэлт</option>
                  <option value="contacted">Холбогдсон</option>
                  <option value="completed">Баталгаажсан / Дууссан</option>
                  <option value="cancelled">Цуцалсан</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddTestOrder}
                  className="px-3 py-2 bg-[#191817] text-white hover:bg-[#333] text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer"
                >
                  + Тест захиалга
                </button>
                {orders.length > 0 && (
                  <button
                    onClick={handleClearOrders}
                    className="px-3 py-2 border border-[#ded8cb] text-stone-600 hover:text-rose-600 hover:border-rose-300 text-xs font-semibold rounded-xs transition-colors cursor-pointer"
                  >
                    Бүгдийг цэвэрлэх
                  </button>
                )}
              </div>
            </div>

            {/* Orders Cards List */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white border border-[#ded8cb] rounded-xs p-12 text-center text-[#787164] space-y-3">
                <ShoppingBag className="w-10 h-10 mx-auto text-[#aba396] stroke-[1.2]" />
                <p className="text-base font-semibold text-[#191817]">Хүсэлт олдсонгүй</p>
                <p className="text-xs text-[#70685b]">
                  {orderSearch || orderStatusFilter !== 'all'
                    ? 'Шүүлтүүрт тохирох захиалга олдсонгүй.'
                    : 'Дэлгүүрийн хэрэглэгчид сагсаа баталгаажуулах үед энд харагдана.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const status = order.status || 'new';
                  return (
                    <div
                      key={order.orderId}
                      className="bg-white border border-[#ded8cb] rounded-xs p-6 shadow-xs space-y-4"
                    >
                      {/* Top Header of Card */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#eae5dc]">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold bg-[#191817] text-white px-2.5 py-1 rounded-2xs">
                            {order.orderId}
                          </span>
                          <span className="text-xs text-[#736c61] flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{order.createdAt}</span>
                          </span>
                        </div>

                        {/* Status dropdown */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs uppercase tracking-wider font-semibold text-[#736c61]">
                            Төлөв:
                          </span>
                          <select
                            value={status}
                            onChange={(e) => updateOrderStatus(order.orderId, e.target.value as any)}
                            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-xs border cursor-pointer ${
                              status === 'new'
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : status === 'contacted'
                                ? 'bg-blue-100 text-blue-900 border-blue-300'
                                : status === 'completed'
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                : 'bg-stone-100 text-stone-700 border-stone-300'
                            }`}
                          >
                            <option value="new">Шинэ хүсэлт</option>
                            <option value="contacted">Холбогдсон</option>
                            <option value="completed">Баталгаажсан / Дууссан</option>
                            <option value="cancelled">Цуцалсан</option>
                          </select>
                        </div>
                      </div>

                      {/* Customer info & Address */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-3 bg-[#fbf9f5] border border-[#eee8de] rounded-xs space-y-1.5">
                          <p className="uppercase tracking-wider font-semibold text-[#807769] text-[10px]">
                            Хэрэглэгчийн мэдээлэл
                          </p>
                          <p className="font-semibold text-sm text-[#191817]">
                            {order.customerName}
                          </p>
                          <div className="flex items-center gap-2 pt-1">
                            <a
                              href={`tel:${order.customerPhone}`}
                              className="inline-flex items-center gap-1 font-mono text-emerald-700 font-semibold hover:underline"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>{order.customerPhone}</span>
                            </a>
                          </div>
                        </div>

                        <div className="p-3 bg-[#fbf9f5] border border-[#eee8de] rounded-xs space-y-1.5">
                          <p className="uppercase tracking-wider font-semibold text-[#807769] text-[10px]">
                            Хүргэх хаяг & Тэмдэглэл
                          </p>
                          <p className="text-[#3d3830]">
                            {order.city || 'Улаанбаатар'}, {order.district} {order.streetAddress && `— ${order.streetAddress}`}
                          </p>
                          {order.notes && (
                            <p className="text-[11px] text-[#70685b] italic pt-0.5">
                              « {order.notes} »
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Items Ordered Table */}
                      <div className="border border-[#eee8de] rounded-xs overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#f7f4ed] text-[#70685b] border-b border-[#eee8de] text-[10px] uppercase tracking-wider">
                            <tr>
                              <th className="py-2 px-3 font-semibold">Бүтээгдэхүүн</th>
                              <th className="py-2 px-3 font-semibold">Хэмжээ</th>
                              <th className="py-2 px-3 font-semibold">Өнгө</th>
                              <th className="py-2 px-3 font-semibold text-right">Тоо ширхэг</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#eee8de]">
                            {order.items.map((it, idx) => (
                              <tr key={idx} className="hover:bg-[#faf7f2]">
                                <td className="py-2 px-3 font-medium text-[#191817]">
                                  {it.product.nameMn}
                                </td>
                                <td className="py-2 px-3 font-mono text-[#575045]">
                                  {it.selectedSize || '—'}
                                </td>
                                <td className="py-2 px-3 text-[#575045]">
                                  {it.selectedColor || '—'}
                                </td>
                                <td className="py-2 px-3 text-right font-bold text-[#191817]">
                                  {it.quantity} ширхэг
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-2 flex items-center justify-between text-xs">
                        <button
                          onClick={() => handleCopyOrderText(order)}
                          className="px-3 py-1.5 bg-[#f0eae1] hover:bg-[#e4dcce] text-[#29241e] font-semibold rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {copiedOrderId === order.orderId ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Хуулагдлаа!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Instagram/SMS хариу хуулах</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleDeleteOrder(order.orderId)}
                          className="text-[#8c8273] hover:text-rose-600 transition-colors p-1 cursor-pointer"
                          title="Захиалгыг устгах"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ================= TAB 4: SETTINGS & BACKUP ================= */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-8">
            
            {/* Change PIN */}
            <div className="bg-white border border-[#ded8cb] rounded-xs p-6 shadow-xs space-y-4">
              <div className="pb-3 border-b border-[#eae5dc] flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#191817]" />
                <h2 className="text-sm uppercase tracking-wider font-bold text-[#191817]">
                  Админ Нууц код (PIN) солих
                </h2>
              </div>
              <p className="text-xs text-[#70685b]">
                Одоогийн нууц код: <span className="font-mono font-bold text-[#191817]">{currentPasscode}</span>
              </p>
              <form onSubmit={handleSavePasscode} className="space-y-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#4f483c] mb-1">
                    Шинэ нууц код
                  </label>
                  <input
                    type="password"
                    required
                    value={newPasscode}
                    onChange={(e) => setNewPasscode(e.target.value)}
                    placeholder="Дор хаяж 4 тэмдэгт..."
                    className="w-full px-3 py-2 text-xs bg-[#fbf9f5] border border-[#ded8cb] focus:outline-hidden focus:border-[#191817] rounded-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#191817] text-white hover:bg-[#333] text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer"
                >
                  Нууц код хадгалах
                </button>
              </form>
            </div>

            {/* Brand Logo Settings & Customization */}
            <div className="bg-white border border-[#ded8cb] rounded-xs p-6 shadow-xs space-y-5">
              <div className="pb-3 border-b border-[#eae5dc] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#191817]" />
                  <h2 className="text-sm uppercase tracking-wider font-bold text-[#191817]">
                    Брэндийн Лого тохируулах (Brand Logo)
                  </h2>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#f0eae1] text-[#6b6254] rounded-2xs font-semibold">
                  {currentLogo ? 'Таны оруулсан зураг идэвхтэй' : 'Үндсэн Эмблем (Үггүй)'}
                </span>
              </div>

              <p className="text-xs text-[#70685b] leading-relaxed">
                Сайтын толгой хэсэг (Header) болон бүх хэсэгт харагдах брэндийн лого зургийг тохируулах. Та өөрийн screenshot эсвэл лого зургаа оруулан харьцаа, тайралт (crop)-ыг тохируулах боломжтой.
              </p>

              {/* Live Preview Box */}
              <div className="p-6 bg-[#fcfbfa] border border-[#e5dfd3] rounded-xs flex flex-col items-center justify-center text-center gap-3">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#8c8273] font-semibold">
                  Сайт дээр харагдаж буй байдал:
                </span>
                <div className="py-3 px-6 bg-white border border-[#eae5dc] rounded-xs shadow-2xs flex items-center justify-center min-h-[70px]">
                  <AuroLogo size="lg" />
                </div>
              </div>

              {/* Upload & Crop Controls */}
              <div className="space-y-4 pt-1">
                <div className="p-4 bg-[#f8f6f0] border border-dashed border-[#d5cdbe] rounded-xs text-center space-y-3">
                  <p className="text-xs font-semibold text-[#3d372e] uppercase tracking-wider">
                    Өөрийн лого зураг / Screenshot сонгож байршуулах
                  </p>
                  <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#191817] hover:bg-[#333] text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer shadow-xs">
                    <Upload className="w-4 h-4" />
                    <span>Файл сонгох (Screenshot / PNG / JPG)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFileUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-[#857b6d]">
                    Зургийг яг оригоор нь авч, автоматаар зөв харьцаагаар тохируулж харуулна.
                  </p>
                </div>

                {/* Crop & Fit Mode Options */}
                {currentLogo && (
                  <div className="p-3 bg-white border border-[#ded8cb] rounded-xs space-y-2">
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#4f483c]">
                      Зургийн хэлбэр, тайралт (Fit & Crop):
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.setItem('auro_logo_fit', 'contain');
                          window.dispatchEvent(new Event('auro_logo_updated'));
                          showToast('Бүтэн багтаах (Contain) горим сонгогдлоо');
                        }}
                        className="flex-1 py-1.5 px-3 text-xs font-semibold rounded-2xs border border-[#ded8cb] bg-[#faf8f5] hover:bg-[#eae3d5] text-[#191817] transition-colors"
                      >
                        Багтаах (Fit / Contain)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.setItem('auro_logo_fit', 'cover');
                          window.dispatchEvent(new Event('auro_logo_updated'));
                          showToast('Тайрах (Cover / Crop) горим сонгогдлоо');
                        }}
                        className="flex-1 py-1.5 px-3 text-xs font-semibold rounded-2xs border border-[#ded8cb] bg-[#faf8f5] hover:bg-[#eae3d5] text-[#191817] transition-colors"
                      >
                        Тайрах (Crop / Cover)
                      </button>
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-[#f0eae1]">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#4f483c] mb-1.5">
                    Эсвэл лого зургийн холбоос (URL) оруулах:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={logoInputUrl}
                      onChange={(e) => setLogoInputUrl(e.target.value)}
                      placeholder="https://.../logo.png"
                      className="flex-1 px-3 py-2 text-xs bg-[#fbf9f5] border border-[#ded8cb] focus:outline-hidden focus:border-[#191817] rounded-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveLogoUrl(logoInputUrl)}
                      className="px-4 py-2 bg-[#292622] hover:bg-[#3d3832] text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer"
                    >
                      Хадгалах
                    </button>
                  </div>
                </div>

                {currentLogo && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleResetLogo}
                      className="inline-flex items-center gap-1.5 text-xs text-rose-700 hover:text-rose-900 font-semibold cursor-pointer underline"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Үндсэн график эмблем рүү буцаах</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Backup & Restore */}
            <div className="bg-white border border-[#ded8cb] rounded-xs p-6 shadow-xs space-y-4">
              <div className="pb-3 border-b border-[#eae5dc] flex items-center gap-2">
                <Download className="w-5 h-5 text-[#191817]" />
                <h2 className="text-sm uppercase tracking-wider font-bold text-[#191817]">
                  Өгөгдөл нөөцлөх & Сэргээх (Backup / Restore)
                </h2>
              </div>
              <p className="text-xs text-[#70685b] leading-relaxed">
                Та дэлгүүрийнхээ бүх бүтээгдэхүүн, хүсэлт, тохиргоог бүрэн JSON файлд татаж хадгалах болон дараа нь өөр төхөөрөмж дээр нэг товшилтоор сэргээх боломжтой.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button
                  onClick={handleExportData}
                  className="py-3 px-4 bg-[#191817] text-white hover:bg-[#333] text-xs uppercase tracking-wider font-semibold rounded-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Нөөц файл татах (JSON)</span>
                </button>

                <label className="py-3 px-4 bg-white border border-[#191817] text-[#191817] hover:bg-[#f7f5f0] text-xs uppercase tracking-wider font-semibold rounded-xs flex items-center justify-center gap-2 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Файлаас сэргээх</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Quick Catalog Reset */}
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xs flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                  Каталогийг анхны хэлбэрт оруулах
                </p>
                <p className="text-[11px] text-rose-700 mt-0.5">
                  Бүх нэмсэн бүтээгдэхүүнүүдийг устгаж, анхны загваруудыг сэргээнэ.
                </p>
              </div>
              <button
                onClick={handleResetCatalog}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xs transition-colors shrink-0 cursor-pointer"
              >
                Сэргээх
              </button>
            </div>

          </div>
        )}

      </main>

      {/* ================= MODAL: ADD / EDIT PRODUCT ================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full border border-[#ded8cb] rounded-xs shadow-2xl overflow-hidden my-8">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#141312] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#d6cdbf]" />
                <h3 className="text-xs uppercase tracking-wider font-bold">
                  {editingProduct ? 'Бүтээгдэхүүн засах' : 'Шинэ бүтээгдэхүүн нэмэх'}
                </h3>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 text-[#8f8576] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="p-6 space-y-5 text-xs max-h-[80vh] overflow-y-auto">
              
              {/* Product Names (Mn & En) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#29241e] uppercase tracking-wider">
                    Монгол нэр *
                  </label>
                  <input
                    type="text"
                    required
                    value={formNameMn}
                    onChange={(e) => setFormNameMn(e.target.value)}
                    placeholder="Жишээ нь: Placeholder 01 эсвэл Кашемир цамц"
                    className="w-full px-3 py-2 bg-[#fbf9f5] border border-[#ded8cb] rounded-xs focus:outline-hidden focus:border-[#191817]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#29241e] uppercase tracking-wider">
                    English Name
                  </label>
                  <input
                    type="text"
                    value={formNameEn}
                    onChange={(e) => setFormNameEn(e.target.value)}
                    placeholder="e.g. Placeholder 01 or Cashmere Knit"
                    className="w-full px-3 py-2 bg-[#fbf9f5] border border-[#ded8cb] rounded-xs focus:outline-hidden focus:border-[#191817]"
                  />
                </div>
              </div>

              {/* Category & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#29241e] uppercase tracking-wider">
                    Ангилал *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as CategoryKey)}
                    className="w-full px-3 py-2 bg-[#fbf9f5] border border-[#ded8cb] rounded-xs focus:outline-hidden focus:border-[#191817]"
                  >
                    <option value="new">Шинэ загвар (New Arrival)</option>
                    <option value="men">MEN (Эрэгтэй цуглуулга)</option>
                    <option value="women">WOMEN (Эмэгтэй цуглуулга)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#29241e] uppercase tracking-wider">
                    Хүйс (Gender tag)
                  </label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#fbf9f5] border border-[#ded8cb] rounded-xs focus:outline-hidden focus:border-[#191817]"
                  >
                    <option value="unisex">Unisex (Бүх хүйс)</option>
                    <option value="men">Men (Эрэгтэй)</option>
                    <option value="women">Women (Эмэгтэй)</option>
                  </select>
                </div>
              </div>

              {/* Image Section (Upload photo or Image URL or Placeholder) */}
              <div className="p-4 bg-[#f8f5ee] border border-[#ded6ca] rounded-xs space-y-3">
                <label className="font-bold text-[#191817] uppercase tracking-wider block">
                  Зураг оруулах эсвэл Placeholder сонгох
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="space-y-2">
                    <label className="text-[11px] text-[#5e574c] block">
                      Компьютер / утаснаас зураг сонгох:
                    </label>
                    <label className="px-3 py-2 bg-white border border-[#ded8cb] hover:border-[#191817] text-[#191817] rounded-xs flex items-center justify-center gap-2 font-semibold cursor-pointer">
                      <ImageIcon className="w-4 h-4 text-[#7a7263]" />
                      <span>Зураг хуулах (Max 2MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>

                    <label className="text-[11px] text-[#5e574c] block pt-1">
                      Эсвэл онлайн зургийн URL хаяг:
                    </label>
                    <input
                      type="url"
                      value={formImageUrl}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-1.5 bg-white border border-[#ded8cb] rounded-xs focus:outline-hidden focus:border-[#191817]"
                    />
                  </div>

                  {/* Image preview frame */}
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-[10px] uppercase tracking-wider text-[#7a7263] mb-1 font-semibold">
                      Урьдчилан харах:
                    </span>
                    <div className="w-28 h-28 bg-[#ece7df] border border-[#ded6ca] rounded-xs overflow-hidden flex flex-col items-center justify-center text-center p-2">
                      {formImageUrl ? (
                        <div className="relative w-full h-full group">
                          <img
                            src={formImageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setFormImageUrl('')}
                            className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full hover:bg-black cursor-pointer"
                            title="Зургийг арилгах"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <ImageIcon className="w-5 h-5 mx-auto text-[#7d7568]" />
                          <p className="font-mono text-[9px] font-bold uppercase text-[#191817]">
                            PLACEHOLDER
                          </p>
                          <p className="text-[7px] text-[#787163] uppercase">
                            {formPlaceholderText || 'AURO ITEM'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#ded8cb]">
                  <label className="text-[11px] text-[#5e574c] block mb-1">
                    Placeholder бичвэр (Зураг байхгүй үед харагдах текст):
                  </label>
                  <input
                    type="text"
                    value={formPlaceholderText}
                    onChange={(e) => setFormPlaceholderText(e.target.value)}
                    placeholder="Жишээ: MINIMAL WOOL COAT"
                    className="w-full px-3 py-1.5 bg-white border border-[#ded8cb] rounded-xs focus:outline-hidden focus:border-[#191817]"
                  />
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#29241e] uppercase tracking-wider block">
                  Хэмжээ (Размер)
                </label>
                <div className="flex flex-wrap gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'Free'].map((sz) => {
                    const isChecked = formSizes.includes(sz);
                    return (
                      <button
                        type="button"
                        key={sz}
                        onClick={() => {
                          if (isChecked) {
                            setFormSizes(formSizes.filter((s) => s !== sz));
                          } else {
                            setFormSizes([...formSizes, sz]);
                          }
                        }}
                        className={`px-3 py-1 text-xs font-mono font-semibold rounded-2xs border transition-colors cursor-pointer ${
                          isChecked
                            ? 'bg-[#191817] text-white border-[#191817]'
                            : 'bg-white text-[#575045] border-[#ded8cb] hover:border-[#191817]'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description (Mn & En) */}
              <div className="space-y-1">
                <label className="font-semibold text-[#29241e] uppercase tracking-wider">
                  Монгол тайлбар
                </label>
                <textarea
                  rows={2}
                  value={formDescMn}
                  onChange={(e) => setFormDescMn(e.target.value)}
                  placeholder="Бүтээгдэхүүний хийц, загварын онцлог..."
                  className="w-full px-3 py-2 bg-[#fbf9f5] border border-[#ded8cb] rounded-xs focus:outline-hidden focus:border-[#191817]"
                />
              </div>

              {/* Toggles: In Stock & Featured */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-[#ded8cb]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formInStock}
                    onChange={(e) => setFormInStock(e.target.checked)}
                    className="w-4 h-4 accent-[#191817]"
                  />
                  <span className="font-semibold text-[#191817]">Бэлэн байгаа (In Stock)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="w-4 h-4 accent-[#191817]"
                  />
                  <span className="font-semibold text-[#191817]">✦ Онцлох бүтээгдэхүүн (Featured)</span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#ded8cb]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 border border-[#ded8cb] text-[#635c4f] hover:text-[#191817] text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer"
                >
                  Болих
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#191817] text-white hover:bg-[#333] text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer"
                >
                  Хадгалах
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

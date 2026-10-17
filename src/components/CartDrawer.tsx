import React, { useState } from 'react';
import {
  X,
  Trash2,
  ShoppingBag,
  Send,
  CheckCircle2,
  Copy,
  Image as ImageIcon,
  ArrowRight
} from 'lucide-react';
import { CartItem, Language, OrderDetails } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  lang: Language;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  lang,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [step, setStep] = useState<'cart' | 'shipping' | 'success'>('cart');
  
  // Shipping form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [city, setCity] = useState('Улаанбаатар хот');
  const [district, setDistrict] = useState('Сүхбаатар дүүрэг');
  const [streetAddress, setStreetAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [completedOrder, setCompletedOrder] = useState<OrderDetails | null>(null);
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  if (!isOpen) return null;

  const totalItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleProceedToInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setFormError(
        lang === 'mn'
          ? 'Нэр болон утасны дугаараа оруулна уу.'
          : 'Please enter your name and contact phone.'
      );
      return;
    }
    setFormError('');
    const orderNum = 'AURO-' + Math.floor(1000 + Math.random() * 9000);
    const order: OrderDetails = {
      orderId: orderNum,
      items: [...items],
      customerName,
      customerPhone,
      city,
      district,
      streetAddress,
      notes,
      createdAt: new Date().toLocaleString(lang === 'mn' ? 'mn-MN' : 'en-US'),
      status: 'new',
    };
    try {
      const stored = localStorage.getItem('auro_orders');
      const existing: OrderDetails[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem('auro_orders', JSON.stringify([order, ...existing]));
      window.dispatchEvent(new Event('auro_orders_updated'));
    } catch (err) {
      console.warn('Failed to save order to localStorage', err);
    }
    setCompletedOrder(order);
    setStep('success');
  };

  const generateMessageText = () => {
    if (!completedOrder) return '';
    const lines = [
      `Сайн байна уу, AURO | FASHION STORE 🖤!`,
      `Би дараах бүтээгдэхүүний талаар мэдээлэл авах хүсэлтэй байна:`,
      ...completedOrder.items.map(
        (it) =>
          `• ${it.product.nameMn} (${it.quantity}ш)${it.selectedSize ? ` - Хэмжээ: ${it.selectedSize}` : ''}${it.selectedColor ? ` - Өнгө: ${it.selectedColor}` : ''}`
      ),
      customerName ? `Хүлээн авагч: ${customerName}` : '',
      customerPhone ? `Утас: ${customerPhone}` : '',
      streetAddress ? `Хаяг: ${city}, ${district}, ${streetAddress}` : '',
      notes ? `Тэмдэглэл: ${notes}` : '',
    ].filter(Boolean);

    return lines.join('\n');
  };

  const handleCopyInquiry = () => {
    const text = generateMessageText();
    navigator.clipboard.writeText(text);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#fcfbfa] shadow-2xl flex flex-col border-l border-[#eae5dc]">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#eae5dc] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#191817]" />
              <h2 className="text-sm font-semibold tracking-wider uppercase text-[#191817]">
                {step === 'cart'
                  ? lang === 'mn'
                    ? `Миний сагс (${totalItemCount})`
                    : `Shopping Bag (${totalItemCount})`
                  : step === 'shipping'
                  ? lang === 'mn'
                    ? 'Захиалгын мэдээлэл'
                    : 'Order Information'
                  : lang === 'mn'
                  ? 'Лавлагаа бэлэн боллоо'
                  : 'Inquiry Ready'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-[#787165] hover:text-[#191817] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            
            {/* STEP 1: CART ITEMS */}
            {step === 'cart' && (
              <>
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20 text-[#736c61]">
                    <ShoppingBag className="w-12 h-12 stroke-[1.2] text-[#aba294] mb-3" />
                    <p className="text-base font-semibold text-[#191817]">
                      {lang === 'mn' ? 'Таны сагс хоосон байна' : 'Your bag is empty'}
                    </p>
                    <p className="text-xs text-[#8c8476] mt-1 max-w-xs">
                      {lang === 'mn'
                        ? 'Цуглуулгаас бүтээгдэхүүн сонгон сагсандаа нэмнэ үү.'
                        : 'Select products from the catalog to add to your bag.'}
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-6 px-6 py-3 bg-[#191817] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#333] transition-colors cursor-pointer"
                    >
                      {lang === 'mn' ? 'Бараа үзэх' : 'Explore Products'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Items List */}
                    <div className="divide-y divide-[#eae5dc]">
                      {items.map((item) => (
                        <div
                          key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                          className="pt-4 first:pt-0 flex gap-4"
                        >
                          <div className="w-20 h-20 bg-[#ece7df] border border-[#ded6ca] rounded-xs flex flex-col items-center justify-center p-1 text-center shrink-0">
                            <ImageIcon className="w-5 h-5 text-[#807669] mb-1" />
                            <span className="text-[8px] font-mono text-[#6e6558] uppercase">PLACEHOLDER</span>
                          </div>

                          <div className="flex-1 flex flex-col justify-between text-left">
                            <div>
                              <div className="flex justify-between items-start gap-2">
                                <h4 className="text-xs font-semibold text-[#191817] line-clamp-1">
                                  {lang === 'mn' ? item.product.nameMn : item.product.nameEn}
                                </h4>
                                <button
                                  onClick={() => onRemoveItem(item.product.id)}
                                  className="text-[#9e9587] hover:text-red-700 transition-colors p-0.5 cursor-pointer"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="text-[11px] text-[#787165] mt-0.5">
                                {item.selectedSize && <span>{item.selectedSize}</span>}
                                {item.selectedSize && item.selectedColor && <span> · </span>}
                                {item.selectedColor && <span>{item.selectedColor}</span>}
                              </div>

                              <p className="text-[11px] text-[#544d43] mt-1 font-medium">
                                {lang === 'mn' ? 'Үнийн мэдээлэл авах' : 'Inquire for Price'}
                              </p>
                            </div>

                            {/* Stepper */}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[11px] text-[#8c8476]">{lang === 'mn' ? 'Тоо:' : 'Qty:'}</span>
                              <div className="flex items-center border border-[#ded8cd] bg-white text-xs">
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                                  className="w-6 h-6 flex items-center justify-center hover:bg-[#f2ece2] font-semibold"
                                >
                                  -
                                </button>
                                <span className="w-7 text-center font-mono tabular-nums font-bold text-[#191817]">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                                  className="w-6 h-6 flex items-center justify-center hover:bg-[#f2ece2] font-semibold"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* STEP 2: SHIPPING / INQUIRY DETAILS */}
            {step === 'shipping' && (
              <form onSubmit={handleProceedToInquiry} className="space-y-4 text-left">
                {formError && (
                  <p className="text-xs text-red-700 bg-red-50 p-2.5 border border-red-200">
                    {formError}
                  </p>
                )}

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#191817]">
                    {lang === 'mn' ? 'Таны нэр *' : 'Your Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={lang === 'mn' ? 'Нэрээ оруулна уу' : 'Full Name'}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#ded8cc] text-[#191817] focus:outline-hidden focus:border-[#191817]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#191817]">
                    {lang === 'mn' ? 'Утасны дугаар *' : 'Contact Phone *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="9911-XXXX / 8811-XXXX"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#ded8cc] text-[#191817] focus:outline-hidden focus:border-[#191817]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider font-semibold text-[#191817]">
                      {lang === 'mn' ? 'Хот' : 'City'}
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs bg-white border border-[#ded8cc] text-[#191817]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider font-semibold text-[#191817]">
                      {lang === 'mn' ? 'Дүүрэг' : 'District'}
                    </label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs bg-white border border-[#ded8cc] text-[#191817]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#191817]">
                    {lang === 'mn' ? 'Хүргэх хаяг' : 'Address'}
                  </label>
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder={lang === 'mn' ? 'Байр, тоот...' : 'Apartment, details...'}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#ded8cc] text-[#191817] focus:outline-hidden focus:border-[#191817]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#191817]">
                    {lang === 'mn' ? 'Тэмдэглэл' : 'Notes'}
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={lang === 'mn' ? 'Хүсэлт, хэмжээний тодруулга...' : 'Special notes...'}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#ded8cc] text-[#191817]"
                  />
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    className="w-1/3 py-3 border border-[#ded8cc] text-xs font-semibold uppercase tracking-wider hover:bg-[#f2ece2]"
                  >
                    {lang === 'mn' ? 'Буцах' : 'Back'}
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-3 bg-[#191817] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#333]"
                  >
                    {lang === 'mn' ? 'Лавлагаа бэлтгэх' : 'Prepare Inquiry'}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: SUCCESS CONFIRMATION */}
            {step === 'success' && completedOrder && (
              <div className="py-6 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#191817] mx-auto stroke-[1.5]" />
                <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#191817]">
                  {lang === 'mn' ? 'Захиалгын лавлагаа бэлэн боллоо' : 'Inquiry Ready to Send'}
                </h3>
                
                <p className="text-xs text-[#5e574c] max-w-sm mx-auto">
                  {lang === 'mn'
                    ? `Таны сонгосон ${completedOrder.items.length} бүтээгдэхүүний мэдээлэл бэлэн боллоо. Доорх товчоор хуулаад Instagram @auro.mongolia руу илгээнэ үү.`
                    : `Inquiry details prepared for ${completedOrder.items.length} items. Copy below or open Instagram @auro.mongolia.`}
                </p>

                {/* Formatted Text Box */}
                <div className="p-3 bg-white border border-[#ded8cc] text-left text-xs font-mono text-[#403c37] whitespace-pre-line rounded-xs max-h-48 overflow-y-auto">
                  {generateMessageText()}
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleCopyInquiry}
                    className="w-full py-2.5 border border-[#191817] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#f4efe8] transition-colors cursor-pointer"
                  >
                    {copiedReceipt ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{lang === 'mn' ? 'Хуулагдлаа!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{lang === 'mn' ? 'Зурвасыг хуулах' : 'Copy Inquiry Message'}</span>
                      </>
                    )}
                  </button>

                  <a
                    href="https://www.instagram.com/auro.mongolia/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-[#191817] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#333] transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Instagram @auro.mongolia нээх</span>
                  </a>

                  <button
                    onClick={() => {
                      onClearCart();
                      setStep('cart');
                      onClose();
                    }}
                    className="w-full py-2 text-xs text-[#787165] hover:text-[#191817] underline pt-2"
                  >
                    {lang === 'mn' ? 'Сагсыг цэвэрлээд дуусгах' : 'Clear Bag & Close'}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Drawer Footer for Step 1 */}
          {step === 'cart' && items.length > 0 && (
            <div className="p-6 border-t border-[#eae5dc] bg-[#f9f7f3] space-y-3">
              <div className="space-y-1 text-xs text-left">
                <div className="flex justify-between font-semibold text-[#191817]">
                  <span>{lang === 'mn' ? 'Нийт сонгосон бараа:' : 'Total Items:'}</span>
                  <span>{totalItemCount} {lang === 'mn' ? 'ширхэг' : 'items'}</span>
                </div>
                <div className="flex justify-between text-[#787165]">
                  <span>{lang === 'mn' ? 'Үнийн төлөв:' : 'Price Status:'}</span>
                  <span>{lang === 'mn' ? 'Лавлагаагаар тодорхойлогдоно' : 'Quote on Inquiry'}</span>
                </div>
              </div>

              <button
                onClick={() => setStep('shipping')}
                className="w-full py-3.5 bg-[#191817] text-[#fcfbfa] text-xs uppercase tracking-widest font-semibold hover:bg-[#33302c] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>{lang === 'mn' ? 'Захиалгын лавлагаа илгээх' : 'Proceed to Inquiry'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

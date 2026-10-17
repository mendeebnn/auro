import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  ShoppingBag,
  Send,
  Truck,
  RotateCcw,
  ShieldCheck,
  Ruler,
  X,
  Image as ImageIcon,
  Copy,
  CheckCircle2,
  Instagram
} from 'lucide-react';
import { Product, Language } from '../types';
import { ProductCard } from './ProductCard';

interface ProductDetailProps {
  product: Product;
  allProducts: Product[];
  lang: Language;
  onBack: () => void;
  onSelectProduct: (p: Product) => void;
  onAddToCart: (product: Product, quantity: number, size?: string, color?: string) => void;
  onBuyNow?: (product: Product, quantity: number, size?: string, color?: string) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  allProducts,
  lang,
  onBack,
  onSelectProduct,
  onAddToCart,
  onBuyNow,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes ? product.sizes[0] : '');
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors ? (lang === 'mn' ? product.colors[0].nameMn : product.colors[0].nameEn) : ''
  );
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [copiedInquiry, setCopiedInquiry] = useState(false);

  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedSize || undefined, selectedColor || undefined);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2400);
  };

  const handleBuy = () => {
    if (onBuyNow) {
      onBuyNow(product, quantity, selectedSize || undefined, selectedColor || undefined);
    } else {
      handleAdd();
    }
  };

  const inquiryMessage =
    lang === 'mn'
      ? `Сайн байна уу, AURO | FASHION STORE 🖤! Би "${product.nameMn}" (${selectedSize ? `Хэмжээ: ${selectedSize}, ` : ''}${selectedColor ? `Өнгө: ${selectedColor}` : ''})-ийн талаар мэдээлэл авах хүсэлтэй байна.`
      : `Hello AURO | FASHION STORE 🖤! I would like to inquire about "${product.nameEn}" (${selectedSize ? `Size: ${selectedSize}, ` : ''}${selectedColor ? `Color: ${selectedColor}` : ''}).`;

  const handleCopyInquiry = () => {
    navigator.clipboard.writeText(inquiryMessage);
    setCopiedInquiry(true);
    setTimeout(() => setCopiedInquiry(false), 2500);
  };

  return (
    <div className="bg-[#fcfbfa] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#736c61] hover:text-[#191817] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>{lang === 'mn' ? 'Буцах' : 'Back to List'}</span>
          </button>

          <div className="text-xs text-[#787165]">
            <span>{lang === 'mn' ? product.categoryMn : product.categoryEn}</span>
            <span className="mx-2">/</span>
            <span className="text-[#191817] font-medium">
              {lang === 'mn' ? product.nameMn : product.nameEn}
            </span>
          </div>
        </div>

        {/* Product Purchase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* Left Column: Image (Real or Placeholder) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative w-full aspect-[4/3] bg-[#ece7df] overflow-hidden rounded-xs border border-[#ded6ca] flex flex-col items-center justify-center text-center select-none">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={lang === 'mn' ? product.nameMn : product.nameEn}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="p-8 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#dfd6c8] flex items-center justify-center mb-3 text-[#5c5448]">
                    <ImageIcon className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <p className="font-mono text-base font-bold uppercase tracking-widest text-[#191817]">
                    PLACEHOLDER
                  </p>
                  <p className="text-xs text-[#736b5f] uppercase tracking-wider mt-1">
                    {product.imagePlaceholderText}
                  </p>
                  <div className="mt-4 text-[10px] font-mono uppercase tracking-widest text-[#8c8273] bg-[#f5f0e6] px-3 py-1 border border-[#e2d8c8]">
                    AURO | FASHION STORE 🖤
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Information Module */}
          <div className="lg:col-span-5 flex flex-col space-y-6 text-left">
            
            {/* Category */}
            <div className="flex items-center justify-between text-xs uppercase tracking-widest text-[#7a7367]">
              <span className="font-semibold text-[#191817]">{lang === 'mn' ? product.categoryMn : product.categoryEn}</span>
              <span className="text-[#595349] font-medium">
                AURO | FASHION STORE
              </span>
            </div>

            {/* Title (Placeholder Name) */}
            <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#191817] leading-tight">
              {lang === 'mn' ? product.nameMn : product.nameEn}
            </h1>

            {/* Inquiry Status Card (No unmentioned money) */}
            <div className="p-4 bg-[#f4f0e8] border border-[#e5dfd3] flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-[#736c61] font-semibold">
                  {lang === 'mn' ? 'Үнийн төлөв' : 'Pricing'}
                </p>
                <p className="text-sm font-bold text-[#191817] mt-0.5">
                  {lang === 'mn' ? 'Үнийн мэдээлэл авах' : 'Inquire for Details'}
                </p>
              </div>
              <span className="text-[11px] text-[#787165] text-right font-medium">
                Instagram @auro.mongolia
              </span>
            </div>

            {/* Description Placeholder */}
            <p className="text-sm text-[#4e483e] leading-relaxed">
              {lang === 'mn' ? product.descriptionMn : product.descriptionEn}
            </p>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="border-t border-[#eae5dc] pt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="uppercase tracking-wider font-semibold text-[#191817]">
                    {lang === 'mn' ? 'Өнгө:' : 'Color Variant:'}
                  </span>
                  <span className="text-[#6b6458] font-medium">{selectedColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  {product.colors.map((c, idx) => {
                    const colorName = lang === 'mn' ? c.nameMn : c.nameEn;
                    const isSelected = selectedColor === colorName;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(colorName)}
                        className={`flex items-center gap-1.5 py-1.5 px-3 text-xs border rounded-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#191817] bg-[#f2eee7] font-semibold text-[#191817]'
                            : 'border-[#ded8cd] bg-white text-[#635c51] hover:border-[#191817]'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/20"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{colorName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="border-t border-[#eae5dc] pt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="uppercase tracking-wider font-semibold text-[#191817]">
                    {lang === 'mn' ? 'Хэмжээ:' : 'Size:'}
                  </span>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="inline-flex items-center gap-1 text-[#787165] hover:text-[#191817] underline cursor-pointer"
                  >
                    <Ruler className="w-3 h-3" />
                    <span>{lang === 'mn' ? 'Хэмжээний заавар' : 'Size Guide'}</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`w-11 h-11 text-xs font-semibold uppercase tracking-wider border transition-colors cursor-pointer ${
                        selectedSize === sz
                          ? 'border-[#191817] bg-[#191817] text-white'
                          : 'border-[#dfd8cc] bg-white text-[#191817] hover:border-[#8f887b]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div className="border-t border-[#eae5dc] pt-4 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#191817]">
                {lang === 'mn' ? 'Тоо ширхэг:' : 'Quantity:'}
              </span>
              <div className="flex items-center border border-[#ded8cc] bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 flex items-center justify-center text-sm font-semibold text-[#5c554a] hover:bg-[#f5f2ec] cursor-pointer"
                >
                  -
                </button>
                <span className="w-12 text-center text-xs font-mono font-bold tabular-nums text-[#191817]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 flex items-center justify-center text-sm font-semibold text-[#5c554a] hover:bg-[#f5f2ec] cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-3">
              <button
                onClick={handleAdd}
                className="w-full py-4 bg-[#191817] text-[#fcfbfa] text-xs uppercase tracking-widest font-semibold hover:bg-[#33302c] transition-colors flex items-center justify-center gap-2.5 cursor-pointer shadow-xs"
              >
                {addedNotice ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'mn' ? 'Сагсанд нэмэгдлээ!' : 'Added to Bag!'}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{lang === 'mn' ? 'Сагсанд нэмэх' : 'Add to Bag'}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowInquiryModal(true)}
                className="w-full py-3.5 border border-[#191817] text-[#191817] text-xs uppercase tracking-widest font-semibold hover:bg-[#f4efe8] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {lang === 'mn'
                    ? 'Instagram DM-ээр лавлах'
                    : 'Direct Instagram Inquiry'}
                </span>
              </button>
            </div>

            {/* Service info */}
            <div className="pt-4 border-t border-[#eae5dc] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#6e675b]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#191817] shrink-0" />
                <span>{lang === 'mn' ? 'Хүргэлттэй' : 'Delivery Available'}</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#191817] shrink-0" />
                <span>{lang === 'mn' ? 'Хэмжээ солих боломж' : 'Size Exchange'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#191817] shrink-0" />
                <span>{lang === 'mn' ? 'AURO Fashion' : 'AURO Fashion'}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#eae5dc]">
            <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#191817] mb-8 text-left">
              {lang === 'mn' ? 'Бусад бараанууд' : 'Other Products'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((relProduct) => (
                <ProductCard
                  key={relProduct.id}
                  product={relProduct}
                  lang={lang}
                  onSelect={(p) => {
                    onSelectProduct(p);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onQuickAdd={() => onAddToCart(relProduct, 1)}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Instagram Inquiry Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-[#fcfbfa] border border-[#ded7ca] shadow-2xl p-6 sm:p-8 text-left space-y-5 rounded-xs">
            <button
              onClick={() => setShowInquiryModal(false)}
              className="absolute top-4 right-4 text-[#787165] hover:text-[#191817] p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#191817] text-white rounded-xs">
                <Instagram className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#736c61] font-medium">
                  {lang === 'mn' ? 'Шууд харилцах' : 'Direct Inquiry'}
                </p>
                <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#191817]">
                  Instagram @auro.mongolia
                </h3>
              </div>
            </div>

            <div className="flex gap-4 p-3 bg-[#f5f1ea] border border-[#e5dfd3] rounded-xs">
              <div className="w-14 h-14 bg-[#ece7df] border border-[#ded6ca] flex flex-col items-center justify-center text-center shrink-0">
                <ImageIcon className="w-5 h-5 text-[#807669]" />
                <span className="text-[7px] font-mono text-[#6e6558] uppercase">PLACEHOLDER</span>
              </div>
              <div className="overflow-hidden flex flex-col justify-center">
                <p className="text-xs uppercase tracking-wider text-[#787165]">
                  {lang === 'mn' ? product.categoryMn : product.categoryEn}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-[#191817] truncate">
                  {lang === 'mn' ? product.nameMn : product.nameEn}
                </p>
                <p className="text-xs text-[#524b41] font-medium mt-0.5">
                  {lang === 'mn' ? 'Үнийн мэдээлэл авах' : 'Inquire for Details'}
                </p>
              </div>
            </div>

            <p className="text-xs text-[#5c554a] leading-relaxed">
              {lang === 'mn'
                ? 'Бэлтгэсэн зурвасыг хуулаад Instagram Direct Message-ээр @auro.mongolia руу илгээнэ үү.'
                : 'Copy the prepared message below and send it to @auro.mongolia via Instagram DM.'}
            </p>

            <div className="p-3 bg-white border border-[#ded8cc] text-xs font-mono text-[#38342f] rounded-xs">
              {inquiryMessage}
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleCopyInquiry}
                className="w-full py-3 border border-[#191817] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#f4efe8] transition-colors cursor-pointer"
              >
                {copiedInquiry ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{lang === 'mn' ? 'Зурвас хуулагдлаа!' : 'Copied to Clipboard!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>{lang === 'mn' ? 'Зурвасыг хуулах' : 'Copy Message'}</span>
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
                <span>Instagram @auro.mongolia</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full p-6 text-left space-y-4 border border-[#ded7ca] shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-[#191817]">
                {lang === 'mn' ? 'Хэмжээний хүснэгт' : 'Size Guide'}
              </h3>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="text-[#787165] hover:text-[#191817] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b bg-[#f6f2ea]">
                  <th className="py-2 px-3">{lang === 'mn' ? 'Хэмжээ' : 'Size'}</th>
                  <th className="py-2 px-3">S</th>
                  <th className="py-2 px-3">M</th>
                  <th className="py-2 px-3">L</th>
                  <th className="py-2 px-3">XL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eee]">
                <tr>
                  <td className="py-2 px-3 font-semibold">{lang === 'mn' ? 'Төрөл' : 'Type'}</td>
                  <td className="py-2 px-3">Small</td>
                  <td className="py-2 px-3">Medium</td>
                  <td className="py-2 px-3">Large</td>
                  <td className="py-2 px-3">X-Large</td>
                </tr>
              </tbody>
            </table>

            <button
              onClick={() => setShowSizeGuide(false)}
              className="w-full py-2.5 bg-[#191817] text-white text-xs uppercase tracking-wider font-medium cursor-pointer"
            >
              {lang === 'mn' ? 'Хаах' : 'Close'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

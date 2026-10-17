import React from 'react';
import { ShoppingBag, Check, Image as ImageIcon, ArrowUpRight } from 'lucide-react';
import { Product, Language } from '../types';

interface ProductCardProps {
  product: Product;
  lang: Language;
  onSelect: (product: Product) => void;
  onQuickAdd?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  lang,
  onSelect,
  onQuickAdd,
}) => {
  const [justAdded, setJustAdded] = React.useState(false);

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickAdd) {
      onQuickAdd(product);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1800);
    }
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group flex flex-col text-left cursor-pointer transition-transform duration-200 hover:-translate-y-0.5"
    >
      {/* Product Image Frame (Supports image upload or placeholder) */}
      <div className="relative w-full aspect-[4/3] bg-[#ece7df] overflow-hidden rounded-xs border border-[#ded6ca] flex flex-col items-center justify-center text-center select-none group-hover:border-[#191817] transition-colors">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={lang === 'mn' ? product.nameMn : product.nameEn}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6">
            <div className="w-12 h-12 rounded-full bg-[#dfd6c8] flex items-center justify-center mb-2.5 text-[#5c5448]">
              <ImageIcon className="w-6 h-6 stroke-[1.5]" />
            </div>
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#191817]">
              PLACEHOLDER
            </p>
            <p className="text-[10px] text-[#736b5f] uppercase tracking-widest mt-1">
              {product.imagePlaceholderText}
            </p>
            <div className="mt-2 text-[9px] font-mono uppercase tracking-widest text-[#8c8273] bg-[#f5f0e6] px-2 py-0.5 border border-[#e2d8c8]">
              AURO | FASHION STORE
            </div>
          </div>
        )}

        {/* Hover Quick Add Action */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-between gap-2">
          <button
            onClick={handleQuickAddClick}
            className="w-full py-2 px-3 bg-[#191817] text-[#fcfbfa] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#333] transition-colors shadow-xs cursor-pointer"
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'mn' ? 'Сонгогдлоо' : 'Added'}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{lang === 'mn' ? 'Сагслах' : 'Add to Bag'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="pt-3 pb-1 flex flex-col gap-1">
        {/* Category & Status */}
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#7a7367]">
          <span className="font-semibold text-[#191817]">{lang === 'mn' ? product.categoryMn : product.categoryEn}</span>
          <span className="text-[10px] text-[#696358]">
            {lang === 'mn' ? 'Боломжтой' : 'Available'}
          </span>
        </div>

        {/* Product Title (Placeholder Name) */}
        <h3 className="text-sm sm:text-base font-semibold text-[#191817] group-hover:text-[#423d37] transition-colors line-clamp-1">
          {lang === 'mn' ? product.nameMn : product.nameEn}
        </h3>

        {/* Inquiry / Action label (NO unmentioned money or discounts) */}
        <div className="pt-0.5 flex items-center justify-between text-xs text-[#544d43] font-medium">
          <span>{lang === 'mn' ? 'Үнийн мэдээлэл авах' : 'Inquire for Details'}</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#8f887c] group-hover:text-[#191817] transition-colors" />
        </div>
      </div>
    </div>
  );
};

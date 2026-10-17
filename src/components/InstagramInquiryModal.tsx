import React, { useState } from 'react';
import { X, Send, Copy, CheckCircle2, Instagram, Image as ImageIcon } from 'lucide-react';
import { Product, Language } from '../types';

interface InstagramInquiryModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const InstagramInquiryModal: React.FC<InstagramInquiryModalProps> = ({
  product,
  isOpen,
  onClose,
  lang,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !product) return null;

  const messageText =
    lang === 'mn'
      ? `Сайн байна уу, AURO | FASHION STORE 🖤! Би "${product.nameMn}" бүтээгдэхүүний талаар мэдээлэл авах хүсэлтэй байна. Баярлалаа!`
      : `Hello AURO | FASHION STORE 🖤! I would like to inquire about "${product.nameEn}". Thank you!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-[#fcfbfa] border border-[#ded7ca] shadow-2xl p-6 sm:p-8 text-left space-y-5 rounded-xs">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#787165] hover:text-[#191817] p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
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

        {/* Product Snapshot */}
        <div className="flex gap-4 p-3 bg-[#f5f1ea] border border-[#e5dfd3] rounded-xs">
          <div className="w-16 h-16 bg-[#ece7df] border border-[#ded6ca] rounded-xs flex flex-col items-center justify-center text-center shrink-0">
            <ImageIcon className="w-6 h-6 text-[#807669] mb-1" />
            <span className="text-[8px] font-mono text-[#6e6558] uppercase">PLACEHOLDER</span>
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

        {/* Instructions */}
        <p className="text-xs text-[#5c554a] leading-relaxed">
          {lang === 'mn'
            ? 'Доорх бэлтгэсэн зурвасыг хуулаад, AURO Mongolia-ийн албан ёсны Instagram Direct Message рүү илгээн шуурхай хариу авна уу.'
            : 'Copy the prepared inquiry note below and send it directly via Instagram DM to @auro.mongolia for swift confirmation.'}
        </p>

        {/* Text area */}
        <div className="p-3 bg-white border border-[#ded8cc] text-xs font-mono text-[#38342f] rounded-xs">
          {messageText}
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={handleCopy}
            className="w-full py-3 border border-[#191817] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#f4efe8] transition-colors cursor-pointer"
          >
            {copied ? (
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
            <span>
              {lang === 'mn'
                ? 'Instagram @auro.mongolia-г нээх'
                : 'Open Instagram @auro.mongolia'}
            </span>
          </a>
        </div>

      </div>
    </div>
  );
};

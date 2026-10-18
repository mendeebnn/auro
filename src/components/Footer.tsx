import React from 'react';
import { Instagram, ArrowUpRight, ArrowUp } from 'lucide-react';
import { Language, PageView } from '../types';
import { AuroLogo } from './AuroLogo';

interface FooterProps {
  lang: Language;
  onNavigate: (view: PageView) => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#161514] text-[#e8e4dc] border-t border-[#2a2825] pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#2d2a26]">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3 text-left">
            <AuroLogo size="lg" inverted={true} />
            <div className="inline-block text-[11px] font-mono tracking-wider uppercase text-[#c7bdae] font-semibold bg-[#262421] px-2.5 py-1 rounded-xs">
              ✦ MEN • WOMEN
            </div>
            <p className="text-xs text-[#a39c91] leading-relaxed max-w-sm">
              ✦ Premium style, everyday luxury <br />
              ✦ Шинэ загвар • Шинэ мэдрэмж
            </p>
            <div className="pt-2">
              <a
                href="https://www.instagram.com/auro.mongolia/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-[#d1c8b9] hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram: @auro.mongolia</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* E-Commerce Shop Links */}
          <div className="md:col-span-3 space-y-3 text-left">
            <p className="text-xs uppercase tracking-widest font-semibold text-white/90">
              {lang === 'mn' ? 'Дэлгүүр' : 'Shop'}
            </p>
            <ul className="space-y-2 text-xs text-[#a39c91]">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {lang === 'mn' ? 'Нүүр' : 'Home'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('collection')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {lang === 'mn' ? 'Бүх бүтээгдэхүүн' : 'All Products'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('collection')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {lang === 'mn' ? 'Шинэ цуглуулга' : 'New In'}
                </button>
              </li>
              <li className="pt-1">
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-white text-[#8a8174] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>{lang === 'mn' ? 'Админ удирдлага' : 'Admin Portal'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* E-Commerce Delivery & Service */}
          <div className="md:col-span-4 space-y-3 text-left">
            <p className="text-xs uppercase tracking-widest font-semibold text-white/90">
              {lang === 'mn' ? 'Хүргэлт & Үйлчилгээ' : 'Shipping & Inquiries'}
            </p>
            <p className="text-xs text-[#a39c91] leading-relaxed">
              {lang === 'mn'
                ? 'Улаанбаатар хот болон орон нутагт найдвартай хүргэнэ. Дэлгэрэнгүй мэдээлэл, захиалгыг Instagram @auro.mongolia хуудсаар шууд авна уу.'
                : 'Reliable delivery in Ulaanbaatar and provincial areas. Direct customer care via Instagram @auro.mongolia.'}
            </p>
            <p className="text-[11px] text-[#80796e] pt-1">
              AURO | FASHION STORE 🖤 · @auro.mongolia
            </p>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7d766b]">
          <div>
            © {new Date().getFullYear()} AURO Mongolia. {lang === 'mn' ? 'Бүх эрх хуулиар хамгаалагдсан.' : 'All rights reserved.'}
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[11px]">
              {lang === 'mn'
                ? 'AURO Mongolia'
                : 'AURO Mongolia'}
            </span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <span>{lang === 'mn' ? 'Дээш очих' : 'Back to Top'}</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

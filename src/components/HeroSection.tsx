import React from 'react';
import { ArrowRight, ShoppingBag, Image as ImageIcon } from 'lucide-react';
import { Language, PageView, CategoryKey } from '../types';

interface HeroSectionProps {
  lang: Language;
  onExplore: (view: PageView) => void;
  onSelectCategory?: (cat: CategoryKey) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  onExplore,
  onSelectCategory,
}) => {
  const handleCategoryShortcut = (cat: CategoryKey) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
    onExplore('collection');
  };

  return (
    <section className="relative bg-[#fcfbfa] overflow-hidden border-b border-[#eae5dc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        
        {/* Split Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Column: Exact Bio & Store Introduction */}
          <div className="lg:col-span-5 flex flex-col justify-between py-2 sm:py-4">
            <div className="space-y-6 text-left">
              
              {/* Brand Bio Flag */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#191817] font-bold">
                  <span>AURO | FASHION STORE 🖤</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#191817] text-white text-[11px] font-mono tracking-wider uppercase font-semibold">
                  <span>✦ MEN • WOMEN</span>
                </div>
              </div>

              {/* Display Headline */}
              <div>
                <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#191817] leading-[1.08] text-balance">
                  Шинэ загвар <br />
                  <span className="italic font-normal">Шинэ мэдрэмж</span>
                </h1>
                <p className="text-sm sm:text-base font-semibold tracking-wide text-[#595246] mt-2">
                  ✦ Premium style, everyday luxury
                </p>
              </div>

              {/* Description */}
              <p className="text-sm text-[#5e584d] leading-relaxed max-w-lg">
                {lang === 'mn'
                  ? 'AURO | FASHION STORE — Өдөр тутмын тав тух, тансаг чанарыг шингээсэн эрэгтэй, эмэгтэй шинэ загварууд.'
                  : 'AURO | FASHION STORE — Premium style and everyday luxury apparel for men and women.'}
              </p>

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  onClick={() => onExplore('collection')}
                  className="px-8 py-4 bg-[#191817] text-[#fcfbfa] text-xs uppercase tracking-widest font-semibold hover:bg-[#33302c] transition-colors flex items-center justify-center gap-2.5 cursor-pointer shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{lang === 'mn' ? 'Бүх барааг үзэх' : 'Explore Products'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Category Shortcuts */}
              <div className="pt-2 flex items-center flex-wrap gap-2 text-xs">
                <span className="text-[#8c8476] font-medium mr-1">
                  {lang === 'mn' ? 'Ангилал:' : 'Categories:'}
                </span>
                <button
                  onClick={() => handleCategoryShortcut('men')}
                  className="px-3 py-1 bg-[#f5f1eb] hover:bg-[#ded7cc] text-[#191817] text-xs font-semibold rounded-xs border border-[#e5dfd3] transition-colors cursor-pointer"
                >
                  ✦ MEN
                </button>
                <button
                  onClick={() => handleCategoryShortcut('women')}
                  className="px-3 py-1 bg-[#f5f1eb] hover:bg-[#ded7cc] text-[#191817] text-xs font-semibold rounded-xs border border-[#e5dfd3] transition-colors cursor-pointer"
                >
                  ✦ WOMEN
                </button>
                <button
                  onClick={() => handleCategoryShortcut('new')}
                  className="px-3 py-1 bg-[#f5f1eb] hover:bg-[#ded7cc] text-[#191817] text-xs font-semibold rounded-xs border border-[#e5dfd3] transition-colors cursor-pointer"
                >
                  Шинэ загвар
                </button>
              </div>
            </div>

            {/* Quiet Footer Note */}
            <div className="pt-6 mt-6 border-t border-[#eae5dc] text-xs text-[#61594e]">
              <span>AURO | FASHION STORE 🖤 · Instagram @auro.mongolia</span>
            </div>
          </div>

          {/* Right Column: Hero Visual Placeholder Frame */}
          <div className="lg:col-span-7 relative min-h-[380px] sm:min-h-[440px] flex items-center justify-center bg-[#ece7df] border border-[#ded6ca] rounded-xs p-8 text-center select-none">
            <div className="space-y-3 max-w-md">
              <div className="w-16 h-16 rounded-full bg-[#dfd6c8] flex items-center justify-center mx-auto text-[#5c5448]">
                <ImageIcon className="w-8 h-8 stroke-[1.5]" />
              </div>
              <p className="font-mono text-sm font-bold uppercase tracking-widest text-[#191817]">
                [ CAMPAIGN IMAGE PLACEHOLDER ]
              </p>
              <p className="font-serif-luxury text-2xl text-[#191817]">
                AURO | FASHION STORE 🖤
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#696155]">
                ✦ MEN • WOMEN ✦ Premium style, everyday luxury
              </p>
              <p className="text-xs text-[#787165] italic">
                ✦ Шинэ загвар • Шинэ мэдрэмж
              </p>
              <div className="pt-2">
                <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-[#8c8273] bg-[#f5f0e6] px-3 py-1 border border-[#e2d8c8]">
                  @auro.mongolia
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* 4-Column Clean Trust Strip (No unmentioned money) */}
        <div className="mt-12 pt-8 border-t border-[#eae5dc] grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div className="space-y-0.5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#191817]">
              AURO FASHION
            </p>
            <p className="text-xs text-[#736c61]">
              ✦ MEN • WOMEN
            </p>
          </div>

          <div className="space-y-0.5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#191817]">
              Premium Style
            </p>
            <p className="text-xs text-[#736c61]">
              Everyday luxury
            </p>
          </div>

          <div className="space-y-0.5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#191817]">
              Шинэ загвар
            </p>
            <p className="text-xs text-[#736c61]">
              Шинэ мэдрэмж
            </p>
          </div>

          <div className="space-y-0.5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#191817]">
              Instagram
            </p>
            <p className="text-xs text-[#736c61]">
              @auro.mongolia
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

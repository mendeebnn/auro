import React, { useState } from 'react';
import { ShoppingBag, Menu, X, ArrowUpRight, Globe, Search, ShieldCheck } from 'lucide-react';
import { Language, PageView, CategoryKey } from '../types';

interface HeaderProps {
  currentView: PageView;
  setCurrentView: (view: PageView) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  cartCount: number;
  onOpenCart: () => void;
  onSelectCategory?: (cat: CategoryKey) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  lang,
  setLang,
  cartCount,
  onOpenCart,
  onSelectCategory,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const shopNavItems: { labelMn: string; labelEn: string; category?: CategoryKey }[] = [
    { labelMn: '✦ MEN', labelEn: '✦ MEN', category: 'men' },
    { labelMn: '✦ WOMEN', labelEn: '✦ WOMEN', category: 'women' },
    { labelMn: 'Бүх бараа', labelEn: 'Shop All', category: 'all' },
    { labelMn: 'Шинэ загвар', labelEn: 'New In', category: 'new' },
  ];

  const handleCategoryClick = (category?: CategoryKey) => {
    if (onSelectCategory && category) {
      onSelectCategory(category);
    }
    setCurrentView('collection');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHomeClick = () => {
    setCurrentView('home');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Black Continuous Rotating Marquee Banner with AURO (Guaranteed smooth motion) */}
      <div className="bg-[#141312] text-[#f2eee7] text-[11px] py-2 overflow-hidden border-b border-[#2d2a26] select-none relative">
        <style>{`
          @keyframes auroMarquee {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-100%, 0, 0); }
          }
          @-webkit-keyframes auroMarquee {
            0% { -webkit-transform: translate3d(0, 0, 0); }
            100% { -webkit-transform: translate3d(-100%, 0, 0); }
          }
          .animate-auro-marquee {
            display: flex !important;
            flex-shrink: 0 !important;
            will-change: transform !important;
            animation: auroMarquee 22s linear infinite !important;
            -webkit-animation: auroMarquee 22s linear infinite !important;
          }
        `}</style>

        <div className="flex w-full overflow-hidden">
          {/* Track 1 */}
          <div className="animate-auro-marquee items-center gap-8 whitespace-nowrap tracking-[0.25em] uppercase font-medium pr-8">
            <span className="font-serif-luxury font-bold text-sm tracking-[0.3em] text-white">AURO</span>
            <span className="text-[#a89f91]">✦</span>
            <span>FASHION STORE 🖤</span>
            <span className="text-[#a89f91]">✦</span>
            <span className="font-serif-luxury font-bold text-sm tracking-[0.3em] text-white">AURO</span>
            <span className="text-[#a89f91]">✦</span>
            <span className="font-mono text-[10px] bg-[#292622] px-2 py-0.5 text-[#e8dfcf] rounded-2xs">MEN • WOMEN</span>
            <span className="text-[#a89f91]">✦</span>
            <span className="font-serif-luxury font-bold text-sm tracking-[0.3em] text-white">AURO</span>
            <span className="text-[#a89f91]">✦</span>
            <span>PREMIUM STYLE, EVERYDAY LUXURY</span>
            <span className="text-[#a89f91]">✦</span>
            <span className="font-serif-luxury font-bold text-sm tracking-[0.3em] text-white">AURO</span>
            <span className="text-[#a89f91]">✦</span>
            <span>ШИНЭ ЗАГВАР • ШИНЭ МЭДРЭМЖ</span>
            <span className="text-[#a89f91]">✦</span>
          </div>

          {/* Track 2 (Identical for seamless infinite scroll) */}
          <div className="animate-auro-marquee items-center gap-8 whitespace-nowrap tracking-[0.25em] uppercase font-medium pr-8" aria-hidden="true">
            <span className="font-serif-luxury font-bold text-sm tracking-[0.3em] text-white">AURO</span>
            <span className="text-[#a89f91]">✦</span>
            <span>FASHION STORE 🖤</span>
            <span className="text-[#a89f91]">✦</span>
            <span className="font-serif-luxury font-bold text-sm tracking-[0.3em] text-white">AURO</span>
            <span className="text-[#a89f91]">✦</span>
            <span className="font-mono text-[10px] bg-[#292622] px-2 py-0.5 text-[#e8dfcf] rounded-2xs">MEN • WOMEN</span>
            <span className="text-[#a89f91]">✦</span>
            <span className="font-serif-luxury font-bold text-sm tracking-[0.3em] text-white">AURO</span>
            <span className="text-[#a89f91]">✦</span>
            <span>PREMIUM STYLE, EVERYDAY LUXURY</span>
            <span className="text-[#a89f91]">✦</span>
            <span className="font-serif-luxury font-bold text-sm tracking-[0.3em] text-white">AURO</span>
            <span className="text-[#a89f91]">✦</span>
            <span>ШИНЭ ЗАГВАР • ШИНЭ МЭДРЭМЖ</span>
            <span className="text-[#a89f91]">✦</span>
          </div>
        </div>
      </div>

      {/* Main E-Commerce Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#fcfbfa]/95 backdrop-blur-md border-b border-[#eae6de] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
          
          {/* Zone 1: Single Brand Wordmark */}
          <button
            onClick={handleHomeClick}
            className="group text-left text-[#191817] hover:opacity-85 transition-opacity whitespace-nowrap shrink-0 flex items-baseline gap-2 cursor-pointer"
          >
            <span className="font-serif-luxury text-2xl sm:text-3xl tracking-[0.2em] uppercase font-medium">
              A U R O
            </span>
            <span className="text-[10px] tracking-[0.18em] uppercase text-[#736c62] hidden xs:inline font-sans-clean font-semibold">
              FASHION STORE 🖤
            </span>
          </button>

          {/* Zone 2: MEN / WOMEN / ALL LINKS */}
          <nav className="hidden md:flex items-center gap-7 text-[13px] tracking-wider uppercase font-semibold text-[#5c564c]">
            {shopNavItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleCategoryClick(item.category)}
                className="py-1 whitespace-nowrap shrink-0 hover:text-[#191817] transition-colors cursor-pointer"
              >
                {lang === 'mn' ? item.labelMn : item.labelEn}
              </button>
            ))}
          </nav>

          {/* Zone 3: Search, Lang & Cart Button */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            {/* Search Shortcut */}
            <button
              onClick={() => {
                setCurrentView('collection');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-2 text-[#4a453d] hover:text-[#191817] transition-colors cursor-pointer"
              title={lang === 'mn' ? 'Бараа хайх' : 'Search Store'}
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'mn' ? 'en' : 'mn')}
              className="flex items-center gap-1 text-xs font-semibold text-[#6b6458] hover:text-[#191817] transition-colors py-1 px-2 rounded-xs border border-[#e5e0d6] hover:border-[#191817] cursor-pointer"
              title={lang === 'mn' ? 'Switch to English' : 'Монгол хэл рүү шилжих'}
            >
              <Globe className="w-3.5 h-3.5 text-[#8c8476]" />
              <span className="uppercase text-[11px] tracking-wider">
                {lang === 'mn' ? 'MN' : 'EN'}
              </span>
            </button>

            {/* Admin Portal Shortcut */}
            <button
              onClick={() => {
                setCurrentView('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-2 text-[#6e675b] hover:text-[#191817] transition-colors cursor-pointer"
              title={lang === 'mn' ? 'Админ удирдлага' : 'Admin Portal'}
            >
              <ShieldCheck className="w-4.5 h-4.5" />
            </button>

            {/* Shopping Bag Button (No unmentioned money) */}
            <button
              onClick={onOpenCart}
              className="relative py-2 px-3.5 bg-[#191817] text-[#fcfbfa] hover:bg-[#333] transition-colors cursor-pointer flex items-center gap-2 rounded-xs shadow-xs"
              aria-label={lang === 'mn' ? 'Сагс үзэх' : 'View Shopping Bag'}
            >
              <ShoppingBag className="w-4 h-4 stroke-[1.8]" />
              <span className="text-xs uppercase tracking-wider font-semibold">
                {lang === 'mn' ? 'Сагс' : 'Bag'}
              </span>
              {cartCount > 0 && (
                <span className="w-4.5 h-4.5 bg-[#fcfbfa] text-[#191817] text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#191817] hover:text-[#524b42] transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#eae6de] bg-[#fcfbfa] px-6 py-6 space-y-4">
            <div className="flex flex-col space-y-3">
              {shopNavItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCategoryClick(item.category)}
                  className="text-left text-base tracking-wide py-2 text-[#191817] font-semibold border-b border-[#eee] cursor-pointer"
                >
                  {lang === 'mn' ? item.labelMn : item.labelEn}
                </button>
              ))}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCurrentView('admin');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-left text-base tracking-wide py-2 text-[#191817] font-semibold flex items-center justify-between border-b border-[#eee] cursor-pointer"
              >
                <span>{lang === 'mn' ? 'Админ удирдлага' : 'Admin Portal'}</span>
                <ShieldCheck className="w-4 h-4 text-[#787164]" />
              </button>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-[#736c61]">
              <span>Official Instagram</span>
              <a
                href="https://www.instagram.com/auro.mongolia/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#191817] flex items-center gap-1 hover:underline"
              >
                @auro.mongolia
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

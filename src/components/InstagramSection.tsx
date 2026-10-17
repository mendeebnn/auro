import React from 'react';
import { Instagram, ArrowUpRight, Heart, MessageCircle } from 'lucide-react';
import { Language } from '../types';

interface InstagramSectionProps {
  lang: Language;
}

export const InstagramSection: React.FC<InstagramSectionProps> = ({ lang }) => {
  const posts = [
    {
      image: '/src/assets/images/hero_auro_editorial_1792199842470.jpg',
      caption: 'AURO | FASHION STORE 🖤\n✦ MEN • WOMEN\n✦ Premium style, everyday luxury',
      tag: '@auro.mongolia',
    },
    {
      image: '/src/assets/images/lookbook_mongolian_editorial_1792199845105.jpg',
      caption: '✦ Шинэ загвар • Шинэ мэдрэмж\nAURO Fashion Store',
      tag: '#auro #mongolia',
    },
    {
      image: '/src/assets/images/product_tailored_overcoat_1792199843656.jpg',
      caption: '✦ MEN • WOMEN\nEveryday luxury style',
      tag: '@auro.mongolia',
    },
    {
      image: '/src/assets/images/product_cashmere_knit_1792199843496.jpg',
      caption: 'AURO | FASHION STORE 🖤\nШинэ загвар',
      tag: '#fashion',
    },
    {
      image: '/src/assets/images/product_leather_tote_1792199844392.jpg',
      caption: '✦ Premium style, everyday luxury\nAURO',
      tag: '@auro.mongolia',
    },
    {
      image: '/src/assets/images/product_wool_trousers_1792199860645.jpg',
      caption: '✦ Шинэ загвар • Шинэ мэдрэмж\n@auro.mongolia',
      tag: '#auromongolia',
    },
  ];

  return (
    <section className="bg-[#fcfbfa] py-16 sm:py-24 border-b border-[#eae5dc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Lockup */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div className="text-left">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#7a7367] font-semibold mb-2">
              <Instagram className="w-3.5 h-3.5 text-[#191817]" />
              <span>{lang === 'mn' ? 'Инстаграм хуудас' : 'Official Instagram'}</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#191817]">
              AURO | @auro.mongolia
            </h2>
            <p className="text-xs sm:text-sm text-[#5c554a] mt-1 max-w-md">
              ✦ MEN • WOMEN ✦ Premium style, everyday luxury ✦ Шинэ загвар • Шинэ мэдрэмж
            </p>
          </div>

          <a
            href="https://www.instagram.com/auro.mongolia/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-[#191817] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#333] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-xs"
          >
            <Instagram className="w-4 h-4" />
            <span>{lang === 'mn' ? 'Instagram-д дагах' : 'Follow on Instagram'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#ded7ca]" />
          </a>
        </div>

        {/* Gallery Grid (6 Posts) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {posts.map((post, idx) => (
            <a
              key={idx}
              href="https://www.instagram.com/auro.mongolia/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square bg-[#f2ede4] overflow-hidden rounded-xs border border-[#e8e2d8] block"
            >
              <img
                src={post.image}
                alt={`AURO Mongolia Instagram ${idx + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                loading="lazy"
              />

              {/* Hover Overlay with Caption & Instagram Icon */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-3 flex flex-col justify-between text-white text-left">
                <div className="flex justify-between items-center text-[10px] text-white/80 font-mono">
                  <span>{post.tag}</span>
                  <Instagram className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <p className="text-[11px] line-clamp-3 leading-snug text-white/90 whitespace-pre-line font-medium">
                    {post.caption}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-white/80">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-white/80" />
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};

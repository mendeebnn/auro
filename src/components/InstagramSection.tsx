import React from 'react';
import { Instagram, ArrowUpRight, Heart, MessageCircle } from 'lucide-react';
import { Language } from '../types';

interface InstagramSectionProps {
  lang: Language;
}

export const InstagramSection: React.FC<InstagramSectionProps> = ({ lang }) => {
  const posts = [
    {
      title: 'AURO | FASHION STORE 🖤',
      subtitle: '✦ MEN • WOMEN',
      tag: '@auro.mongolia',
      desc: 'Premium style, everyday luxury',
      likes: '1.2k',
      comments: '48',
      theme: 'bg-[#191817] text-[#fcfbfa]',
      badge: '✦ OFFICIAL',
    },
    {
      title: 'Шинэ загвар • Шинэ мэдрэмж',
      subtitle: '✦ NEW IN',
      tag: '#auro #fashion',
      desc: 'Өдөр тутмын тав тухтай дээд зэрэглэлийн чанар',
      likes: '954',
      comments: '32',
      theme: 'bg-[#262320] text-[#fcfbfa]',
      badge: '✦ STYLE',
    },
    {
      title: '✦ MEN COLLECTION',
      subtitle: 'Эрэгтэй шинэ загвар',
      tag: '@auro.mongolia',
      desc: 'Цэвэрхэн, чанартай, эдэлгээ сайтай сонголтууд',
      likes: '820',
      comments: '29',
      theme: 'bg-[#1e1c1a] text-[#fcfbfa]',
      badge: '✦ MEN',
    },
    {
      title: '✦ WOMEN COLLECTION',
      subtitle: 'Эмэгтэй шинэ загвар',
      tag: '#auromongolia',
      desc: 'Тансаг хийц, төгс зохицол, өвөрмөц өнгө аяс',
      likes: '1.4k',
      comments: '61',
      theme: 'bg-[#2d2924] text-[#fcfbfa]',
      badge: '✦ WOMEN',
    },
    {
      title: 'AURO STORE 🖤',
      subtitle: 'Захиалга & Мэдээлэл',
      tag: '@auro.mongolia',
      desc: 'Шууд холбогдож бүтээгдэхүүний дэлгэрэнгүйг авна уу',
      likes: '740',
      comments: '18',
      theme: 'bg-[#171615] text-[#fcfbfa]',
      badge: '✦ INQUIRY',
    },
    {
      title: '@auro.mongolia',
      subtitle: 'Official Instagram',
      tag: '#fashionmongolia',
      desc: 'Шинэ загваруудыг өдөр бүр Instagram хуудаснаас сонирхоорой',
      likes: '1.1k',
      comments: '53',
      theme: 'bg-[#22201d] text-[#fcfbfa]',
      badge: '✦ FOLLOW',
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

        {/* Gallery Grid without AI images: Authentic Editorial Instagram Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {posts.map((post, idx) => (
            <a
              key={idx}
              href="https://www.instagram.com/auro.mongolia/"
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative aspect-square p-4 sm:p-5 flex flex-col justify-between rounded-xs border border-[#3b3630] ${post.theme} transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer block select-none`}
            >
              {/* Card Top: Handle & Badge */}
              <div className="flex items-center justify-between gap-1 text-[10px] font-mono opacity-85">
                <span className="truncate">{post.tag}</span>
                <Instagram className="w-3.5 h-3.5 shrink-0" />
              </div>

              {/* Card Middle: Brand Content */}
              <div className="py-2 text-left">
                <span className="inline-block text-[9px] font-mono tracking-widest uppercase px-1.5 py-0.5 bg-white/10 rounded-2xs mb-1.5">
                  {post.badge}
                </span>
                <p className="text-xs sm:text-sm font-bold tracking-tight leading-snug line-clamp-2">
                  {post.title}
                </p>
                <p className="text-[10px] text-white/70 line-clamp-2 mt-1">
                  {post.desc}
                </p>
              </div>

              {/* Card Bottom: Stats */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/70">
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-rose-500/80 stroke-rose-500/80" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  <span>{post.comments}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};

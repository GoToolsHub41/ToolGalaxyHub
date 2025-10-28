'use client';

import Link from 'next/link';
import {
  FileText,
  Image,
  Type,
  Code2,
  Search as SearchIcon,
  Video,
  Headphones,
  Shield
} from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { toolsByCategory, ToolCategory } from '@/lib/tools-data';

const categoryIcons = {
  [ToolCategory.FILE]: FileText,
  [ToolCategory.IMAGE]: Image,
  [ToolCategory.TEXT]: Type,
  [ToolCategory.CODE]: Code2,
  [ToolCategory.SEO]: SearchIcon,
  [ToolCategory.VIDEO]: Video,
  [ToolCategory.AUDIO]: Headphones,
  [ToolCategory.SECURITY]: Shield,
};

const categoryColors = {
  [ToolCategory.FILE]: 'from-blue-500 to-cyan-500',
  [ToolCategory.IMAGE]: 'from-purple-500 to-pink-500',
  [ToolCategory.TEXT]: 'from-green-500 to-emerald-500',
  [ToolCategory.CODE]: 'from-orange-500 to-red-500',
  [ToolCategory.SEO]: 'from-yellow-500 to-amber-500',
  [ToolCategory.VIDEO]: 'from-indigo-500 to-purple-500',
  [ToolCategory.AUDIO]: 'from-pink-500 to-rose-500',
  [ToolCategory.SECURITY]: 'from-cyan-500 to-blue-500',
};

const categoryNames = {
  [ToolCategory.FILE]: 'File Tools',
  [ToolCategory.IMAGE]: 'Image Tools',
  [ToolCategory.TEXT]: 'Text Tools',
  [ToolCategory.CODE]: 'Code Tools',
  [ToolCategory.SEO]: 'SEO Tools',
  [ToolCategory.VIDEO]: 'Video Tools',
  [ToolCategory.AUDIO]: 'Audio Tools',
  [ToolCategory.SECURITY]: 'Security Tools',
};

const categoryDescriptions = {
  [ToolCategory.FILE]: 'PDF converters, mergers, compressors and more',
  [ToolCategory.IMAGE]: 'Resize, compress, convert and edit images',
  [ToolCategory.TEXT]: 'Word counters, converters and text utilities',
  [ToolCategory.CODE]: 'Formatters, minifiers and code generators',
  [ToolCategory.SEO]: 'Meta tags, sitemaps and SEO analyzers',
  [ToolCategory.VIDEO]: 'Video converters, compressors and editors',
  [ToolCategory.AUDIO]: 'Audio converters, trimmers and editors',
  [ToolCategory.SECURITY]: 'Password generators, hash tools and encryption',
};

export function CategoryGrid() {
  const categories = Object.values(ToolCategory);

  const handleCategoryClick = (category: ToolCategory) => {
    trackEvent('category_clicked', {
      category_name: categoryNames[category],
      from_page: 'homepage',
    });
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Explore Tool Categories
          </h2>
          <p className="text-slate-400 text-lg">
            Browse our collection organized by tool type
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = categoryIcons[category];
            const toolCount = toolsByCategory[category]?.length || 0;

            return (
              <Link
                key={category}
                href={`#${category}-tools`}
                onClick={() => handleCategoryClick(category)}
                className="category-card group hover:scale-105 transition-transform duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Icon with gradient background */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${categoryColors[category]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Category name */}
                  <h3 className="text-xl font-bold text-cyan-star mb-2">
                    {categoryNames[category]}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-400 mb-3">
                    {categoryDescriptions[category]}
                  </p>

                  {/* Tool count */}
                  <div className="text-xs text-violet-nebula font-semibold">
                    {toolCount} tools available
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

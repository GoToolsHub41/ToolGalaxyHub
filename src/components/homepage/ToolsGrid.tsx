'use client';

import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import type { Tool } from '@/types/tool';

interface ToolsGridProps {
  tools: Tool[];
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  categoryId?: string;
}

export function ToolsGrid({
  tools,
  title,
  subtitle,
  showViewAll = false,
  categoryId
}: ToolsGridProps) {
  const handleToolClick = (tool: Tool) => {
    trackEvent('tool_opened', {
      tool_name: tool.name,
      tool_category: tool.category,
      tool_slug: tool.slug,
      from_page: 'homepage',
    });
  };

  if (tools.length === 0) {
    return null;
  }

  return (
    <section id={categoryId} className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-slate-400">{subtitle}</p>
            )}
          </div>
          {showViewAll && (
            <Link
              href="#all-tools"
              className="flex items-center gap-2 text-cyan-star hover:text-cyan-400 transition-colors font-semibold"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.slug}`}
              onClick={() => handleToolClick(tool)}
              className="bg-slate-900 border border-slate-700 rounded-xl p-5 hover:border-cyan-star transition-all duration-300 hover:shadow-lg hover:shadow-cyan-star/20 group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-white font-semibold text-base group-hover:text-cyan-star transition-colors flex-1">
                  {tool.name}
                </h3>
                {tool.featured && (
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0 ml-2" />
                )}
              </div>

              <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                {tool.shortDescription}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-violet-nebula font-medium uppercase">
                  {tool.category}
                </span>
                <ArrowRight className="w-4 h-4 text-cyan-star opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

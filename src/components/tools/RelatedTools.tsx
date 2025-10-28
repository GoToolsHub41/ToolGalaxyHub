'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getRelatedTools } from '@/lib/tools-data';
import { trackEvent } from '@/lib/analytics';
import type { Tool } from '@/types/tool';

interface RelatedToolsProps {
  currentTool: Tool;
}

export function RelatedTools({ currentTool }: RelatedToolsProps) {
  const relatedTools = getRelatedTools(currentTool.slug);

  const handleRelatedToolClick = (relatedTool: Tool) => {
    trackEvent('related_tool_clicked', {
      from_tool: currentTool.name,
      to_tool: relatedTool.name,
    });
  };

  if (relatedTools.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">Related Tools</h3>
      <div className="space-y-3">
        {relatedTools.map((tool) => (
          <Link
            key={tool.id}
            href={`/tools/${tool.slug}`}
            onClick={() => handleRelatedToolClick(tool)}
            className="block p-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-cyan-star rounded-lg transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-2">
                <h4 className="text-sm font-semibold text-white group-hover:text-cyan-star transition-colors mb-1">
                  {tool.name}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {tool.shortDescription}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-cyan-star opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

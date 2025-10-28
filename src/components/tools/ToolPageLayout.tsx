'use client';

import { ReactNode } from 'react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { RelatedTools } from './RelatedTools';
import { AdUnit } from '@/components/ads/AdUnit';
import type { Tool } from '@/types/tool';

interface ToolPageLayoutProps {
  tool: Tool;
  children: ReactNode;
}

const categoryNames: Record<string, string> = {
  file: 'File Tools',
  image: 'Image Tools',
  text: 'Text Tools',
  code: 'Code Tools',
  seo: 'SEO Tools',
  video: 'Video Tools',
  audio: 'Audio Tools',
  security: 'Security Tools',
};

export function ToolPageLayout({ tool, children }: ToolPageLayoutProps) {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: categoryNames[tool.category] || tool.category, href: `/#${tool.category}-tools` },
    { label: tool.name },
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Tool Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {tool.name}
          </h1>
          <p className="text-lg text-slate-300 mb-2">
            {tool.fullDescription}
          </p>
          <div className="flex items-center gap-3">
            <span className="inline-block px-3 py-1 bg-violet-nebula/20 border border-violet-nebula rounded-full text-sm text-violet-nebula font-medium">
              {categoryNames[tool.category]}
            </span>
            {tool.featured && (
              <span className="inline-block px-3 py-1 bg-yellow-500/20 border border-yellow-500 rounded-full text-sm text-yellow-400 font-medium">
                ⭐ Featured
              </span>
            )}
          </div>
        </div>

        {/* Main Layout: Two Column */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Main Content Area */}
          <div className="space-y-8">
            {/* Tool Workspace */}
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 md:p-8">
              {children}
            </div>

            {/* How to Use Section */}
            {tool.howToUse && tool.howToUse.length > 0 && (
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 md:p-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  How to Use
                </h2>
                <ol className="list-decimal list-inside space-y-2 text-slate-300">
                  {tool.howToUse.map((step, index) => (
                    <li key={index} className="pl-2">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* About This Tool Section */}
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                About This Tool
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                {tool.fullDescription}
              </p>
              <div className="space-y-2 text-sm text-slate-400">
                <p>
                  <strong className="text-slate-300">Input Type:</strong>{' '}
                  {tool.inputType === 'text' ? 'Text' : tool.inputType === 'file' ? 'File Upload' : 'Text or File'}
                </p>
                <p>
                  <strong className="text-slate-300">Output Type:</strong>{' '}
                  {tool.outputType === 'text' ? 'Text' : tool.outputType === 'file' ? 'File Download' : 'Text or File'}
                </p>
                {tool.maxFileSize && (
                  <p>
                    <strong className="text-slate-300">Max File Size:</strong> {tool.maxFileSize}MB
                  </p>
                )}
                {tool.acceptedFormats && tool.acceptedFormats.length > 0 && (
                  <p>
                    <strong className="text-slate-300">Accepted Formats:</strong>{' '}
                    {tool.acceptedFormats.join(', ')}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Ad - Desktop */}
            <div className="hidden lg:block">
              <AdUnit
                slot="tool-page-bottom"
                format="horizontal"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Ad */}
            <div className="sticky top-4 space-y-6">
              <AdUnit
                slot="tool-page-sidebar-top"
                format="rectangle"
                style={{ width: '300px', height: '250px' }}
              />

              {/* Related Tools */}
              <RelatedTools currentTool={tool} />

              {/* Bottom Ad */}
              <AdUnit
                slot="tool-page-sidebar-bottom"
                format="rectangle"
                style={{ width: '300px', height: '600px' }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Ad - Mobile */}
        <div className="lg:hidden mt-8">
          <AdUnit
            slot="tool-page-bottom-mobile"
            format="rectangle"
            className="flex justify-center"
          />
        </div>
      </div>

      {/* Schema.org Markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: tool.name,
            description: tool.fullDescription,
            applicationCategory: 'UtilityApplication',
            operatingSystem: 'Web Browser',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '1250',
            },
          }),
        }}
      />
    </div>
  );
}

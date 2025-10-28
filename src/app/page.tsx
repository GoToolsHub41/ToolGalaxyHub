import { Hero } from '@/components/homepage/Hero';
import { CategoryGrid } from '@/components/homepage/CategoryGrid';
import { ToolsGrid } from '@/components/homepage/ToolsGrid';
import { AdUnit } from '@/components/ads/AdUnit';
import { featuredTools, toolsByCategory, ToolCategory } from '@/lib/tools-data';

export default function HomePage() {
  // Get a subset of featured tools for the homepage (first 12)
  const homepageFeaturedTools = featuredTools.slice(0, 12);

  // Get popular tools from each category (2-3 tools per category)
  const fileTools = toolsByCategory[ToolCategory.FILE]?.slice(0, 3) || [];
  const imageTools = toolsByCategory[ToolCategory.IMAGE]?.slice(0, 3) || [];
  const textTools = toolsByCategory[ToolCategory.TEXT]?.slice(0, 3) || [];
  const codeTools = toolsByCategory[ToolCategory.CODE]?.slice(0, 3) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Top Ad Unit */}
      <div className="flex justify-center py-4">
        <AdUnit
          slot="homepage-header"
          format="horizontal"
          className="max-w-4xl w-full"
        />
      </div>

      {/* Category Grid */}
      <CategoryGrid />

      {/* Featured Tools */}
      <ToolsGrid
        tools={homepageFeaturedTools}
        title="⭐ Featured Tools"
        subtitle="Our most popular and frequently used tools"
        showViewAll={true}
      />

      {/* Mid-content Ad */}
      <div className="flex justify-center py-8">
        <AdUnit
          slot="homepage-mid-content"
          format="rectangle"
          className="w-full max-w-md"
        />
      </div>

      {/* File Tools Section */}
      <ToolsGrid
        tools={fileTools}
        title="📄 File Tools"
        subtitle="PDF converters, mergers, compressors and more"
        categoryId="file-tools"
      />

      {/* Image Tools Section */}
      <ToolsGrid
        tools={imageTools}
        title="🖼️ Image Tools"
        subtitle="Resize, compress, convert and edit images"
        categoryId="image-tools"
      />

      {/* Text Tools Section */}
      <ToolsGrid
        tools={textTools}
        title="📝 Text Tools"
        subtitle="Word counters, converters and text utilities"
        categoryId="text-tools"
      />

      {/* Code Tools Section */}
      <ToolsGrid
        tools={codeTools}
        title="💻 Code Tools"
        subtitle="Formatters, minifiers and code generators"
        categoryId="code-tools"
      />

      {/* Bottom Ad */}
      <div className="flex justify-center py-8">
        <AdUnit
          slot="homepage-bottom"
          format="rectangle"
          className="w-full max-w-md"
        />
      </div>

      {/* Call to Action */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-violet-nebula/20 to-cyan-star/20 border-2 border-violet-nebula rounded-3xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-slate-300 text-lg mb-6">
            Browse our full collection of 115+ tools. All tools are free, require no login, and work directly in your browser.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="#file-tools"
              className="btn-primary"
            >
              Browse All Tools
            </a>
            <a
              href="/about"
              className="btn-secondary"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

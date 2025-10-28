import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getToolBySlug, allTools } from '@/lib/tools-data';
import { ToolPageLayout } from '@/components/tools/ToolPageLayout';

// This will be populated with all tool components as they are created
// Phases 6-11 will add imports and mappings for all 115 tools
const toolComponents: Record<string, React.ComponentType<any>> = {
  // Tool components will be added here as they are implemented
  // Example:
  // JsonFormatterTool: dynamic(() => import('@/components/tools/code/JsonFormatterTool').then(m => m.JsonFormatterTool)),
};

// Generate static params for all tools (SSG)
export async function generateStaticParams() {
  return allTools.map((tool) => ({
    slug: tool.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const tool = getToolBySlug(params.slug);

  if (!tool) {
    return {
      title: 'Tool Not Found | ToolGalaxyHub',
      description: 'The requested tool could not be found.',
    };
  }

  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    keywords: tool.metaKeywords,
    openGraph: {
      title: tool.metaTitle,
      description: tool.metaDescription,
      type: 'website',
      url: `https://toolgalaxyhub.com/tools/${tool.slug}`,
      siteName: 'ToolGalaxyHub',
      images: [
        {
          url: `/images/tool-preview/${tool.slug}.png`,
          width: 1200,
          height: 630,
          alt: tool.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.metaTitle,
      description: tool.metaDescription,
      images: [`/images/tool-preview/${tool.slug}.png`],
    },
    alternates: {
      canonical: `https://toolgalaxyhub.com/tools/${tool.slug}`,
    },
  };
}

// Page component
export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getToolBySlug(params.slug);

  if (!tool) {
    notFound();
  }

  // Get the component dynamically
  const ToolComponent = toolComponents[tool.componentName];

  // If component not yet implemented, show placeholder
  if (!ToolComponent) {
    return (
      <ToolPageLayout tool={tool}>
        <div className="text-center py-12">
          <div className="inline-block p-4 bg-yellow-500/20 border border-yellow-500 rounded-xl mb-4">
            <svg
              className="w-16 h-16 text-yellow-400 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Tool Under Construction
          </h2>
          <p className="text-slate-400 mb-6">
            The <strong>{tool.name}</strong> tool is currently being implemented.
            <br />
            Check back soon for the full functionality!
          </p>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-2xl mx-auto text-left">
            <h3 className="text-lg font-semibold text-cyan-star mb-3">
              What this tool will do:
            </h3>
            <p className="text-slate-300 mb-4">{tool.fullDescription}</p>
            {tool.howToUse && tool.howToUse.length > 0 && (
              <>
                <h4 className="text-md font-semibold text-purple-400 mb-2">
                  How it will work:
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-slate-400">
                  {tool.howToUse.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </>
            )}
          </div>
        </div>
      </ToolPageLayout>
    );
  }

  return (
    <ToolPageLayout tool={tool}>
      <ToolComponent toolData={tool} />
    </ToolPageLayout>
  );
}

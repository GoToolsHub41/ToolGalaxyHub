import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - ToolGalaxyHub',
  description: 'Learn about ToolGalaxyHub, your free online tools platform with 115+ browser-based utilities.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About ToolGalaxyHub
          </h1>
          <p className="text-xl text-slate-300">
            Your universe of free online tools
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Mission */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-cyan-star mb-4">Our Mission</h2>
            <p className="text-slate-300 leading-relaxed">
              ToolGalaxyHub was created with a simple mission: to provide free, accessible, and powerful online tools
              for everyone. No login required, no limits, no hidden fees. Just 100+ essential tools available instantly
              in your browser.
            </p>
          </div>

          {/* What We Offer */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-violet-nebula mb-4">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
              <div>
                <h3 className="font-semibold text-white mb-2">📄 File Tools</h3>
                <p className="text-sm">PDF converters, mergers, compressors and more</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">🖼️ Image Tools</h3>
                <p className="text-sm">Resize, compress, convert and edit images</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">📝 Text Tools</h3>
                <p className="text-sm">Word counters, converters and text utilities</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">💻 Code Tools</h3>
                <p className="text-sm">Formatters, minifiers and code generators</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">🔍 SEO Tools</h3>
                <p className="text-sm">Meta tags, sitemaps and SEO analyzers</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">🎬 Video & Audio Tools</h3>
                <p className="text-sm">Converters, trimmers and editors</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">🔒 Security Tools</h3>
                <p className="text-sm">Password generators, hash tools and encryption</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">...and more!</h3>
                <p className="text-sm">115+ tools and growing</p>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-cyan-star mb-4">Why Choose ToolGalaxyHub?</h2>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <div>
                  <strong className="text-white">100% Free Forever:</strong> All tools are completely free with no hidden fees or premium tiers
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <div>
                  <strong className="text-white">No Login Required:</strong> Start using any tool immediately without creating an account
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <div>
                  <strong className="text-white">Privacy First:</strong> All processing happens in your browser - your data never leaves your device
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <div>
                  <strong className="text-white">No Limits:</strong> Use any tool as many times as you need
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <div>
                  <strong className="text-white">Fast & Reliable:</strong> Client-side processing means instant results
                </div>
              </li>
            </ul>
          </div>

          {/* Technology */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-violet-nebula mb-4">Technology</h2>
            <p className="text-slate-300 leading-relaxed">
              ToolGalaxyHub is built with modern web technologies including Next.js, React, and TypeScript.
              All tools run entirely in your browser, ensuring maximum privacy and speed. We use industry-standard
              libraries for processing while maintaining a lightweight, fast user experience.
            </p>
          </div>

          {/* Contact CTA */}
          <div className="bg-gradient-to-r from-violet-nebula/20 to-cyan-star/20 border-2 border-violet-nebula rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Get In Touch</h2>
            <p className="text-slate-300 mb-6">
              Have questions, feedback, or suggestions for new tools?
            </p>
            <a
              href="/contact"
              className="btn-primary inline-block"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

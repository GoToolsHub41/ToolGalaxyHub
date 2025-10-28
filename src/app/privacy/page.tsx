import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - ToolGalaxyHub',
  description: 'Learn how ToolGalaxyHub protects your privacy. All processing happens in your browser - your data never leaves your device.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Privacy Policy</h1>
        <p className="text-slate-400 mb-8">Last updated: January 2025</p>

        <div className="space-y-8">
          {/* Key Points */}
          <div className="bg-green-900/20 border border-green-500 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-green-400 mb-4">Key Privacy Points</h2>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>Your files and data are processed entirely in your browser</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>We never upload or store your files on our servers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>No account creation or personal information required</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>Anonymous usage analytics only (Google Analytics)</span>
              </li>
            </ul>
          </div>

          {/* Sections */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-cyan-star mb-4">1. Information We Collect</h2>
            <div className="text-slate-300 space-y-3">
              <p><strong className="text-white">Usage Data:</strong> We use Google Analytics to collect anonymous usage data including:</p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-slate-400">
                <li>Pages visited</li>
                <li>Tools used</li>
                <li>Browser type and version</li>
                <li>Device type</li>
                <li>Referring website</li>
                <li>General location (country/city level)</li>
              </ul>
              <p><strong className="text-white">What We Don't Collect:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-slate-400">
                <li>Personal information (name, email, address)</li>
                <li>Files you upload or process</li>
                <li>Content you input into tools</li>
                <li>IP addresses (beyond what Google Analytics anonymizes)</li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-violet-nebula mb-4">2. How We Use Your Data</h2>
            <div className="text-slate-300 space-y-2">
              <p>We use collected data to:</p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-slate-400">
                <li>Understand which tools are most popular</li>
                <li>Improve user experience</li>
                <li>Fix bugs and technical issues</li>
                <li>Develop new features</li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-cyan-star mb-4">3. Client-Side Processing</h2>
            <p className="text-slate-300 leading-relaxed">
              All tools on ToolGalaxyHub process data entirely in your browser using JavaScript. This means:
            </p>
            <ul className="list-disc list-inside ml-4 mt-3 space-y-1 text-slate-400">
              <li>Your files never leave your device</li>
              <li>Processing happens locally on your computer</li>
              <li>No server uploads or storage</li>
              <li>Complete privacy for sensitive documents</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-violet-nebula mb-4">4. Cookies</h2>
            <p className="text-slate-300 leading-relaxed">
              We use cookies only for Google Analytics to track anonymous usage statistics. These cookies do not
              contain personal information. You can disable cookies in your browser settings without affecting
              the functionality of our tools.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-cyan-star mb-4">5. Third-Party Services</h2>
            <div className="text-slate-300 space-y-3">
              <p><strong className="text-white">Google Analytics:</strong> We use Google Analytics to track anonymous usage data. Google's privacy policy applies to this data.</p>
              <p><strong className="text-white">Google AdSense:</strong> We display ads via Google AdSense. Google may use cookies to show relevant ads. You can opt out of personalized ads in your Google Ad Settings.</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-violet-nebula mb-4">6. Data Security</h2>
            <p className="text-slate-300 leading-relaxed">
              Since all processing happens in your browser and we don't collect or store your files, your data
              security is entirely in your control. We recommend using HTTPS (which we enforce) and keeping your
              browser updated for the best security.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-cyan-star mb-4">7. Children's Privacy</h2>
            <p className="text-slate-300 leading-relaxed">
              Our services are available to users of all ages. We do not knowingly collect personal information
              from children. Since we don't collect personal data and all processing is local, our tools are safe
              for users of any age.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-violet-nebula mb-4">8. Changes to This Policy</h2>
            <p className="text-slate-300 leading-relaxed">
              We may update this privacy policy from time to time. Any changes will be posted on this page with
              an updated "Last updated" date.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-cyan-star mb-4">9. Contact Us</h2>
            <p className="text-slate-300 leading-relaxed">
              If you have questions about this privacy policy, please visit our{' '}
              <a href="/contact" className="text-cyan-star hover:text-cyan-400 underline">contact page</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

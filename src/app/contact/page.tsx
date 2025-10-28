import { Metadata } from 'next';
import { Mail, Github, Twitter } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us - ToolGalaxyHub',
  description: 'Get in touch with ToolGalaxyHub. We\'d love to hear your feedback, suggestions, or questions.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-slate-300">
            We'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Email */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 hover:border-cyan-star transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Email</h2>
            </div>
            <p className="text-slate-300 mb-4">
              Send us an email for general inquiries, feedback, or support.
            </p>
            <a
              href="mailto:hello@toolgalaxyhub.com"
              className="text-cyan-star hover:text-cyan-400 font-semibold"
            >
              hello@toolgalaxyhub.com
            </a>
          </div>

          {/* GitHub */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 hover:border-violet-nebula transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Github className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">GitHub</h2>
            </div>
            <p className="text-slate-300 mb-4">
              Report bugs, request features, or contribute to the project.
            </p>
            <a
              href="https://github.com/toolgalaxyhub/tools"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-nebula hover:text-purple-400 font-semibold"
            >
              View on GitHub →
            </a>
          </div>

          {/* Twitter */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 hover:border-cyan-star transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Twitter className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Twitter</h2>
            </div>
            <p className="text-slate-300 mb-4">
              Follow us for updates, new tools, and tips.
            </p>
            <a
              href="https://twitter.com/toolgalaxyhub"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-star hover:text-cyan-400 font-semibold"
            >
              @toolgalaxyhub →
            </a>
          </div>

          {/* Feedback */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 hover:border-violet-nebula transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl">
                💬
              </div>
              <h2 className="text-xl font-bold text-white">Feedback</h2>
            </div>
            <p className="text-slate-300 mb-4">
              Have suggestions for new tools or improvements? We're all ears!
            </p>
            <a
              href="mailto:feedback@toolgalaxyhub.com"
              className="text-violet-nebula hover:text-purple-400 font-semibold"
            >
              Send Feedback →
            </a>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-cyan-star mb-2">
                Are your tools really free?
              </h3>
              <p className="text-slate-300">
                Yes! All our tools are 100% free with no hidden costs, premium tiers, or limits.
                You can use any tool as many times as you need.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-cyan-star mb-2">
                Is my data safe?
              </h3>
              <p className="text-slate-300">
                Absolutely. All processing happens in your browser - your files never leave your device.
                We don't upload, store, or have any access to your data. See our{' '}
                <a href="/privacy" className="text-cyan-star hover:underline">Privacy Policy</a> for details.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-cyan-star mb-2">
                Can I suggest a new tool?
              </h3>
              <p className="text-slate-300">
                We love suggestions! Email us at feedback@toolgalaxyhub.com or open an issue on GitHub
                with your tool idea.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-cyan-star mb-2">
                How can I support this project?
              </h3>
              <p className="text-slate-300">
                The best way to support us is to share ToolGalaxyHub with others who might find it useful.
                You can also contribute code on GitHub or provide feedback to help us improve.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

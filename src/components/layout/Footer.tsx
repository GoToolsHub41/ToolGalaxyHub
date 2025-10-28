import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-800 bg-cosmic-purple/30 mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-light-purple font-bold mb-4">ToolGalaxyHub</h3>
            <p className="text-slate-text text-sm">
              100+ free browser-based online tools. No login required. Fast, secure, and 100% free forever.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Popular Tools</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/tools/pdf-merger" className="text-slate-text hover:text-cyan-star text-sm transition-colors">
                  PDF Merger
                </Link>
              </li>
              <li>
                <Link href="/tools/image-resizer" className="text-slate-text hover:text-cyan-star text-sm transition-colors">
                  Image Resizer
                </Link>
              </li>
              <li>
                <Link href="/tools/json-formatter" className="text-slate-text hover:text-cyan-star text-sm transition-colors">
                  JSON Formatter
                </Link>
              </li>
              <li>
                <Link href="/tools/password-generator" className="text-slate-text hover:text-cyan-star text-sm transition-colors">
                  Password Generator
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#file-tools" className="text-slate-text hover:text-cyan-star text-sm transition-colors">
                  File Tools
                </Link>
              </li>
              <li>
                <Link href="/#image-tools" className="text-slate-text hover:text-cyan-star text-sm transition-colors">
                  Image Tools
                </Link>
              </li>
              <li>
                <Link href="/#code-tools" className="text-slate-text hover:text-cyan-star text-sm transition-colors">
                  Code Tools
                </Link>
              </li>
              <li>
                <Link href="/#security-tools" className="text-slate-text hover:text-cyan-star text-sm transition-colors">
                  Security Tools
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-slate-text hover:text-cyan-star text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-text hover:text-cyan-star text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-text hover:text-cyan-star text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-slate-text text-sm">
            &copy; {currentYear} ToolGalaxyHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

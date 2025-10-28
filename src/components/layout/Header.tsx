import Link from 'next/link'
import { Rocket } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b border-slate-800 bg-cosmic-purple/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Rocket className="w-8 h-8 text-cyan-star" />
            <span className="text-xl font-bold text-gradient">
              ToolGalaxyHub
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-white hover:text-cyan-star transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-slate-text hover:text-cyan-star transition-colors font-medium"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-slate-text hover:text-cyan-star transition-colors font-medium"
            >
              Contact
            </Link>
          </nav>

          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

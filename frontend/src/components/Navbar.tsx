export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/highclaw.png" alt="HighClaw" className="w-10 h-10 rounded-lg" />
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            HighClaw
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#quickstart" className="hover:text-white transition-colors">Quick Start</a>
          <a href="#integrations" className="hover:text-white transition-colors">Integrations</a>
          <a href="https://github.com/903174293/highclaw" target="_blank" rel="noopener"
            className="hover:text-white transition-colors">GitHub</a>
        </div>
        <a href="#quickstart"
          className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all">
          Get Started
        </a>
      </div>
    </nav>
  )
}

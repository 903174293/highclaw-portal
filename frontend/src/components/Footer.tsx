export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <div className="space-y-2">
              <a href="#features" className="block text-gray-500 text-sm hover:text-gray-300 transition-colors">Features</a>
              <a href="#integrations" className="block text-gray-500 text-sm hover:text-gray-300 transition-colors">Integrations</a>
              <a href="#quickstart" className="block text-gray-500 text-sm hover:text-gray-300 transition-colors">Quick Start</a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Community</h4>
            <div className="space-y-2">
              <a href="https://github.com/903174293/highclaw" target="_blank" rel="noopener"
                className="block text-gray-500 text-sm hover:text-gray-300 transition-colors">GitHub</a>
              <a href="https://discord.gg/highclaw" target="_blank" rel="noopener"
                className="block text-gray-500 text-sm hover:text-gray-300 transition-colors">Discord</a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <div className="space-y-2">
              <a href="#" className="block text-gray-500 text-sm hover:text-gray-300 transition-colors">Documentation</a>
              <a href="#" className="block text-gray-500 text-sm hover:text-gray-300 transition-colors">Blog</a>
              <a href="#" className="block text-gray-500 text-sm hover:text-gray-300 transition-colors">Showcase</a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Stay in the Loop</h4>
            <p className="text-gray-500 text-sm mb-3">Get updates on new features and integrations.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/30"
              />
              <button className="px-4 py-2 bg-emerald-500/15 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm font-medium hover:bg-emerald-500/25 transition-all">
                →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <img src="/highclaw.png" alt="HighClaw" className="w-8 h-8 rounded-lg" />
            <span className="text-sm text-gray-500">
              Built by <span className="text-emerald-400">HighClaw</span> 🦀 — Your Personal AI Assistant
            </span>
          </div>
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} HighClaw. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

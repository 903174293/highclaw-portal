export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" />
      <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
      
      <div className="relative max-w-5xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-3xl blur-2xl animate-pulse" />
            <img
              src="/highclaw.png"
              alt="HighClaw"
              className="relative w-40 h-40 md:w-56 md:h-56 rounded-3xl shadow-2xl shadow-emerald-500/20 border-2 border-emerald-500/20"
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
            HighClaw
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 font-medium mb-4">
          The AI that actually does things.
        </p>
        <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Clears your inbox, sends emails, manages your calendar, checks you in for flights.
          All from WhatsApp, Telegram, or any chat app you already use.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="#quickstart"
            className="group px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-black font-semibold text-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105">
            Get Started
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </a>
          <a href="https://github.com/903174293/highclaw" target="_blank" rel="noopener"
            className="px-8 py-3.5 border border-white/10 rounded-xl text-gray-300 font-medium text-lg hover:bg-white/5 hover:border-white/20 transition-all duration-300">
            View on GitHub
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <div>
            <div className="text-2xl md:text-3xl font-bold text-emerald-400">24/7</div>
            <div className="text-xs text-gray-500 mt-1">Always Running</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-cyan-400">50+</div>
            <div className="text-xs text-gray-500 mt-1">Integrations</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-teal-400">∞</div>
            <div className="text-xs text-gray-500 mt-1">Possibilities</div>
          </div>
        </div>
      </div>
    </section>
  )
}

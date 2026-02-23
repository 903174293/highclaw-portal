const integrations = [
  'WhatsApp', 'Telegram', 'Discord', 'Slack', 'Signal', 'iMessage',
  'Claude', 'GPT', 'Spotify', 'Hue', 'Obsidian', 'Twitter',
  'Browser', 'Gmail', 'GitHub',
]

export default function Integrations() {
  return (
    <section id="integrations" className="py-20 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="text-emerald-400">⟩</span> Works With Everything
        </h2>
        <p className="text-gray-500 mb-12">50+ integrations and growing</p>

        <div className="flex flex-wrap justify-center gap-3">
          {integrations.map((name, i) => (
            <div key={i}
              className="px-5 py-2.5 rounded-lg bg-white/[0.03] border border-white/5 text-gray-400 text-sm font-medium hover:border-emerald-500/20 hover:text-emerald-400 hover:bg-emerald-500/[0.03] transition-all duration-300 cursor-default">
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

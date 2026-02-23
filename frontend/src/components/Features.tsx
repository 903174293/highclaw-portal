const features = [
  {
    icon: '🖥️',
    title: 'Runs on Your Machine',
    desc: 'Mac, Windows, or Linux. Anthropic, OpenAI, or local models. Private by default—your data stays yours.',
  },
  {
    icon: '💬',
    title: 'Any Chat App',
    desc: 'Talk to it on WhatsApp, Telegram, Discord, Slack, Signal, or iMessage. Works in DMs and group chats.',
  },
  {
    icon: '🧠',
    title: 'Persistent Memory',
    desc: 'Remembers you and becomes uniquely yours. Your preferences, your context, your AI.',
  },
  {
    icon: '🌐',
    title: 'Browser Control',
    desc: 'It can browse the web, fill forms, and extract data from any site.',
  },
  {
    icon: '⚡',
    title: 'Full System Access',
    desc: 'Read and write files, run shell commands, execute scripts. Full access or sandboxed—your choice.',
  },
  {
    icon: '🔌',
    title: 'Skills & Plugins',
    desc: 'Extend with community skills or build your own. It can even write its own.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          <span className="text-emerald-400">⟩</span> What It Does
        </h2>
        <p className="text-gray-500 text-center mb-12">Your personal AI assistant, running 24/7</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={i}
              className="group p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 hover:bg-emerald-500/[0.02] transition-all duration-300">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                {f.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

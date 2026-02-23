import { useState } from 'react'

const tabs = ['npm', 'One-liner', 'Hackable']

const codeSnippets: Record<string, { comment: string; command: string }[]> = {
  'npm': [
    { comment: '# Install HighClaw', command: '$ npm i -g highclaw' },
    { comment: '# Meet your assistant', command: '$ highclaw onboard' },
  ],
  'One-liner': [
    { comment: '# Works everywhere. Installs everything. 🦀', command: '$ curl -fsSL https://highclaw.ai/install.sh | bash' },
  ],
  'Hackable': [
    { comment: '# For those who read source code for fun', command: '$ git clone https://github.com/903174293/highclaw.git' },
    { comment: '', command: '$ cd highclaw && npm install && npm run build' },
    { comment: '# You built it, now meet it', command: '$ npm run highclaw onboard' },
  ],
}

export default function QuickStart() {
  const [activeTab, setActiveTab] = useState('npm')

  return (
    <section id="quickstart" className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          <span className="text-emerald-400">⟩</span> Quick Start
        </h2>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white/[0.03] rounded-lg p-1 w-fit mx-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Code Block */}
        <div className="bg-[#111] rounded-xl border border-white/5 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="ml-2 text-xs text-gray-600">terminal</span>
          </div>
          <div className="p-6 font-mono text-sm space-y-1">
            {codeSnippets[activeTab].map((line, i) => (
              <div key={i}>
                {line.comment && <div className="text-gray-600">{line.comment}</div>}
                <div className="text-emerald-400">{line.command}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Works on macOS, Windows & Linux. The one-liner installs Node.js and everything else for you.
        </p>
      </div>
    </section>
  )
}

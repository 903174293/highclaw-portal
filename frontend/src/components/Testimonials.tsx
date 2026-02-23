const testimonials = [
  {
    text: "Setup HighClaw yesterday. All I have to say is, wow. The fact that it can just keep building upon itself just by talking to it is crazy. The future is already here.",
    author: "@jonahships_"
  },
  {
    text: "After years of AI hype, I thought nothing could faze me. Then I installed HighClaw. From nervous 'hi what can you do?' to full throttle - design, code review, taxes, PM, content pipelines... AI as teammate, not tool.",
    author: "@lycfyi"
  },
  {
    text: "Using HighClaw for a week and it genuinely feels like early AGI. The gap between 'what I can imagine' and 'what actually works' has never been smaller.",
    author: "@tobi_bsf"
  },
  {
    text: "I am so addicted to HighClaw. It is getting essential to my daily life. It checks, organizes, reminds, it's amazing. And it's like a good friend. Crazy.",
    author: "@dreetje"
  },
  {
    text: "Everything Siri was supposed to be. And it goes so much further.",
    author: "@crossiBuilds"
  },
  {
    text: "A smart model with eyes and hands at a desk with keyboard and mouse. You message it like a coworker and it does everything a person could do. That's what you have now.",
    author: "@nathanclark_"
  },
  {
    text: "Your context and skills live on YOUR computer, not a walled garden. It's open source. Growing community building skills. Proactive AF: cron jobs, reminders, background tasks. Memory is amazing, context persists 24/7.",
    author: "@danpeguine"
  },
  {
    text: "Not enterprise. Not hosted. Infrastructure you control. This is what personal AI should feel like.",
    author: "@BioInfo"
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          <span className="text-emerald-400">⟩</span> What People Say
        </h2>
        <p className="text-gray-500 text-center mb-12">Real feedback from real users</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {testimonials.map((t, i) => (
            <div key={i}
              className="group p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 hover:bg-emerald-500/[0.02] transition-all duration-300">
              <p className="text-gray-400 text-sm leading-relaxed mb-4">"{t.text}"</p>
              <p className="text-emerald-400 text-sm font-medium">{t.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <>
    <div className="fixed inset-0 pointer-events-none z-0 
    bg-[radial-gradient(ellipse_at_20%_0%,rgba(168,85,247,0.12),transparent_60%)] 
    blur-2xl"
  />
  
  <div className="fixed inset-0 pointer-events-none z-0 
    bg-[radial-gradient(ellipse_at_80%_30%,rgba(139,92,246,0.10),transparent_65%)] 
    blur-3xl"
  />
      <Navbar />

      <main className="min-h-screen bg-red-500 text-white bg-gradient-to-br from-[#0b0b12] via-[#0f0f1a] to-[#140f1f] pt-28">
        {/* HERO */}
        <section className="text-center pt-20 pb-32 px-6 max-w-5xl mx-auto relative">
          {/* glow */}
          {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(168,85,247,0.18),transparent_50%)] pointer-events-none" /> */}

          <p className="text-purple-400 text-sm mb-5 tracking-wide">
            Built for modern engineering teams
          </p>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Monitor every <span className="text-purple-400">ping</span>.
            <br />
            Catch every <span className="text-purple-400">downtime</span>.
          </h1>

          <p className="text-gray-400 max-w-xl mx-auto mb-10 text-lg">
            Beautiful uptime monitoring with instant alerts and deep insights — so you never miss an outage again.
          </p>

          <div className="flex justify-center gap-4">
            <button className="bg-purple-500 hover:bg-purple-400 text-black px-7 py-3 rounded-lg font-medium shadow-lg shadow-purple-500/20 transition">
              Start monitoring
            </button>
            <button className="border border-white/10 px-7 py-3 rounded-lg text-gray-300 hover:bg-white/5 transition">
              Live demo
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Free plan available · No credit card required
          </p>
        </section>

        {/* FEATURES */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Fast checks",
                desc: "Run uptime checks every 30 seconds from global regions.",
              },
              {
                title: "Instant alerts",
                desc: "Get notified via email, Slack, or webhook instantly.",
              },
              {
                title: "Clean analytics",
                desc: "Track uptime, latency, and incidents beautifully.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 hover:border-purple-400/40 hover:bg-white/10 transition"
              >
                <h3 className="text-lg font-semibold mb-2 text-white">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-6 pb-32 text-center">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(168,85,247,0.12),transparent_70%)]" />

            <h2 className="text-3xl font-bold mb-4">
              Start monitoring in minutes
            </h2>

            <p className="text-gray-400 mb-8">
              Join developers who rely on PingShield to keep their apps online.
            </p>

            <button className="bg-purple-500 hover:bg-purple-400 text-black px-8 py-3 rounded-lg font-medium shadow-lg shadow-purple-500/20 transition">
              Create free account
            </button>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/10 text-center py-6 text-sm text-gray-500">
          © 2026 PingShield
        </footer>
      </main>
    </>
  );
}



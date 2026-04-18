import Link from "next/link";

const stats = [
  { label: "Years of Experience", value: "2+", icon: "💼" },
  { label: "QA Projects", value: "5+", icon: "🧪" },
  { label: "Certifications", value: "4", icon: "🏆" },
  { label: "GoMyCode", value: "2025", icon: "🎓" },
];

const techStack = ["React", "Next.js", "TypeScript", "Node.js", "SQL", "Postman", "Agile"];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Background glow orbs */}
      <div
        className="glow-orb"
        style={{
          width: 600,
          height: 600,
          background: "#6366f1",
          top: -200,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
      <div
        className="glow-orb"
        style={{
          width: 400,
          height: 400,
          background: "#c084fc",
          top: 200,
          right: -100,
        }}
      />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 text-center">
        {/* Badge */}
        <div
          className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border"
          style={{
            background: "rgba(99, 102, 241, 0.1)",
            borderColor: "rgba(99, 102, 241, 0.4)",
            color: "#a5b4fc",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Open to work — Dakar, Senegal
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-7xl font-black mb-4 leading-[1.05] tracking-tight">
          Teddy Steve{" "}
          <span className="gradient-text">Ryan Coly</span>
        </h1>

        <p className="text-base sm:text-lg text-indigo-300 font-mono mb-4 tracking-wide">
          QA Engineer · Functional Tester · ServiceNow Certified
        </p>

        <p className="text-lg sm:text-xl text-slate-400 max-w-xl mb-4 leading-relaxed">
          QA Engineer with 2+ years of experience in functional testing, API testing, and fintech.
          Currently at{" "}
          <span className="text-indigo-400 font-medium">Yawize</span> &amp;{" "}
          MSc CS @{" "}
          <span className="text-violet-400 font-medium">GoMyCode</span>.
        </p>

        {/* Tech stack pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-full text-xs font-medium text-slate-400 border"
              style={{ background: "rgba(15,15,30,0.8)", borderColor: "#1e1e3a" }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/projects"
            className="focus-ring group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 hover:shadow-[0_0_24px_rgba(99,102,241,0.4)]"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            View my projects
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <Link
            href="/contact"
            className="focus-ring px-6 py-3 rounded-xl font-semibold text-slate-300 border border-slate-700 hover:border-indigo-500 hover:text-white transition-all hover:bg-indigo-950/30"
          >
            Contact Me
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="relative max-w-4xl mx-auto px-6 pb-24">
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-2xl p-6 border"
          style={{ background: "rgba(13,13,31,0.8)", borderColor: "#1e1e3a" }}
        >
          {stats.map(({ label, value, icon }) => (
            <div key={label} className="text-center py-4">
              <div className="text-2xl mb-1">{icon}</div>
              <p className="text-3xl font-black text-white mb-1">{value}</p>
              <p className="text-slate-500 text-xs uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

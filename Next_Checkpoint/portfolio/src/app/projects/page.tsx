import Link from "next/link";

const projects = [
  {
    title: "BugTrackr",
    description:
      "Bug tracking platform built for QA teams. Create test campaigns, log defects with severity levels, assign to devs, and track resolution status in real time.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
    github: "https://github.com/ryancoly999",
    icon: "🐛",
    gradient: "from-red-500/10 to-orange-500/5",
  },
  {
    title: "PaySen",
    description:
      "Mobile-first fintech dashboard for tracking personal transactions. Supports multi-currency, spending categories, and monthly analytics charts.",
    tech: ["React", "Node.js", "Chart.js", "REST API"],
    github: "https://github.com/ryancoly999",
    icon: "💳",
    gradient: "from-emerald-500/10 to-teal-500/5",
  },
  {
    title: "APIGuard",
    description:
      "Postman-like API testing tool with a web UI. Write requests, set assertions, group them into test suites and get pass/fail reports on each run.",
    tech: ["React", "TypeScript", "Express", "MongoDB"],
    github: "https://github.com/ryancoly999",
    icon: "🔌",
    gradient: "from-violet-500/10 to-indigo-500/5",
  },
  {
    title: "KanFlow",
    description:
      "Agile project management board inspired by Jira. Drag-and-drop kanban columns, sprint planning, story points, and team velocity tracking.",
    tech: ["React", "Redux", "DnD Kit", "Tailwind CSS"],
    github: "https://github.com/ryancoly999",
    icon: "📋",
    gradient: "from-blue-500/10 to-cyan-500/5",
  },
  {
    title: "CertVault",
    description:
      "Certification management app. Upload, organize and share professional certificates. Auto-extracts expiry dates and sends renewal reminders.",
    tech: ["Next.js", "Supabase", "TypeScript", "Resend"],
    github: "https://github.com/ryancoly999",
    icon: "🏆",
    gradient: "from-yellow-500/10 to-amber-500/5",
  },
  {
    title: "IncidentIQ",
    description:
      "ServiceNow-inspired incident management system. Log incidents, set priority levels, assign resolvers, escalate tickets and export audit reports.",
    tech: ["React", "Node.js", "MySQL", "JWT"],
    github: "https://github.com/ryancoly999",
    icon: "🚨",
    gradient: "from-pink-500/10 to-rose-500/5",
  },
];

export default function Projects() {
  return (
    <div className="relative overflow-hidden">
      <div
        className="glow-orb"
        style={{ width: 500, height: 500, background: "#8b5cf6", top: 0, right: -200 }}
      />

      <div className="relative max-w-5xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="mb-16">
          <p className="text-indigo-400 font-mono text-sm mb-3 tracking-widest uppercase">
            // my_work
          </p>
          <h1 className="text-5xl font-black mb-4">
            Featured{" "}
            <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Projects built during my training at GoMyCode — each one a step forward in my journey.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <div
              key={project.title}
              className={`gradient-border card-hover group flex flex-col rounded-2xl p-6 bg-gradient-to-br ${project.gradient}`}
              style={{ border: "1px solid #1e1e3a", background: "rgba(13,13,31,0.95)" }}
            >
              {/* Icon */}
              <div className="text-3xl mb-4">{project.icon}</div>

              {/* Title */}
              <h2 className="text-lg font-bold mb-2 text-white group-hover:text-indigo-300 transition-colors">
                {project.title}
              </h2>

              {/* Description */}
              <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-4">
                {project.description}
              </p>

              {/* Tech badges */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-full text-xs font-medium border"
                    style={{
                      background: "rgba(99, 102, 241, 0.1)",
                      borderColor: "rgba(99, 102, 241, 0.3)",
                      color: "#a5b4fc",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Link */}
              <Link
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors group/link"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
                <span className="group-hover/link:translate-x-0.5 transition-transform">→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

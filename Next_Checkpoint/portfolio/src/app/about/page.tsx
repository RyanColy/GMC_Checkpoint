const technicalSkills = [
  {
    category: "Test Management",
    icon: "🧪",
    color: "#6366f1",
    items: ["Squash TM 2.0", "ATF", "Test Plans", "Bug Reporting", "Functional Testing", "UAT"],
  },
  {
    category: "API Testing",
    icon: "🔌",
    color: "#10b981",
    items: ["Postman", "SoapUI", "Swagger", "REST / SOAP"],
  },
  {
    category: "Languages & Web",
    icon: "💻",
    color: "#f59e0b",
    items: ["SQL", "Bash", "HTML", "CSS", "JavaScript", "TypeScript"],
  },
  {
    category: "Tools & Platforms",
    icon: "🛠️",
    color: "#ec4899",
    items: ["ServiceNow", "Kanest", "Office 365", "React", "Next.js", "Agile / Scrum"],
  },
];

const education = [
  {
    degree: "MSc Computer Science — Software Engineering",
    school: "GoMyCode School of Technology",
    period: "2025 – present",
    color: "#6366f1",
  },
  {
    degree: "Master Transformation Digitale",
    school: "École Supérieure Multinationale des Télécommunications",
    period: "2022 – 2024",
    color: "#8b5cf6",
  },
  {
    degree: "Licence Management & Économie Numérique",
    school: "École Supérieure Multinationale des Télécommunications",
    period: "2019 – 2022",
    color: "#a78bfa",
  },
  {
    degree: "Baccalauréat",
    school: "Cardinal H. Thiandoum",
    period: "2019",
    color: "#c4b5fd",
  },
];

const experience = [
  {
    role: "QA Analyst — QA Engineer",
    company: "Yawize",
    period: "August 2025 – Present",
    location: "Dakar, Senegal",
    projects: [
      {
        name: "PSG – Security Incident Response",
        tasks: [
          "Functional testing on the Knowledge Management module (creation, validation and publishing of articles)",
          "Writing test books and test plans (nominal & error cases)",
          "Execution of test campaigns and live testing in pre-production environment",
        ],
      },
      {
        name: "Desjardins – ServiceNow Integration",
        tasks: [
          "Functional testing for the integration of ServiceNow into the Desjardins ecosystem",
          "End-to-end validation of communication between ServiceNow and third-party platforms",
          "API testing with SoapUI (REST endpoint validation)",
          "Writing test books and executing validation scenarios",
        ],
      },
    ],
  },
  {
    role: "Junior Consultant — QA & PM",
    company: "Dabyan",
    period: "October 2023 – September 2024",
    location: "Dakar, Senegal",
    projects: [
      {
        name: "SVFM – Anti-Fraud Banking System",
        tasks: [
          "Functional testing on the SVFM platform (banking anti-fraud system)",
          "Writing test cases, preparing test data sets and executing tests",
          "Elaboration of test reports",
        ],
      },
      {
        name: "Powercard 3 Migration",
        tasks: [
          "UAT tester on the Powercard 3 platform migration",
          "Reporting and tracking anomalies with the development team",
          "Level 0 support and elaboration of acceptance test reports",
        ],
      },
      {
        name: "GimPay – Project Management",
        tasks: [
          "Junior project manager on the GimPay payment solution (GIM)",
          "Technical review of digital solutions and Agile project management",
          "API testing with Postman on GimPay endpoints",
        ],
      },
    ],
  },
  {
    role: "Analyst / Sales Intern",
    company: "Senelec",
    period: "August 2023 – September 2023",
    location: "Dakar, Senegal",
    projects: [
      {
        name: null,
        tasks: [
          "Collection and interpretation of operational data",
          "Report creation and commercial KPI tracking",
        ],
      },
    ],
  },
];

const certifications = [
  { name: "ServiceNow Administrator", org: "ServiceNow", icon: "⚙️" },
  { name: "Agile Project Management", org: "PMI", icon: "🔄" },
  { name: "Waterfall Project Management", org: "PMI", icon: "📋" },
  { name: "Digital Marketing Fundamentals", org: "Google", icon: "📱" },
];

const languages = [
  { lang: "French", level: "Native", pct: 100 },
  { lang: "Wolof", level: "Native", pct: 100 },
  { lang: "English", level: "Fluent", pct: 75 },
];

export default function About() {
  return (
    <div className="relative overflow-hidden">
      <div
        className="glow-orb"
        style={{ width: 500, height: 500, background: "#6366f1", top: -100, left: -150 }}
      />

      <div className="relative max-w-4xl mx-auto px-6 py-20 space-y-20">

        {/* Header */}
        <div>
          <p className="text-indigo-400 font-mono text-sm mb-3 tracking-widest uppercase">
            // about_me
</p>
          <h1 className="text-5xl font-black mb-3 leading-tight">
            Teddy Steve <span className="gradient-text">Ryan Coly</span>
          </h1>
          <p className="text-indigo-300 font-mono text-sm mb-4">
            QA Engineer · Functional Tester · ServiceNow Certified
          </p>
          <p className="text-slate-400 text-base max-w-2xl mb-5 leading-relaxed">
            QA Engineer with 2+ years of experience in functional testing, API testing and software
            quality management in Agile and Waterfall environments.
            ServiceNow Certified Administrator, specialized in fintech and banking projects.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <span>📍 Dakar, HLM Grand Yoff</span>
            <span>✉️ ryan.coly999@gmail.com</span>
            <span>📞 +221 77 423 30 10</span>
          </div>
        </div>

        {/* Experience */}
        <div>
          <p className="text-indigo-400 font-mono text-sm mb-3 tracking-widest uppercase">
            // experience
          </p>
          <h2 className="text-3xl font-black mb-8">Work Experience</h2>
          <div className="space-y-6">
            {experience.map((exp) => (
              <div
                key={exp.company}
                className="gradient-border card-hover rounded-xl p-6 border"
                style={{ background: "rgba(13,13,31,0.9)", borderColor: "#1e1e3a" }}
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                    <p className="text-indigo-400 font-semibold">{exp.company}</p>
                  </div>
                  <div className="text-right text-sm text-slate-500">
                    <p>{exp.period}</p>
                    <p>{exp.location}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {exp.projects.map((proj, i) => (
                    <div key={i}>
                      {proj.name && (
                        <p className="text-sm font-semibold text-violet-400 mb-2">
                          ▸ {proj.name}
                        </p>
                      )}
                      <ul className="space-y-1.5 pl-3">
                        {proj.tasks.map((task, j) => (
                          <li key={j} className="flex items-start gap-2 text-slate-400 text-sm">
                            <span className="text-indigo-600 mt-0.5 shrink-0">–</span>
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <p className="text-indigo-400 font-mono text-sm mb-3 tracking-widest uppercase">
            // education
          </p>
          <h2 className="text-3xl font-black mb-8">Education</h2>
          <div className="relative pl-6 border-l-2 border-indigo-900 space-y-8">
            {education.map((edu, i) => (
              <div key={i} className="relative">
                <div
                  className="absolute -left-[29px] top-1.5 w-3 h-3 rounded-full border-2 border-indigo-900"
                  style={{ background: edu.color }}
                />
                <div
                  className="gradient-border card-hover rounded-xl p-5 border"
                  style={{ background: "rgba(13,13,31,0.9)", borderColor: "#1e1e3a" }}
                >
                  <p className="font-bold text-white">{edu.degree}</p>
                  <p className="font-medium mt-0.5" style={{ color: edu.color }}>{edu.school}</p>
                  <p className="text-slate-500 text-sm mt-1">{edu.period}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Skills */}
        <div>
          <p className="text-indigo-400 font-mono text-sm mb-3 tracking-widest uppercase">
            // tech_stack
          </p>
          <h2 className="text-3xl font-black mb-8">Technical Skills</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {technicalSkills.map(({ category, icon, color, items }) => (
              <div
                key={category}
                className="gradient-border card-hover rounded-xl p-5 border"
                style={{ background: "rgba(13,13,31,0.9)", borderColor: "#1e1e3a" }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">{icon}</span>
                  <h3 className="font-bold" style={{ color }}>{category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full text-sm font-medium text-slate-300 border"
                      style={{ background: "rgba(255,255,255,0.04)", borderColor: "#2a2a4a" }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications + Languages */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Certifications */}
          <div>
            <p className="text-indigo-400 font-mono text-sm mb-3 tracking-widest uppercase">
              // certifications
            </p>
            <h2 className="text-2xl font-black mb-6">Certifications</h2>
            <div className="space-y-3">
              {certifications.map(({ name, org, icon }) => (
                <div
                  key={name}
                  className="flex items-center gap-3 rounded-xl p-4 border"
                  style={{ background: "rgba(13,13,31,0.9)", borderColor: "#1e1e3a" }}
                >
                  <span className="text-xl">{icon}</span>
                  <div>
                    <p className="text-slate-300 text-sm font-medium">{name}</p>
                    <p className="text-slate-600 text-xs">{org}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Languages + Interests */}
          <div>
            <p className="text-indigo-400 font-mono text-sm mb-3 tracking-widest uppercase">
              // languages
            </p>
            <h2 className="text-2xl font-black mb-6">Languages</h2>
            <div className="space-y-5">
              {languages.map(({ lang, level, pct }) => (
                <div key={lang}>
                  <div className="flex justify-between mb-1.5 text-sm">
                    <span className="font-semibold text-white">{lang}</span>
                    <span className="text-slate-500">{level}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: "linear-gradient(90deg, #6366f1, #c084fc)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <p className="text-indigo-400 font-mono text-sm mb-3 tracking-widest uppercase">
                // interests
              </p>
              <div className="flex gap-3 flex-wrap">
                {["🏃 Sport", "🎵 Music", "📚 Reading"].map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 rounded-full text-sm text-slate-300 border"
                    style={{ background: "rgba(255,255,255,0.04)", borderColor: "#2a2a4a" }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

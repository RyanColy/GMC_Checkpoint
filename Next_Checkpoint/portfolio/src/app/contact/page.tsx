"use client";

import { useState, FormEvent } from "react";

const contactInfo = [
  {
    icon: "✉️",
    label: "Email",
    value: "ryan.coly999@gmail.com",
    href: "mailto:ryan.coly999@gmail.com",
  },
  {
    icon: "📞",
    label: "Phone",
    value: "77 423 30 10",
    href: "tel:+221774233010",
  },
  {
    icon: "📍",
    label: "Location",
    value: "Dakar, HLM Grand Yoff — Senegal",
    href: null,
  },
  {
    icon: "🐙",
    label: "GitHub",
    value: "github.com/ryancoly999",
    href: "https://github.com/ryancoly999",
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="relative overflow-hidden">
      <div
        className="glow-orb"
        style={{ width: 500, height: 500, background: "#c084fc", bottom: -100, left: -150 }}
      />

      <div className="relative max-w-5xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="mb-16">
          <p className="text-indigo-400 font-mono text-sm mb-3 tracking-widest uppercase">
            // get_in_touch
          </p>
          <h1 className="text-5xl font-black mb-4">
            Let&apos;s <span className="gradient-text">Connect</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl">
            Have a project in mind or want to collaborate? I&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_380px] gap-10">
          {/* Form */}
          <div
            className="rounded-2xl p-8 border"
            style={{ background: "rgba(13,13,31,0.9)", borderColor: "#1e1e3a" }}
          >
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-6"
                  style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.4)" }}
                >
                  ✓
                </div>
                <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
                <p className="text-slate-400 mb-8">
                  Thanks for reaching out. I&apos;ll get back to you shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", message: "" });
                  }}
                  className="focus-ring px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className="focus-ring w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 border transition-colors focus:border-indigo-500 outline-none"
                      style={{ background: "rgba(255,255,255,0.04)", borderColor: "#2a2a4a" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      className="focus-ring w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 border transition-colors focus:border-indigo-500 outline-none"
                      style={{ background: "rgba(255,255,255,0.04)", borderColor: "#2a2a4a" }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about your project or just say hi..."
                    className="focus-ring w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 border transition-colors focus:border-indigo-500 outline-none resize-none"
                    style={{ background: "rgba(255,255,255,0.04)", borderColor: "#2a2a4a" }}
                  />
                </div>
                <button
                  type="submit"
                  className="focus-ring flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                >
                  Send Message
                  <span>→</span>
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-4">
            {contactInfo.map(({ icon, label, value, href }) => (
              <div
                key={label}
                className="gradient-border card-hover rounded-xl p-5 border"
                style={{ background: "rgba(13,13,31,0.9)", borderColor: "#1e1e3a" }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-0.5">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 font-medium text-sm transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-white font-medium text-sm">{value}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Response time note */}
            <div
              className="rounded-xl p-5 border mt-2"
              style={{
                background: "rgba(99, 102, 241, 0.08)",
                borderColor: "rgba(99, 102, 241, 0.25)",
              }}
            >
              <p className="text-indigo-300 text-sm font-medium mb-1">⚡ Quick Response</p>
              <p className="text-slate-400 text-sm">
                I typically respond within 24 hours. Looking forward to connecting!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

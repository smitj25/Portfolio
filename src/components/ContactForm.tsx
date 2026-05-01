"use client";

import { useState } from "react";

type Intent = "job" | "freelance" | "network";

const intentTabs = [
  { id: "job" as Intent, label: "Discuss an Opportunity" },
  { id: "freelance" as Intent, label: "Propose a Project" },
  { id: "network" as Intent, label: "Say Hello" },
];

const intentConfig: Record<
  Intent,
  { showCompany: boolean; companyLabel: string; messagePlaceholder: string }
> = {
  job: {
    showCompany: true,
    companyLabel: "Company",
    messagePlaceholder:
      "Tell me about the role, team, and what you're looking for...",
  },
  freelance: {
    showCompany: true,
    companyLabel: "Company / Project",
    messagePlaceholder:
      "What are we building? Any timeline or budget in mind?",
  },
  network: {
    showCompany: false,
    companyLabel: "",
    messagePlaceholder:
      "What's on your mind? I'd love to hear from you...",
  },
};

const projectDomains = [
  "AI / ML",
  "Automation",
  "Data Science",
  "Web Development",
  "Gen AI",
  "Other",
];

export default function ContactForm() {
  const [intent, setIntent] = useState<Intent>("job");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const config = intentConfig[intent];

  const toggleDomain = (domain: string) => {
    setSelectedDomains((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, intent, domains: intent === "freelance" ? selectedDomains : [] }),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", company: "", message: "" });
        setSelectedDomains([]);
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="w-full max-w-4xl lg:max-w-5xl md:h-[560px] rounded-2xl md:rounded-[2rem] border border-white/[0.05] bg-[#0a0a0a]/30 backdrop-blur-[24px] p-5 sm:p-8 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-white transition-all duration-500 hover:border-white/[0.1] relative overflow-hidden flex flex-col">

      <div className="relative z-10 flex-1 flex flex-col min-h-0">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black mb-4 sm:mb-6 tracking-tighter">
          Let&apos;s Connect.
        </h2>

        {/* ───── Intent Tabs (Pills) ───── */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5 sm:mb-8">
          {intentTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setIntent(tab.id)}
              className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                intent === tab.id
                  ? "bg-[#fa6c2a] text-white shadow-[0_0_20px_rgba(250,108,42,0.35)] border border-[#fa6c2a]"
                  : "bg-white/[0.03] border border-white/[0.08] text-gray-400 hover:border-white/[0.2] hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ───── Contextual Form ───── */}
        <form
          className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 lg:gap-12"
          onSubmit={handleSubmit}
        >
          {/* Left Column: Input Fields */}
          <div className="flex flex-col space-y-4 sm:space-y-5">
            <div>
              <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-widest mb-1.5 sm:mb-2 text-gray-400">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full bg-black/40 border border-white/[0.06] rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#fa6c2a] focus:border-[#fa6c2a] transition-all text-gray-100 placeholder:text-gray-600"
              />
            </div>

            <div>
              <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-widest mb-1.5 sm:mb-2 text-gray-400">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
                className="w-full bg-black/40 border border-white/[0.06] rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#fa6c2a] focus:border-[#fa6c2a] transition-all text-gray-100 placeholder:text-gray-600"
              />
            </div>

            {config.showCompany && (
              <div>
                <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-widest mb-1.5 sm:mb-2 text-gray-400">
                  {config.companyLabel}
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Acme Corp"
                  className="w-full bg-black/40 border border-white/[0.06] rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#fa6c2a] focus:border-[#fa6c2a] transition-all text-gray-100 placeholder:text-gray-600"
                />
              </div>
            )}
          </div>

          {/* Right Column: Message & Submit */}
          <div className="flex flex-col space-y-4 sm:space-y-5">
            {intent === "freelance" && (
              <div>
                <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-widest mb-2 sm:mb-3 text-gray-400">
                  Project Domain
                </label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {projectDomains.map((domain) => (
                    <button
                      key={domain}
                      type="button"
                      onClick={() => toggleDomain(domain)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-medium transition-all duration-300 ${
                        selectedDomains.includes(domain)
                          ? "bg-[#fa6c2a] text-white shadow-[0_0_15px_rgba(250,108,42,0.4)] border border-[#fa6c2a]"
                          : "bg-white/[0.03] border border-white/[0.08] text-gray-400 hover:border-white/[0.2] hover:text-white hover:bg-white/[0.05]"
                      }`}
                    >
                      {domain}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex-grow flex flex-col">
              <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-widest mb-1.5 sm:mb-2 text-gray-400">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={3}
                placeholder={config.messagePlaceholder}
                className="w-full flex-grow bg-black/40 border border-white/[0.06] rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#fa6c2a] focus:border-[#fa6c2a] transition-all resize-none text-gray-100 placeholder:text-gray-600 min-h-[80px] md:min-h-0"
              ></textarea>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className={`w-full font-bold py-3 sm:py-4 rounded-xl transition-all duration-300 shadow-lg text-[10px] sm:text-xs uppercase tracking-widest ${
                  status === "success"
                    ? "bg-green-500 text-white"
                    : status === "error"
                    ? "bg-red-500 text-white"
                    : "bg-white text-black hover:bg-[#fa6c2a] hover:text-white"
                }`}
              >
                {status === "loading"
                  ? "Sending..."
                  : status === "success"
                  ? "Message Sent!"
                  : status === "error"
                  ? "Error — Try Again"
                  : "Send Message"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


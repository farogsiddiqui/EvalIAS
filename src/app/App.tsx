import { useState, useRef } from "react";
import {
  Upload, FileText, CheckCircle, Download, LogOut, Menu, X,
  Star, ChevronRight, Shield, Clock, Award, BookOpen, Users,
  MessageSquare, Bell, CreditCard, Home, BarChart2, Phone,
  Mail, MapPin, ArrowRight, Check, AlertCircle, Eye, Loader,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

type Page =
  | "home" | "about" | "pricing" | "contact" | "refund" | "sample"
  | "login" | "register"
  | "dashboard-upload" | "dashboard-submissions" | "dashboard-evaluated"
  | "dashboard-subscription" | "dashboard-mentorship";

interface User { name: string; email: string; plan: string; answersLeft: number }

interface Submission {
  id: string; date: string; subject: string; paper: string;
  status: "Pending" | "Under Review" | "Evaluated"; score?: string; file: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_SUBMISSIONS: Submission[] = [
  { id: "SUB001", date: "12 Oct 2024", subject: "General Studies I", paper: "GS1 – World History", status: "Evaluated", score: "118/150", file: "gs1_worldhistory.pdf" },
  { id: "SUB002", date: "18 Oct 2024", subject: "General Studies III", paper: "GS3 – Indian Economy", status: "Under Review", file: "gs3_economy.pdf" },
  { id: "SUB003", date: "20 Oct 2024", subject: "Essay", paper: "Essay Paper – Topic 2", status: "Pending", file: "essay_paper.pdf" },
  { id: "SUB004", date: "05 Oct 2024", subject: "General Studies IV", paper: "GS4 – Ethics Case Study", status: "Evaluated", score: "107/150", file: "gs4_ethics.pdf" },
  { id: "SUB005", date: "01 Oct 2024", subject: "General Studies II", paper: "GS2 – Polity & Governance", status: "Evaluated", score: "125/150", file: "gs2_polity.pdf" },
];

const EVALUATORS = [
  { name: "Dr. Rajiv Sharma", rank: "IAS 2019 · AIR 12", spec: "GS Paper I, II & Essay", img: "https://images.unsplash.com/photo-1758336011136-343678e4fc05?w=400&h=400&fit=crop&auto=format", exp: "4+ years evaluating" },
  { name: "Ms. Priya Nair", rank: "IAS 2020 · AIR 8", spec: "Essay & Ethics (GS4)", img: "https://images.unsplash.com/photo-1528082414335-adbd64f18d12?w=400&h=400&fit=crop&auto=format", exp: "3+ years evaluating" },
  { name: "Mr. Aditya Verma", rank: "IPS 2018 · AIR 34", spec: "GS II, III & Current Affairs", img: "https://images.unsplash.com/photo-1601655781320-205e34c94eb1?w=400&h=400&fit=crop&auto=format", exp: "5+ years evaluating" },
  { name: "Ms. Meera Krishnan", rank: "IFoS 2021 · AIR 15", spec: "Geography Optional & GS I", img: "https://images.unsplash.com/photo-1756699198754-d57cdf33278f?w=400&h=400&fit=crop&auto=format", exp: "2+ years evaluating" },
];

const PLANS = [
  {
    name: "Starter", price: "₹499", period: "/month", highlight: false,
    desc: "For aspirants just beginning their answer-writing journey.",
    features: ["2 answers evaluated/month", "Detailed written feedback", "Score with justification", "PDF delivery in 5 days", "Email support"],
    excluded: ["Priority evaluation", "Mentorship sessions", "Model answer access"],
  },
  {
    name: "Scholar", price: "₹1,499", period: "/month", highlight: true,
    desc: "Our most popular plan for serious Mains aspirants.",
    features: ["8 answers evaluated/month", "Detailed written feedback", "Score with justification", "PDF delivery in 3 days", "Priority evaluation", "Model answer access"],
    excluded: ["Mentorship sessions"],
  },
  {
    name: "Topper", price: "₹3,999", period: "/month", highlight: false,
    desc: "Full-service preparation with personal mentorship.",
    features: ["25 answers evaluated/month", "Detailed written feedback", "Score with justification", "PDF delivery in 48 hours", "Priority evaluation", "Model answer access", "2 mentorship sessions/month"],
    excluded: [],
  },
];

const TESTIMONIALS = [
  { name: "Ananya Dubey", rank: "IAS 2023 · AIR 47", text: "EvalIAS changed how I approach answer-writing. The feedback from actual rank-holders showed me exactly where I was losing marks. My GS scores jumped by 40 marks in the final exam.", avatar: "AD" },
  { name: "Karthik Sundaram", rank: "IAS 2023 · AIR 89", text: "The turnaround is fast and the feedback is genuinely insightful — not generic templates. The evaluators clearly understand the examiner's mindset.", avatar: "KS" },
  { name: "Preethi Rajan", rank: "Cleared Prelims 2024", text: "As someone preparing for my third attempt, EvalIAS helped me identify structural problems in my answers that I had missed entirely. Worth every rupee.", avatar: "PR" },
];

// ─── Utility ─────────────────────────────────────────────────────────────────

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar({ page, setPage, isLoggedIn, setLoggedIn }: {
  page: Page; setPage: (p: Page) => void; isLoggedIn: boolean; setLoggedIn: (v: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const navLinks: { label: string; target: Page }[] = [
    { label: "Home", target: "home" },
    { label: "About", target: "about" },
    { label: "Evaluators", target: "sample" },
    { label: "Pricing", target: "pricing" },
    { label: "Contact", target: "contact" },
  ];
  return (
    <header className="sticky top-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button onClick={() => setPage("home")} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-accent rounded flex items-center justify-center shrink-0">
            <BookOpen size={16} className="text-primary" strokeWidth={2.5} />
          </div>
          <span className="font-display text-xl font-semibold text-primary-foreground tracking-tight">
            Eval<span className="text-accent">IAS</span>
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(({ label, target }) => (
            <button
              key={target}
              onClick={() => setPage(target)}
              className={cn(
                "text-sm font-medium transition-colors",
                page === target ? "text-accent" : "text-primary-foreground/70 hover:text-primary-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <button
                onClick={() => setPage("dashboard-submissions")}
                className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => { setLoggedIn(false); setPage("home"); }}
                className="flex items-center gap-1.5 text-sm text-primary-foreground/60 hover:text-primary-foreground/90 transition-colors"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setPage("login")} className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Log In
              </button>
              <button
                onClick={() => setPage("register")}
                className="bg-accent text-accent-foreground text-sm font-semibold px-4 py-2 rounded hover:bg-accent/90 transition-colors"
              >
                Get Started
              </button>
            </>
          )}
        </div>

        <button className="md:hidden text-primary-foreground/80" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-primary border-t border-white/10 px-4 pb-4 pt-2 flex flex-col gap-3">
          {navLinks.map(({ label, target }) => (
            <button key={target} onClick={() => { setPage(target); setOpen(false); }}
              className="text-left text-sm text-primary-foreground/80 hover:text-primary-foreground py-1.5">
              {label}
            </button>
          ))}
          <div className="border-t border-white/10 pt-3 flex gap-3">
            {isLoggedIn ? (
              <button onClick={() => { setLoggedIn(false); setPage("home"); setOpen(false); }}
                className="text-sm text-primary-foreground/60">Sign Out</button>
            ) : (
              <>
                <button onClick={() => { setPage("login"); setOpen(false); }}
                  className="text-sm text-primary-foreground/80">Log In</button>
                <button onClick={() => { setPage("register"); setOpen(false); }}
                  className="bg-accent text-accent-foreground text-sm font-semibold px-4 py-2 rounded">
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <footer className="bg-foreground text-primary-foreground mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-accent rounded flex items-center justify-center">
              <BookOpen size={14} className="text-primary" strokeWidth={2.5} />
            </div>
            <span className="font-display text-lg font-semibold">Eval<span className="text-accent">IAS</span></span>
          </div>
          <p className="text-sm text-primary-foreground/60 leading-relaxed">
            Expert UPSC CSE Mains answer evaluation by rank-holders. Precise feedback, faster progress.
          </p>
        </div>
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-primary-foreground/40 mb-4">Platform</p>
          {(["home","about","pricing","sample","contact"] as Page[]).map((p) => (
            <button key={p} onClick={() => setPage(p)}
              className="block text-sm text-primary-foreground/60 hover:text-primary-foreground mb-2 capitalize transition-colors">
              {p === "sample" ? "Evaluators" : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-primary-foreground/40 mb-4">Legal</p>
          {(["refund","contact"] as Page[]).map((p, i) => (
            <button key={p} onClick={() => setPage(p)}
              className="block text-sm text-primary-foreground/60 hover:text-primary-foreground mb-2 transition-colors">
              {["Refund Policy","Terms & Contact"][i]}
            </button>
          ))}
          <p className="text-sm text-primary-foreground/60 mb-2">Privacy Policy</p>
        </div>
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-primary-foreground/40 mb-4">Contact</p>
          <div className="space-y-2.5 text-sm text-primary-foreground/60">
            <p className="flex items-center gap-2"><Mail size={13} />support@evalias.in</p>
            <p className="flex items-center gap-2"><Phone size={13} />+91 98765 43210</p>
            <p className="flex items-center gap-2"><MapPin size={13} />New Delhi, India</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 px-4 text-center text-xs text-primary-foreground/30">
        © 2024 EvalIAS. All rights reserved. EvalIAS is not affiliated with UPSC or the Government of India.
      </div>
    </footer>
  );
}

// ─── HOME PAGE ───────────────────────────────────────────────────────────────

function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div>
      {/* Hero */}
      <section className="bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 39px,#fff 39px,#fff 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,#fff 39px,#fff 40px)" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center relative">
          <div>
            <div className="inline-flex items-center gap-2 bg-accent/15 text-accent text-xs font-mono uppercase tracking-widest px-3 py-1.5 rounded mb-6">
              <Star size={11} fill="currentColor" /> Trusted by 3,200+ UPSC Aspirants
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-primary-foreground leading-[1.2] mb-6">
              Your UPSC Mains Answers,<br />
              <span className="text-accent italic">Evaluated by Rank-Holders</span>
            </h1>
            <p className="text-primary-foreground/70 text-lg leading-relaxed mb-8 max-w-lg">
              Upload your handwritten answer sheets. Get them reviewed by IAS, IPS & IFoS officers who know exactly what the examiner expects — with scores, detailed feedback, and model comparisons.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setPage("register")}
                className="bg-accent text-accent-foreground font-semibold px-6 py-3 rounded hover:bg-accent/90 transition-colors flex items-center gap-2">
                Start Evaluation <ArrowRight size={16} />
              </button>
              <button onClick={() => setPage("sample")}
                className="border border-white/20 text-primary-foreground/80 font-medium px-6 py-3 rounded hover:bg-white/5 transition-colors">
                View Sample Evaluation
              </button>
            </div>
            <div className="flex gap-6 mt-10">
              {[["3,200+","Students"], ["48 hrs","Avg. Delivery"], ["4.9/5","Rating"]].map(([val, lbl]) => (
                <div key={lbl}>
                  <p className="font-display text-2xl font-semibold text-accent">{val}</p>
                  <p className="text-xs text-primary-foreground/50 mt-0.5">{lbl}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-2xl" />
            <img
              src="https://images.unsplash.com/photo-1656266724419-333cd2502487?w=600&h=500&fit=crop&auto=format"
              alt="UPSC study books stacked on desk"
              className="rounded-2xl w-full object-cover h-80 mix-blend-luminosity opacity-60"
            />
            <div className="absolute bottom-6 left-6 right-6 bg-primary/90 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-muted shrink-0">
                  <img src="https://images.unsplash.com/photo-1758336011136-343678e4fc05?w=80&h=80&fit=crop&auto=format" alt="Evaluator" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary-foreground">Dr. Rajiv Sharma · IAS AIR 12</p>
                  <p className="text-xs text-primary-foreground/60">"Strong structure, but your intro needs a clearer thesis. See annotations on page 2."</p>
                </div>
                <div className="ml-auto bg-accent text-accent-foreground text-sm font-mono font-bold px-2.5 py-1 rounded">118/150</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-secondary border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-wrap justify-center gap-x-10 gap-y-3">
          {[
            [Shield, "Secure document handling"],
            [Clock, "48-hour evaluation turnaround"],
            [Award, "Evaluated by IAS/IPS officers"],
            [CheckCircle, "Detailed, structured feedback"],
          ].map(([Icon, text]) => (
            <div key={text as string} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon size={15} className="text-accent" />
              <span>{text as string}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-mono uppercase tracking-widest text-accent mb-3">Simple Process</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">How EvalIAS Works</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: "01", icon: Users, title: "Register & Subscribe", desc: "Create your account and choose a plan that matches your preparation intensity. Instant access after payment." },
            { step: "02", icon: Upload, title: "Upload Answer Sheets", desc: "Scan or photograph your handwritten answers and upload them through your secure student portal. Select subject and paper." },
            { step: "03", icon: FileText, title: "Receive Expert Feedback", desc: "A rank-holder evaluator reviews your answers, annotates the PDF, assigns a score, and uploads it back to your portal." },
          ].map(({ step, icon: Icon, title, desc }) => (
            <div key={step} className="bg-card border border-border rounded-xl p-7 relative group hover:shadow-md transition-shadow">
              <div className="absolute top-5 right-5 font-mono text-4xl font-bold text-border/80 select-none">{step}</div>
              <div className="w-11 h-11 bg-primary/10 rounded-lg flex items-center justify-center mb-5">
                <Icon size={20} className="text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Evaluators Preview */}
      <section className="py-20 bg-secondary px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-accent mb-3">Our Evaluators</p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold">Learn from Those Who've Cracked It</h2>
            </div>
            <button onClick={() => setPage("sample")} className="text-sm font-medium text-accent flex items-center gap-1 hover:gap-2 transition-all">
              View all evaluators <ChevronRight size={15} />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {EVALUATORS.map((ev) => (
              <div key={ev.name} className="bg-card border border-border rounded-xl overflow-hidden group hover:shadow-md transition-shadow">
                <div className="h-52 bg-muted overflow-hidden">
                  <img src={ev.img} alt={ev.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h4 className="font-display font-semibold text-base">{ev.name}</h4>
                  <p className="text-xs font-mono text-accent mt-0.5 mb-2">{ev.rank}</p>
                  <p className="text-xs text-muted-foreground">{ev.spec}</p>
                  <div className="mt-3 pt-3 border-t border-border flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Award size={11} className="text-accent" />{ev.exp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Evaluation Preview */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto bg-primary rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-10 flex flex-col justify-center">
              <p className="text-xs font-mono uppercase tracking-widest text-accent mb-4">Sample Evaluation</p>
              <h2 className="font-display text-3xl font-semibold text-primary-foreground mb-4">
                See What Feedback Looks Like
              </h2>
              <p className="text-primary-foreground/65 text-sm leading-relaxed mb-6">
                Every evaluated copy comes with a score breakdown, in-line annotations on your answer PDF, a model answer extract, and personalized improvement notes.
              </p>
              <div className="space-y-3 mb-8">
                {["Score: 118/150 with per-question breakdown", "Inline PDF annotations by evaluator", "Model answer comparison", "3 priority improvement areas"].map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-sm text-primary-foreground/80">
                    <CheckCircle size={15} className="text-accent mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setPage("sample")} className="self-start bg-accent text-accent-foreground font-semibold px-5 py-2.5 rounded hover:bg-accent/90 transition-colors text-sm">
                View Sample Evaluation
              </button>
            </div>
            <div className="bg-[#15294a] p-8 flex items-center justify-center">
              <div className="bg-card rounded-xl w-full max-w-xs shadow-2xl overflow-hidden">
                <div className="bg-muted px-4 py-3 flex items-center justify-between border-b border-border">
                  <span className="text-xs font-mono text-muted-foreground">GS1_Evaluation_SUB001.pdf</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">Evaluated</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Overall Score</span>
                    <span className="font-mono font-bold text-accent text-lg">118/150</span>
                  </div>
                  {[["Introduction", "7/10"],["Content & Analysis","38/50"],["Examples & Data","16/20"],["Structure & Flow","18/20"],["Conclusion","9/10"]].map(([k,v]) => (
                    <div key={k} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="font-mono font-medium">{v}</span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-3">
                    <p className="text-xs text-muted-foreground mb-1 font-medium">Evaluator Note</p>
                    <p className="text-xs text-foreground/80 italic leading-relaxed">"Strong analytical depth. Introduce a clearer thesis in the opening para. See annotations on pp. 2–3."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-secondary px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-mono uppercase tracking-widest text-accent mb-3">Student Outcomes</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">What Our Achievers Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-card border border-border rounded-xl p-7">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} className="text-accent" fill="currentColor" />)}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs font-mono text-accent">{t.rank}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">Start Improving Your Answers Today</h2>
          <p className="text-muted-foreground mb-8">Join thousands of aspirants who have improved their Mains scores with expert evaluation. Plans start at just ₹499/month.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => setPage("register")} className="bg-primary text-primary-foreground font-semibold px-7 py-3 rounded hover:bg-primary/90 transition-colors flex items-center gap-2">
              Create Free Account <ArrowRight size={16} />
            </button>
            <button onClick={() => setPage("pricing")} className="border border-border text-foreground font-medium px-7 py-3 rounded hover:bg-muted transition-colors">
              View Pricing
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── ABOUT PAGE ──────────────────────────────────────────────────────────────

function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-12">
        <p className="text-xs font-mono uppercase tracking-widest text-accent mb-3">About EvalIAS</p>
        <h1 className="font-display text-4xl font-semibold mb-5">Built by Rank-Holders, for Rank-Seekers</h1>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-4 text-foreground/75 leading-relaxed text-[15px]">
            <p>EvalIAS was founded in 2022 by a group of IAS and IPS officers who cleared UPSC CSE in their first attempt. Having seen thousands of aspirants struggle not with knowledge, but with the art of answer-writing, they decided to bridge the gap.</p>
            <p>The UPSC Mains is not just about what you know — it is about how you present what you know. A well-structured, cogent answer with relevant data, a balanced conclusion, and examiner-aware formatting can mean the difference between selection and another year of preparation.</p>
            <p>We built EvalIAS to make expert evaluation accessible, fast, and deeply personal. Every evaluation is done by a verified rank-holder, not a coaching center instructor. Every feedback note is tailored to your specific answer, not a template.</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-7 space-y-5">
            {[
              ["2022", "Founded by IAS officers"],
              ["3,200+", "Students evaluated"],
              ["28,000+", "Answers reviewed"],
              ["4.9/5", "Average student rating"],
              ["12", "Active rank-holder evaluators"],
            ].map(([num, lbl]) => (
              <div key={lbl} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                <span className="text-sm text-muted-foreground">{lbl}</span>
                <span className="font-display text-xl font-semibold text-accent">{num}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="font-display text-2xl font-semibold mb-8">Our Values</h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { icon: Award, title: "Authenticity", desc: "Every evaluator is a verified civil servant. No proxies, no coaching centre instructors." },
            { icon: Shield, title: "Confidentiality", desc: "Your answer sheets are private. We use encrypted storage and do not share your data." },
            { icon: MessageSquare, title: "Honest Feedback", desc: "We tell you what the examiner will penalise, not just what you did right. Growth requires truth." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-secondary rounded-xl p-6">
              <Icon size={20} className="text-accent mb-4" />
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-display text-2xl font-semibold mb-8">Our Evaluators</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {EVALUATORS.map((ev) => (
            <div key={ev.name} className="bg-card border border-border rounded-xl flex gap-4 p-5">
              <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden shrink-0">
                <img src={ev.img} alt={ev.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-semibold">{ev.name}</h4>
                <p className="text-xs font-mono text-accent mb-1">{ev.rank}</p>
                <p className="text-xs text-muted-foreground">{ev.spec} · {ev.exp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PRICING PAGE ─────────────────────────────────────────────────────────────

function PricingPage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-14">
        <p className="text-xs font-mono uppercase tracking-widest text-accent mb-3">Transparent Pricing</p>
        <h1 className="font-display text-4xl font-semibold mb-4">Choose Your Evaluation Plan</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">All plans include PDF delivery of evaluated copies, score justification, and detailed written feedback. Cancel anytime.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6 items-stretch">
        {PLANS.map((plan) => (
          <div key={plan.name} className={cn(
            "rounded-2xl border flex flex-col overflow-hidden",
            plan.highlight ? "border-accent shadow-xl shadow-accent/10 ring-2 ring-accent/30" : "border-border bg-card"
          )}>
            {plan.highlight && (
              <div className="bg-accent text-accent-foreground text-center text-xs font-semibold py-2 font-mono uppercase tracking-widest">
                Most Popular
              </div>
            )}
            <div className={cn("p-8 flex-1", plan.highlight ? "bg-card" : "")}>
              <h2 className="font-display text-2xl font-semibold mb-1">{plan.name}</h2>
              <p className="text-sm text-muted-foreground mb-6">{plan.desc}</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="font-display text-4xl font-semibold">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
              <div className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-start gap-2.5 text-sm">
                    <Check size={15} className="text-accent mt-0.5 shrink-0" /><span>{f}</span>
                  </div>
                ))}
                {plan.excluded.map((f) => (
                  <div key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <X size={15} className="mt-0.5 shrink-0" /><span>{f}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setPage("register")}
                className={cn(
                  "w-full font-semibold py-3 rounded transition-colors text-sm",
                  plan.highlight
                    ? "bg-accent text-accent-foreground hover:bg-accent/90"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                Get Started with {plan.name}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 bg-secondary rounded-xl p-7 grid md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-semibold mb-2">All Plans Include</h3>
          <ul className="text-sm text-muted-foreground space-y-1.5">
            {["Annotated PDF evaluation","Score with question-wise breakdown","Evaluator's personal note","Secure portal access"].map(i => (
              <li key={i} className="flex items-center gap-2"><CheckCircle size={13} className="text-accent" />{i}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Payment & Billing</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">Payments via UPI, card, net banking, or wallet. Billed monthly. Unused evaluations do not carry forward.</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Questions?</h3>
          <p className="text-sm text-muted-foreground mb-3">Not sure which plan is right for you?</p>
          <button className="text-sm text-accent font-medium flex items-center gap-1 hover:gap-2 transition-all">
            Talk to us <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-12">
        <p className="text-xs font-mono uppercase tracking-widest text-accent mb-3">Get In Touch</p>
        <h1 className="font-display text-4xl font-semibold">Contact EvalIAS</h1>
      </div>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <div className="space-y-6 mb-10">
            {[
              { icon: Mail, label: "Email", val: "support@evalias.in" },
              { icon: Phone, label: "Phone", val: "+91 98765 43210 (10am – 6pm, Mon–Sat)" },
              { icon: MapPin, label: "Address", val: "42, Jangpura Extension, New Delhi – 110014" },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="flex gap-3">
                <div className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                  <p className="text-sm font-medium">{val}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-secondary rounded-xl p-5 text-sm">
            <p className="font-semibold mb-1">Response Time</p>
            <p className="text-muted-foreground">We typically respond to queries within 4 business hours. For urgent issues, please call us directly.</p>
          </div>
        </div>
        {!sent ? (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name</label>
                <input type="text" required placeholder="Priya Sharma" className="w-full bg-input-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input type="email" required placeholder="you@example.com" className="w-full bg-input-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Subject</label>
              <select className="w-full bg-input-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Subscription & Billing</option>
                <option>Evaluation Query</option>
                <option>Technical Issue</option>
                <option>Evaluator Application</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Message</label>
              <textarea required rows={5} placeholder="Describe your query in detail..." className="w-full bg-input-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            </div>
            <button type="submit" className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors">
              Send Message
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center bg-card border border-border rounded-2xl p-12 text-center">
            <CheckCircle size={40} className="text-accent mb-4" />
            <h3 className="font-display text-xl font-semibold mb-2">Message Sent</h3>
            <p className="text-muted-foreground text-sm">We will get back to you within 4 business hours.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── REFUND POLICY PAGE ───────────────────────────────────────────────────────

function RefundPage() {
  const sections = [
    { title: "Subscription Cancellation", body: "You may cancel your subscription at any time from your account dashboard. Cancellation takes effect at the end of the current billing period. You will continue to have access to evaluated copies uploaded during your active subscription." },
    { title: "Refund Eligibility", body: "Refunds are available within 7 days of initial subscription purchase if no evaluations have been requested. Once an evaluation has been submitted and accepted by an evaluator, refunds are not applicable for that evaluation cycle." },
    { title: "Evaluation Quality Disputes", body: "If you believe an evaluation was not completed in accordance with our quality standards — for example, if feedback is absent or the score appears to have no justification — you may raise a dispute within 10 days of receiving the evaluated copy. We will assign a second evaluator to review at no additional cost." },
    { title: "Non-Refundable Circumstances", body: "Refunds are not provided for: (i) change of mind after submission, (ii) delays caused by student's failure to upload answer sheets in the required format, (iii) expired evaluation slots due to subscription end without uploading." },
    { title: "Processing Time", body: "Approved refunds are processed within 7–10 business days to the original payment method. UPI refunds are typically faster. We do not charge a refund processing fee." },
    { title: "Contact for Refunds", body: "To initiate a refund or dispute, email us at refunds@evalias.in with your registered email address, order ID, and reason. Our support team will respond within 1 business day." },
  ];
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <p className="text-xs font-mono uppercase tracking-widest text-accent mb-3">Legal</p>
      <h1 className="font-display text-4xl font-semibold mb-3">Refund Policy</h1>
      <p className="text-muted-foreground text-sm mb-10">Last updated: 1 October 2024</p>
      <div className="space-y-8">
        {sections.map(({ title, body }) => (
          <div key={title} className="border-b border-border pb-8 last:border-0">
            <h2 className="font-display text-lg font-semibold mb-3">{title}</h2>
            <p className="text-[15px] text-foreground/75 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SAMPLE EVALUATIONS PAGE ──────────────────────────────────────────────────

function SamplePage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-12">
        <p className="text-xs font-mono uppercase tracking-widest text-accent mb-3">Meet the Evaluators</p>
        <h1 className="font-display text-4xl font-semibold mb-4">Evaluated by Those Who've Been There</h1>
        <p className="text-muted-foreground max-w-xl">Every evaluation is done by a verified civil servant — IAS, IPS, or IFoS officer — who has appeared in UPSC CSE Mains and scored well above the cutoff.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-16">
        {EVALUATORS.map((ev) => (
          <div key={ev.name} className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col sm:flex-row gap-0">
            <div className="sm:w-40 h-48 sm:h-auto bg-muted overflow-hidden shrink-0">
              <img src={ev.img} alt={ev.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 flex flex-col justify-center">
              <h3 className="font-display text-xl font-semibold mb-1">{ev.name}</h3>
              <p className="text-xs font-mono text-accent mb-3">{ev.rank}</p>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">Specialises in: <span className="text-foreground">{ev.spec}</span></p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Award size={12} className="text-accent" />{ev.exp}
                <span className="mx-2 text-border">|</span>
                <Star size={12} className="text-accent" fill="currentColor" /> 4.9 / 5 rating
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sample Evaluation Detail */}
      <div className="mb-16">
        <h2 className="font-display text-2xl font-semibold mb-8">Sample Evaluated Answer</h2>
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="bg-secondary px-6 py-4 border-b border-border flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">GS Paper I · World History</p>
              <p className="font-semibold">Q. "The end of the Cold War did not bring stability — it brought complexity." Discuss.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded font-medium">Evaluated</span>
              <span className="font-mono font-bold text-accent text-lg">47/50</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="p-6">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">Score Breakdown</p>
              <div className="space-y-3">
                {[["Introduction","9/10"],["Content Depth","18/20"],["Examples Used","9/10"],["Conclusion","8/10"],["Structure","3/0"]].map(([k,v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-mono font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">Evaluator Feedback</p>
              <div className="space-y-3 text-sm">
                <div className="flex gap-2.5"><CheckCircle size={14} className="text-green-600 mt-0.5 shrink-0" /><span>Excellent use of Yugoslav Wars and Rwanda genocide as examples of post-Cold War instability.</span></div>
                <div className="flex gap-2.5"><CheckCircle size={14} className="text-green-600 mt-0.5 shrink-0" /><span>Clear thesis statement in the introduction — examiner will appreciate the directness.</span></div>
                <div className="flex gap-2.5"><AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" /><span>The conclusion is slightly rushed. Spend 3–4 lines on India's foreign policy adaptation post-1991.</span></div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">Priority Improvements</p>
              <ol className="space-y-3 text-sm list-decimal list-inside text-foreground/80">
                <li className="leading-relaxed">Include at least one multilateral angle (BRICS emergence, WTO disputes) to show systemic complexity.</li>
                <li className="leading-relaxed">Practice ending with a forward-looking India-specific conclusion — examiners reward this.</li>
                <li className="leading-relaxed">Your handwriting in para 3 becomes hurried — maintain legibility throughout under timed conditions.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center bg-primary rounded-2xl py-14 px-6">
        <h2 className="font-display text-2xl font-semibold text-primary-foreground mb-3">Ready to Get Your Answers Evaluated?</h2>
        <p className="text-primary-foreground/65 mb-7 text-sm">Plans start at ₹499/month. No long-term commitment required.</p>
        <button onClick={() => setPage("register")} className="bg-accent text-accent-foreground font-semibold px-8 py-3 rounded hover:bg-accent/90 transition-colors">
          Get Started Today
        </button>
      </div>
    </div>
  );
}

// ─── AUTH PAGES ───────────────────────────────────────────────────────────────

function LoginPage({ setPage, setLoggedIn, setUser }: {
  setPage: (p: Page) => void; setLoggedIn: (v: boolean) => void; setUser: (u: User) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setTimeout(() => {
      setUser({ name: "Ananya Dubey", email, plan: "Scholar", answersLeft: 5 });
      setLoggedIn(true); setPage("dashboard-submissions"); setLoading(false);
    }, 1000);
  };
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen size={18} className="text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-semibold">Eval<span className="text-accent">IAS</span></span>
          </div>
          <h1 className="font-display text-3xl font-semibold mb-1">Welcome back</h1>
          <p className="text-muted-foreground text-sm">Sign in to your student portal</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          {error && (
            <div className="mb-4 bg-destructive/10 text-destructive text-sm px-3 py-2.5 rounded-lg flex items-center gap-2">
              <AlertCircle size={14} />{error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full bg-input-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium">Password</label>
                <button type="button" className="text-xs text-accent hover:underline">Forgot password?</button>
              </div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full bg-input-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <><Loader size={15} className="animate-spin" /> Signing in…</> : "Sign In"}
            </button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            {"Don't have an account? "}
            <button onClick={() => setPage("register")} className="text-accent font-medium hover:underline">Create one free</button>
          </p>
        </div>
      </div>
    </div>
  );
}

function RegisterPage({ setPage, setLoggedIn, setUser }: {
  setPage: (p: Page) => void; setLoggedIn: (v: boolean) => void; setUser: (u: User) => void;
}) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const upd = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    setTimeout(() => {
      setUser({ name: form.name || "New Student", email: form.email, plan: "Free", answersLeft: 0 });
      setLoggedIn(true); setPage("dashboard-subscription"); setLoading(false);
    }, 1000);
  };
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen size={18} className="text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-semibold">Eval<span className="text-accent">IAS</span></span>
          </div>
          <h1 className="font-display text-3xl font-semibold mb-1">Create your account</h1>
          <p className="text-muted-foreground text-sm">Join 3,200+ aspirants improving their Mains answers</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Full Name</label>
              <input type="text" value={form.name} onChange={upd("name")} required placeholder="Ananya Dubey"
                className="w-full bg-input-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email Address</label>
              <input type="email" value={form.email} onChange={upd("email")} required placeholder="you@example.com"
                className="w-full bg-input-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Phone Number</label>
              <input type="tel" value={form.phone} onChange={upd("phone")} required placeholder="+91 98765 43210"
                className="w-full bg-input-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Create Password</label>
              <input type="password" value={form.password} onChange={upd("password")} required placeholder="Min. 8 characters"
                className="w-full bg-input-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 mt-2">
              {loading ? <><Loader size={15} className="animate-spin" /> Creating account…</> : "Create Account"}
            </button>
          </form>
          <p className="text-center text-xs text-muted-foreground mt-4">
            By registering you agree to our Terms of Service and Privacy Policy.
          </p>
          <p className="text-center text-sm text-muted-foreground mt-3">
            Already have an account?{" "}
            <button onClick={() => setPage("login")} className="text-accent font-medium hover:underline">Sign in</button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

const DASH_NAV: { label: string; icon: typeof Home; key: Page }[] = [
  { label: "My Submissions", icon: BarChart2, key: "dashboard-submissions" },
  { label: "Upload Answer", icon: Upload, key: "dashboard-upload" },
  { label: "Evaluated Copies", icon: FileText, key: "dashboard-evaluated" },
  { label: "Subscription", icon: CreditCard, key: "dashboard-subscription" },
  { label: "Mentorship", icon: MessageSquare, key: "dashboard-mentorship" },
];

function DashboardUpload({ user }: { user: User }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [subject, setSubject] = useState("General Studies I");
  const [paper, setPaper] = useState("");
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); if (!file) return;
    setUploading(true);
    setTimeout(() => { setUploading(false); setDone(true); }, 1500);
  };

  if (done) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <CheckCircle size={28} className="text-green-600" />
      </div>
      <h2 className="font-display text-2xl font-semibold mb-2">Answer Uploaded Successfully</h2>
      <p className="text-muted-foreground text-sm mb-1">Your answer sheet has been received and assigned to an evaluator.</p>
      <p className="text-muted-foreground text-sm mb-6">Expected evaluation delivery: <strong className="text-foreground">within 72 hours.</strong></p>
      <button onClick={() => { setDone(false); setFile(null); setPaper(""); }}
        className="bg-primary text-primary-foreground px-6 py-2.5 rounded font-semibold text-sm hover:bg-primary/90 transition-colors">
        Upload Another Answer
      </button>
    </div>
  );

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold">Upload Answer Sheet</h2>
          <p className="text-sm text-muted-foreground mt-1">Supported formats: PDF, JPG, PNG (max 30MB per file)</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Evaluations remaining</p>
          <p className="font-mono text-2xl font-bold text-accent">{user.answersLeft}</p>
        </div>
      </div>

      {user.answersLeft === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <AlertCircle size={24} className="text-amber-500 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">No evaluations remaining</h3>
          <p className="text-sm text-muted-foreground mb-4">You have used all your evaluations for this billing cycle. Upgrade or wait for renewal.</p>
          <button className="bg-accent text-accent-foreground font-semibold px-5 py-2.5 rounded text-sm hover:bg-accent/90 transition-colors">
            Upgrade Plan
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Subject / Paper</label>
              <select value={subject} onChange={e => setSubject(e.target.value)}
                className="w-full bg-input-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                {["General Studies I","General Studies II","General Studies III","General Studies IV","Essay","Optional Paper I","Optional Paper II"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Question / Topic Description</label>
              <input type="text" value={paper} onChange={e => setPaper(e.target.value)} placeholder="e.g. World History – Cold War"
                className="w-full bg-input-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Special Instructions for Evaluator (optional)</label>
            <textarea rows={2} placeholder="e.g. Focus on content structure, I tend to skip examples..."
              className="w-full bg-input-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Answer Sheet File</label>
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors",
                dragging ? "border-accent bg-accent/5" : file ? "border-green-400 bg-green-50" : "border-border hover:border-accent/50 hover:bg-accent/5"
              )}
            >
              <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
              {file ? (
                <div className="flex items-center justify-center gap-3 text-green-700">
                  <FileText size={20} />
                  <span className="font-medium text-sm">{file.name}</span>
                  <button type="button" onClick={e => { e.stopPropagation(); setFile(null); }}
                    className="text-muted-foreground hover:text-foreground ml-2"><X size={14} /></button>
                </div>
              ) : (
                <>
                  <Upload size={28} className="mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm font-medium mb-1">Drag & drop your file here</p>
                  <p className="text-xs text-muted-foreground">or click to browse — PDF, JPG, PNG up to 30MB</p>
                </>
              )}
            </div>
          </div>
          <button type="submit" disabled={!file || uploading}
            className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50">
            {uploading ? <><Loader size={15} className="animate-spin" />Uploading…</> : <><Upload size={15} />Submit for Evaluation</>}
          </button>
        </form>
      )}
    </div>
  );
}

function DashboardSubmissions() {
  const statusColor = (s: Submission["status"]) => s === "Evaluated" ? "bg-green-100 text-green-700" : s === "Under Review" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700";
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold mb-2">My Submissions</h2>
      <p className="text-sm text-muted-foreground mb-8">Track the status of all your submitted answer sheets.</p>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[["Total Submitted","5"], ["Under Review / Pending","2"], ["Evaluated","3"]].map(([l,v]) => (
          <div key={l} className="bg-card border border-border rounded-xl px-5 py-4">
            <p className="text-xs text-muted-foreground mb-1">{l}</p>
            <p className="font-display text-3xl font-semibold text-accent">{v}</p>
          </div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                {["ID","Date","Paper","Status","Score","Actions"].map(h => (
                  <th key={h} className="text-left text-xs font-mono uppercase tracking-wider text-muted-foreground px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_SUBMISSIONS.map(sub => (
                <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3.5 font-mono text-xs text-muted-foreground">{sub.id}</td>
                  <td className="px-4 py-3.5 text-sm">{sub.date}</td>
                  <td className="px-4 py-3.5 text-sm max-w-xs">
                    <p className="font-medium truncate">{sub.paper}</p>
                    <p className="text-xs text-muted-foreground">{sub.subject}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn("text-xs font-medium px-2.5 py-1 rounded", statusColor(sub.status))}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-sm font-semibold text-accent">
                    {sub.score ?? "—"}
                  </td>
                  <td className="px-4 py-3.5">
                    {sub.status === "Evaluated" ? (
                      <button className="flex items-center gap-1.5 text-xs text-primary font-medium hover:text-accent transition-colors">
                        <Download size={12} /> Download
                      </button>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Loader size={12} className={sub.status === "Under Review" ? "animate-spin" : ""} />
                        {sub.status === "Under Review" ? "In progress" : "Queued"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DashboardEvaluated() {
  const evaluated = MOCK_SUBMISSIONS.filter(s => s.status === "Evaluated");
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold mb-2">Evaluated Copies</h2>
      <p className="text-sm text-muted-foreground mb-8">Download your annotated answer sheets with evaluator feedback.</p>
      <div className="space-y-4">
        {evaluated.map(sub => (
          <div key={sub.id} className="bg-card border border-border rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
              <FileText size={18} className="text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{sub.paper}</p>
              <p className="text-xs text-muted-foreground">{sub.subject} · Evaluated on {sub.date} · {sub.file}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Score</p>
                <p className="font-mono font-bold text-accent">{sub.score}</p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-2 rounded hover:bg-primary/90 transition-colors">
                  <Download size={12} /> Download
                </button>
                <button className="flex items-center gap-1.5 border border-border text-xs font-medium px-3 py-2 rounded hover:bg-muted transition-colors">
                  <Eye size={12} /> Preview
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardSubscription({ user }: { user: User }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold mb-2">Subscription & Billing</h2>
      <p className="text-sm text-muted-foreground mb-8">Manage your plan, billing, and answer evaluation quota.</p>
      <div className="bg-card border border-border rounded-xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Current Plan</p>
          <p className="font-display text-2xl font-semibold">{user.plan}</p>
          <p className="text-sm text-muted-foreground mt-1">Next billing date: <strong className="text-foreground">1 November 2024</strong></p>
        </div>
        <div className="flex gap-3">
          <button className="border border-border text-sm font-medium px-4 py-2.5 rounded hover:bg-muted transition-colors">Cancel Plan</button>
          <button className="bg-accent text-accent-foreground text-sm font-semibold px-5 py-2.5 rounded hover:bg-accent/90 transition-colors">Upgrade Plan</button>
        </div>
      </div>
      <h3 className="font-semibold mb-4">Available Plans</h3>
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {PLANS.map(plan => (
          <div key={plan.name} className={cn("border rounded-xl p-5", plan.name === user.plan ? "border-accent bg-accent/5 ring-1 ring-accent/30" : "border-border bg-card")}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">{plan.name}</h4>
              {plan.name === user.plan && <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded font-medium">Current</span>}
            </div>
            <p className="font-display text-2xl font-semibold mb-1">{plan.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
            <p className="text-xs text-muted-foreground mb-4">{plan.features[0]}</p>
            {plan.name !== user.plan && (
              <button className="w-full border border-border text-sm font-medium py-2 rounded hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                Switch to {plan.name}
              </button>
            )}
          </div>
        ))}
      </div>
      <div>
        <h3 className="font-semibold mb-4">Billing History</h3>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                {["Date","Plan","Amount","Status"].map(h => (
                  <th key={h} className="text-left text-xs font-mono uppercase tracking-wider text-muted-foreground px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[["1 Oct 2024","Scholar","₹1,499","Paid"],["1 Sep 2024","Scholar","₹1,499","Paid"],["1 Aug 2024","Starter","₹499","Paid"]].map(([date,plan,amt,status]) => (
                <tr key={date} className="hover:bg-muted/30">
                  <td className="px-4 py-3">{date}</td>
                  <td className="px-4 py-3">{plan}</td>
                  <td className="px-4 py-3 font-mono">{amt}</td>
                  <td className="px-4 py-3"><span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">{status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DashboardMentorship() {
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold mb-2">Mentorship Sessions</h2>
      <p className="text-sm text-muted-foreground mb-8">Schedule 1-on-1 sessions with your assigned evaluator for personalised guidance.</p>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex gap-3">
        <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Mentorship available on Topper plan</p>
          <p className="text-xs text-amber-700 mt-0.5">Your current plan (Scholar) does not include mentorship sessions. Upgrade to Topper to access 2 sessions/month.</p>
          <button className="mt-3 bg-accent text-accent-foreground text-xs font-semibold px-4 py-2 rounded hover:bg-accent/90 transition-colors">
            Upgrade to Topper
          </button>
        </div>
      </div>
      <h3 className="font-semibold mb-5">What Mentorship Includes</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { icon: MessageSquare, title: "1-on-1 Video Sessions", desc: "30-minute live sessions with your evaluator via Google Meet. Discuss your answers in depth." },
          { icon: BookOpen, title: "Personalised Strategy", desc: "Get a custom answer-writing strategy built around your subject choices and weak areas." },
          { icon: FileText, title: "Session Notes", desc: "Detailed notes and action items after every session, accessible in your portal." },
          { icon: Bell, title: "Scheduled Reminders", desc: "Automated reminders before each session so you never miss a mentorship slot." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-card border border-border rounded-xl p-5 flex gap-4">
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <Icon size={16} className="text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">{title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardLayout({ page, setPage, user }: { page: Page; setPage: (p: Page) => void; user: User }) {
  const [sideOpen, setSideOpen] = useState(false);
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 top-16 z-40 w-60 bg-sidebar flex flex-col transition-transform duration-200 md:translate-x-0 md:static md:z-auto",
        sideOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-accent-foreground shrink-0">
              {user.name.split(" ").map(n => n[0]).join("").slice(0,2)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-sidebar-foreground truncate">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/50 truncate">{user.plan} Plan</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {DASH_NAV.map(({ label, icon: Icon, key }) => (
            <button
              key={key}
              onClick={() => { setPage(key); setSideOpen(false); }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                page === key
                  ? "bg-sidebar-accent text-sidebar-foreground font-semibold"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <Icon size={16} />{label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <div className="bg-sidebar-accent/50 rounded-lg px-3 py-2.5">
            <p className="text-xs text-sidebar-foreground/50 mb-1">Evaluations left</p>
            <p className="font-mono font-bold text-accent text-lg">{user.answersLeft} / 8</p>
            <div className="mt-2 h-1.5 bg-sidebar-border rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full" style={{ width: `${(user.answersLeft / 8) * 100}%` }} />
            </div>
          </div>
        </div>
      </aside>
      {sideOpen && <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setSideOpen(false)} />}

      {/* Main content */}
      <main className="flex-1 min-w-0 p-6 md:p-8">
        <div className="md:hidden mb-4">
          <button onClick={() => setSideOpen(true)} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Menu size={16} /> Menu
          </button>
        </div>
        {page === "dashboard-upload" && <DashboardUpload user={user} />}
        {page === "dashboard-submissions" && <DashboardSubmissions />}
        {page === "dashboard-evaluated" && <DashboardEvaluated />}
        {page === "dashboard-subscription" && <DashboardSubscription user={user} />}
        {page === "dashboard-mentorship" && <DashboardMentorship />}
      </main>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<User>({ name: "Ananya Dubey", email: "ananya@example.com", plan: "Scholar", answersLeft: 5 });

  const isDashboard = page.startsWith("dashboard-");

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <style>{`
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-sans { font-family: 'DM Sans', system-ui, sans-serif; }
        .font-mono { font-family: 'DM Mono', 'Courier New', monospace; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--muted-foreground); }
      `}</style>
      <Navbar page={page} setPage={setPage} isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />
      <div className="flex-1 flex flex-col">
        {page === "home" && <HomePage setPage={setPage} />}
        {page === "about" && <AboutPage />}
        {page === "pricing" && <PricingPage setPage={setPage} />}
        {page === "contact" && <ContactPage />}
        {page === "refund" && <RefundPage />}
        {page === "sample" && <SamplePage setPage={setPage} />}
        {page === "login" && <LoginPage setPage={setPage} setLoggedIn={setLoggedIn} setUser={setUser} />}
        {page === "register" && <RegisterPage setPage={setPage} setLoggedIn={setLoggedIn} setUser={setUser} />}
        {isDashboard && <DashboardLayout page={page} setPage={setPage} user={user} />}
      </div>
      {!isDashboard && <Footer setPage={setPage} />}
    </div>
  );
}

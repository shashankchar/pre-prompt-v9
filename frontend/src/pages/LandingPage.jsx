import { ArrowRight, BadgeCheck, Film, Mic, ShieldCheck, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";
import EditorCard from "../components/EditorCard";
import { categories, featuredEditors } from "../data/mock";

export default function LandingPage() {
  return (
    <main>
      <section className="animated-gradient relative overflow-hidden">
        <div className="section grid min-h-[calc(100vh-73px)] items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div className="max-w-3xl pt-10">
            <span className="chip"><Sparkles size={14} /> Managed editor marketplace</span>
            <h1 className="mt-6 text-5xl font-black leading-tight tracking-normal text-white md:text-7xl">Hire Trusted Video Editors</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              Connect with skilled editors for reels, YouTube videos, gaming montages, podcasts, and cinematic edits.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/explore" className="btn btn-primary">Explore Editors <ArrowRight size={18} /></Link>
              <Link to="/register" className="btn btn-soft">Become an Editor</Link>
            </div>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 text-sm">
              <div className="glass rounded-lg p-4"><strong className="block text-2xl text-white">120+</strong><span className="text-slate-300">vetted editors</span></div>
              <div className="glass rounded-lg p-4"><strong className="block text-2xl text-white">24h</strong><span className="text-slate-300">fast replies</span></div>
              <div className="glass rounded-lg p-4"><strong className="block text-2xl text-white">4.9</strong><span className="text-slate-300">avg rating</span></div>
            </div>
          </div>
          <div className="grid gap-4 pb-10 lg:pt-10">
            {featuredEditors.slice(0, 2).map((editor) => <EditorCard key={editor._id} editor={editor} />)}
          </div>
        </div>
      </section>

      <section className="section" id="categories">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.22em] text-cyan-200">Categories</p>
            <h2 className="mt-2 text-3xl font-black text-white">Built for the edits creators order every week</h2>
          </div>
          <Film className="hidden text-violet-200 md:block" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {categories.map((category) => (
            <Link to={`/explore?category=${category}`} className="glass rounded-lg p-5 capitalize transition hover:-translate-y-1 hover:bg-white/10" key={category}>
              <Film className="mb-6 text-cyan-200" />
              <strong className="text-white">{category}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Vetted editors", "Admins approve editor accounts before they appear in search.", BadgeCheck],
            ["Platform chat", "Project rooms keep files, notes, status, and messages together.", Mic],
            ["Anti-bypass warnings", "Contact-sharing attempts are flagged and blurred for moderation.", ShieldCheck]
          ].map(([title, text, Icon]) => (
            <div className="glass rounded-lg p-6" key={title}>
              <Icon className="text-violet-200" />
              <h3 className="mt-5 text-xl font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section pt-0">
        <div className="grid gap-4 md:grid-cols-3">
          {["The editor search feels curated, not chaotic.", "Voice notes saved us from scheduling a call.", "Having status and files in one room made revisions calmer."].map((quote, index) => (
            <div className="glass rounded-lg p-6" key={quote}>
              <div className="flex gap-1 text-amber-200">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}</div>
              <p className="mt-4 text-slate-200">"{quote}"</p>
              <p className="mt-5 text-sm font-bold text-slate-400">Creator partner #{index + 1}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

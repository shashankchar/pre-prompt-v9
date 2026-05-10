import { Clock, Languages, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function EditorCard({ editor }) {
  return (
    <Link to={`/editors/${editor.username}`} className="group glass overflow-hidden rounded-lg transition duration-300 hover:-translate-y-1 hover:shadow-glow">
      <div className="relative h-40 overflow-hidden">
        <img src={editor.bannerImage || editor.portfolio?.[0]?.thumbnailUrl} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
        <img src={editor.profilePicture || editor.user?.avatar} alt="" className="absolute bottom-4 left-4 h-14 w-14 rounded-lg border border-white/20 object-cover" />
      </div>
      <div className="space-y-4 p-5">
        <div>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-white">@{editor.username}</h3>
            <span className={`badge ${editor.availability === "available" ? "text-emerald-200" : "text-amber-200"}`}>{editor.availability}</span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-slate-300">{editor.bio}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {editor.editingStyles?.slice(0, 3).map((style) => <span className="chip" key={style}>{style}</span>)}
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs text-slate-300">
          <span className="mini-stat"><Sparkles size={14} /> {editor.experienceLevel}</span>
          <span className="mini-stat"><Clock size={14} /> {editor.turnaroundTime}</span>
          <span className="mini-stat"><Languages size={14} /> {editor.languages?.[0]}</span>
        </div>
      </div>
    </Link>
  );
}

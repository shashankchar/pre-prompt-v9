import { ArrowLeft, Briefcase, Clock, Languages, MonitorPlay } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { featuredEditors } from "../data/mock";
import api from "../lib/api";

export default function EditorProfile() {
  const { username } = useParams();
  const [editor, setEditor] = useState(featuredEditors.find((item) => item.username === username) || featuredEditors[0]);

  useEffect(() => {
    api.get(`/editors/${username}`).then(({ data }) => setEditor(data.editor)).catch(() => {});
  }, [username]);

  return (
    <main>
      <section className="relative h-72 overflow-hidden">
        <img src={editor.bannerImage} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-black/50 to-black/10" />
      </section>
      <section className="mx-auto -mt-24 max-w-7xl px-4 pb-20">
        <Link to="/explore" className="mb-5 inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"><ArrowLeft size={16} /> Back to explore</Link>
        <div className="glass rounded-lg p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <img src={editor.profilePicture || editor.user?.avatar} alt="" className="h-28 w-28 rounded-lg border border-white/20 object-cover" />
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-4xl font-black text-white">@{editor.username}</h1>
                  <span className="badge text-emerald-200">{editor.availability}</span>
                </div>
                <p className="mt-3 max-w-2xl text-slate-300">{editor.bio}</p>
              </div>
            </div>
            <Link to={`/request/${editor._id}`} className="btn btn-gradient">Hire Editor</Link>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-4">
            <div className="mini-stat"><Briefcase size={16} /> {editor.experienceLevel}</div>
            <div className="mini-stat"><Clock size={16} /> {editor.turnaroundTime}</div>
            <div className="mini-stat"><Languages size={16} /> {editor.languages?.join(", ")}</div>
            <div className="mini-stat"><MonitorPlay size={16} /> {editor.software?.join(", ")}</div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="mb-4 text-2xl font-black text-white">Portfolio</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {editor.portfolio?.map((item) => (
                <a href={item.videoUrl || "#"} className="group glass overflow-hidden rounded-lg" key={item._id || item.title}>
                  <div className="relative aspect-video overflow-hidden">
                    <img src={item.thumbnailUrl} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 grid place-items-center bg-black/0 transition group-hover:bg-black/45">
                      <span className="scale-90 rounded-full bg-white px-4 py-2 text-sm font-black text-black opacity-0 transition group-hover:scale-100 group-hover:opacity-100">Preview</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-white">{item.title}</p>
                    <p className="text-sm capitalize text-slate-400">{item.category}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <aside className="glass h-fit rounded-lg p-5">
            <h3 className="text-lg font-bold text-white">Private by default</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">Social links and contact details stay hidden from public profiles. Requests and communication happen through EditBridge project rooms.</p>
            <div className="mt-5 flex flex-wrap gap-2">{editor.editingStyles?.map((style) => <span className="chip" key={style}>{style}</span>)}</div>
          </aside>
        </div>
      </section>
    </main>
  );
}

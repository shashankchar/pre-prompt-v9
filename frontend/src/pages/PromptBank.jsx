import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

export default function PromptBank() {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState([]);
  const [form, setForm] = useState({ title: "", text: "", tags: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/prompts")
      .then(({ data }) => setPrompts(data.prompts || []))
      .catch(() => setPrompts([]));
  }, []);

  async function submitPrompt(event) {
    event.preventDefault();
    if (!form.title.trim() || !form.text.trim()) return;

    setSaving(true);
    try {
      await api.post("/prompts", form);
      const { data } = await api.get("/prompts");
      setPrompts(data.prompts || []);
      setForm({ title: "", text: "", tags: "" });
    } catch (error) {
      console.error(error);
      alert("Failed to upload prompt. Please sign in and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="section">
      <div className="mb-8 space-y-4">
        <p className="text-sm font-bold uppercase tracking-[.22em] text-cyan-200">Prompt bank</p>
        <h1 className="text-4xl font-black text-white">Public prompt uploads for creators</h1>
        <p className="max-w-3xl text-slate-300">Browse prompts shared by users and submit your own prompt publicly. Once uploaded, prompts are visible to everyone on the public prompt bank.</p>
      </div>

      {user ? (
        <form onSubmit={submitPrompt} className="glass rounded-xl p-6 shadow-xl">
          <div className="grid gap-4 lg:grid-cols-[1fr_180px]">
            <input
              className="field"
              placeholder="Prompt title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              className="field"
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
            />
          </div>
          <textarea
            className="field my-4 min-h-[140px]"
            placeholder="Enter the prompt text here"
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            required
          />
          <button type="submit" className="btn btn-gradient" disabled={saving}>
            <PlusCircle size={18} /> {saving ? "Uploading..." : "Upload prompt"}
          </button>
        </form>
      ) : (
        <div className="glass rounded-xl p-6 text-slate-300">Sign in to share prompts publicly with the community.</div>
      )}

      <section className="mt-10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.22em] text-cyan-200">Public prompts</p>
            <h2 className="text-3xl font-black text-white">Latest shared prompts</h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {prompts.length ? prompts.map((prompt) => (
            <article key={prompt._id} className="glass rounded-3xl p-5">
              <h3 className="text-xl font-bold text-white">{prompt.title}</h3>
              <p className="mt-3 text-slate-300 line-clamp-4">{prompt.text}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[.18em] text-cyan-200">
                {prompt.tags?.map((tag) => <span key={tag} className="chip">{tag}</span>)}
              </div>
              <p className="mt-4 text-sm text-slate-400">Shared by {prompt.authorName}</p>
            </article>
          )) : (
            <div className="glass rounded-3xl p-8 text-slate-300">No prompts are available yet. Share one to get started.</div>
          )}
        </div>
      </section>
    </main>
  );
}

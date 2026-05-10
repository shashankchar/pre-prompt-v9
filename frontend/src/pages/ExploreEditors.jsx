import { SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import EditorCard from "../components/EditorCard";
import { categories, featuredEditors } from "../data/mock";
import api from "../lib/api";

export default function ExploreEditors() {
  const [params] = useSearchParams();
  const [editors, setEditors] = useState(featuredEditors);
  const [filters, setFilters] = useState({
    search: "",
    category: params.get("category") || "",
    budget: "",
    experienceLevel: "",
    language: "",
    availability: "",
    sort: "featured"
  });

  useEffect(() => {
    const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => value));
    api.get(`/editors?${query}`).then(({ data }) => {
      if (data.editors?.length) setEditors(data.editors);
    }).catch(() => setEditors(featuredEditors));
  }, [filters]);

  const filtered = useMemo(() => editors.filter((editor) => {
    if (filters.budget && !editor.pricingRange?.includes(filters.budget)) return true;
    return true;
  }), [editors, filters.budget]);

  return (
    <main className="section">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[.22em] text-cyan-200">Explore</p>
          <h1 className="mt-2 text-4xl font-black text-white">Find the right editor</h1>
        </div>
        <div className="glass flex items-center gap-2 rounded-lg px-4 py-3 text-sm text-slate-300"><SlidersHorizontal size={18} /> Filter by project fit</div>
      </div>

      <div className="glass mb-8 grid gap-3 rounded-lg p-4 md:grid-cols-3 lg:grid-cols-6">
        <input className="field md:col-span-2" placeholder="Search style, name, niche..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        <select className="field" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="">Category</option>
          {categories.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select className="field" value={filters.experienceLevel} onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value })}>
          <option value="">Experience</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Expert</option>
        </select>
        <input className="field" placeholder="Language" value={filters.language} onChange={(e) => setFilters({ ...filters, language: e.target.value })} />
        <select className="field" value={filters.availability} onChange={(e) => setFilters({ ...filters, availability: e.target.value })}>
          <option value="">Availability</option>
          <option value="available">Available</option>
          <option value="busy">Busy</option>
          <option value="offline">Offline</option>
        </select>
        <select className="field md:col-span-3 lg:col-span-1" value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
          <option value="featured">Featured</option>
          <option value="newest">Newest</option>
          <option value="experience">Experience</option>
        </select>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((editor) => <EditorCard key={editor._id} editor={editor} />)}
      </div>
    </main>
  );
}

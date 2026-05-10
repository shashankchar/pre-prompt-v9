import { ImagePlus, Save, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { ProjectTable } from "./ClientDashboard";
import { demoProjects } from "../data/mock";
import api from "../lib/api";

export default function EditorDashboard() {
  const [projects, setProjects] = useState(demoProjects);
  const [profile, setProfile] = useState({
    username: "",
    bio: "",
    editingStyles: "",
    software: "",
    languages: "",
    experienceLevel: "intermediate",
    turnaroundTime: "",
    pricingRange: "",
    availability: "available"
  });
  const [portfolio, setPortfolio] = useState({ title: "", category: "reels", video: null, thumbnail: null });

  useEffect(() => {
    api.get("/projects").then(({ data }) => {
      if (data.projects?.length) setProjects(data.projects);
    }).catch(() => {});
  }, []);

  async function saveProfile(event) {
    event.preventDefault();
    await api.put("/editors/me/profile", profile);
    alert("Profile saved. Admin approval controls public visibility.");
  }

  async function addPortfolio(event) {
    event.preventDefault();
    const body = new FormData();
    Object.entries(portfolio).forEach(([key, value]) => value && body.append(key, value));
    await api.post("/editors/me/portfolio", body);
    alert("Portfolio item uploaded.");
  }

  return (
    <main className="section">
      <p className="text-sm font-bold uppercase tracking-[.22em] text-cyan-200">Editor dashboard</p>
      <h1 className="mt-2 text-4xl font-black text-white">Profile, portfolio, requests</h1>
      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_420px]">
        <form onSubmit={saveProfile} className="glass grid gap-4 rounded-lg p-5 md:grid-cols-2">
          <input className="field" placeholder="Username" value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} required />
          <select className="field" value={profile.experienceLevel} onChange={(e) => setProfile({ ...profile, experienceLevel: e.target.value })}>
            <option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="expert">Expert</option>
          </select>
          <textarea className="field min-h-28 md:col-span-2" placeholder="Bio" value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
          <input className="field" placeholder="Editing styles, comma separated" value={profile.editingStyles} onChange={(e) => setProfile({ ...profile, editingStyles: e.target.value })} />
          <input className="field" placeholder="Software used" value={profile.software} onChange={(e) => setProfile({ ...profile, software: e.target.value })} />
          <input className="field" placeholder="Languages" value={profile.languages} onChange={(e) => setProfile({ ...profile, languages: e.target.value })} />
          <input className="field" placeholder="Turnaround time" value={profile.turnaroundTime} onChange={(e) => setProfile({ ...profile, turnaroundTime: e.target.value })} />
          <input className="field" placeholder="Pricing range" value={profile.pricingRange} onChange={(e) => setProfile({ ...profile, pricingRange: e.target.value })} />
          <select className="field" value={profile.availability} onChange={(e) => setProfile({ ...profile, availability: e.target.value })}>
            <option value="available">Available</option><option value="busy">Busy</option><option value="offline">Offline</option>
          </select>
          <button className="btn btn-gradient md:col-span-2"><Save size={17} /> Save profile</button>
        </form>
        <form onSubmit={addPortfolio} className="glass h-fit space-y-4 rounded-lg p-5">
          <h2 className="text-xl font-black text-white">Upload portfolio</h2>
          <input className="field" placeholder="Title" value={portfolio.title} onChange={(e) => setPortfolio({ ...portfolio, title: e.target.value })} />
          <select className="field" value={portfolio.category} onChange={(e) => setPortfolio({ ...portfolio, category: e.target.value })}>
            {["gaming", "reels", "podcasts", "anime", "cinematic", "ads"].map((item) => <option key={item}>{item}</option>)}
          </select>
          <label className="btn btn-soft w-full cursor-pointer"><Upload size={17} /> Video<input className="hidden" type="file" accept="video/*" onChange={(e) => setPortfolio({ ...portfolio, video: e.target.files[0] })} /></label>
          <label className="btn btn-soft w-full cursor-pointer"><ImagePlus size={17} /> Thumbnail<input className="hidden" type="file" accept="image/*" onChange={(e) => setPortfolio({ ...portfolio, thumbnail: e.target.files[0] })} /></label>
          <button className="btn btn-primary w-full">Add portfolio item</button>
        </form>
      </div>
      <ProjectTable projects={projects} perspective="editor" />
    </main>
  );
}

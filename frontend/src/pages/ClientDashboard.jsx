import { MessageSquare, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusPill from "../components/StatusPill";
import { demoProjects } from "../data/mock";
import api from "../lib/api";

export default function ClientDashboard() {
  const [projects, setProjects] = useState(demoProjects);

  useEffect(() => {
    api.get("/projects").then(({ data }) => {
      if (data.projects?.length) setProjects(data.projects);
    }).catch(() => {});
  }, []);

  return (
    <main className="section">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[.22em] text-cyan-200">Client dashboard</p>
          <h1 className="mt-2 text-4xl font-black text-white">Project requests</h1>
        </div>
        <Link to="/explore" className="btn btn-gradient"><Plus size={18} /> Hire an editor</Link>
      </div>
      <ProjectTable projects={projects} perspective="client" />
    </main>
  );
}

export function ProjectTable({ projects, perspective }) {
  return (
    <div className="glass mt-8 overflow-hidden rounded-lg">
      <div className="hidden grid-cols-[1fr_160px_130px_120px] border-b border-line px-5 py-3 text-xs font-bold uppercase tracking-widest text-slate-400 md:grid">
        <span>Project</span><span>{perspective === "editor" ? "Client" : "Editor"}</span><span>Status</span><span>Room</span>
      </div>
      {projects.map((project) => (
        <div className="grid gap-3 border-b border-line px-5 py-4 last:border-b-0 md:grid-cols-[1fr_160px_130px_120px] md:items-center" key={project._id}>
          <div>
            <p className="font-bold text-white">{project.title}</p>
            <p className="text-sm text-slate-400">${project.budget || 0}</p>
          </div>
          <span className="text-sm text-slate-300">{perspective === "editor" ? project.client?.name : project.editor?.name}</span>
          <StatusPill status={project.status} />
          <Link to={`/projects/${project._id}/chat`} className="btn btn-soft w-fit"><MessageSquare size={16} /> Open</Link>
        </div>
      ))}
    </div>
  );
}

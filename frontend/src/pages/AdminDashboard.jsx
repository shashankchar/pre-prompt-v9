import { Ban, Check, ShieldAlert, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import StatusPill from "../components/StatusPill";
import api from "../lib/api";

export default function AdminDashboard() {
  const [overview, setOverview] = useState({ users: [], pendingEditors: [], projects: [], flaggedMessages: [], reports: [] });

  useEffect(() => {
    api.get("/admin/overview").then(({ data }) => setOverview(data)).catch(() => {});
  }, []);

  async function setUserStatus(id, status) {
    await api.patch(`/admin/users/${id}/status`, { status });
    setOverview((current) => ({ ...current, users: current.users.map((user) => user._id === id ? { ...user, status } : user) }));
  }

  async function approveEditor(id, approved) {
    await api.patch(`/editors/${id}/approval`, { approved });
    setOverview((current) => ({ ...current, pendingEditors: current.pendingEditors.filter((editor) => editor._id !== id) }));
  }

  return (
    <main className="section">
      <p className="text-sm font-bold uppercase tracking-[.22em] text-cyan-200">Admin dashboard</p>
      <h1 className="mt-2 text-4xl font-black text-white">Marketplace control room</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Metric label="Users" value={overview.users.length} />
        <Metric label="Pending editors" value={overview.pendingEditors.length} />
        <Metric label="Projects" value={overview.projects.length} />
        <Metric label="Flagged messages" value={overview.flaggedMessages.length} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <Panel title="Editor approvals" icon={<UserCheck />}>
          {overview.pendingEditors.map((editor) => (
            <Row key={editor._id} title={editor.username} meta={editor.user?.email}>
              <button className="icon-btn" onClick={() => approveEditor(editor._id, true)} aria-label="Approve"><Check size={17} /></button>
              <button className="icon-btn" onClick={() => approveEditor(editor._id, false)} aria-label="Reject"><Ban size={17} /></button>
            </Row>
          ))}
        </Panel>
        <Panel title="Flagged messages" icon={<ShieldAlert />}>
          {overview.flaggedMessages.map((message) => (
            <Row key={message._id} title={message.sender?.name} meta={message.warning}>
              <span className="max-w-48 blur-sm">{message.text}</span>
            </Row>
          ))}
        </Panel>
        <Panel title="Projects" icon={<Check />}>
          {overview.projects.map((project) => (
            <Row key={project._id} title={project.title} meta={`${project.client?.name || "Client"} to ${project.editor?.name || "Editor"}`}>
              <StatusPill status={project.status} />
            </Row>
          ))}
        </Panel>
        <Panel title="Users" icon={<UserCheck />}>
          {overview.users.map((user) => (
            <Row key={user._id} title={user.name} meta={`${user.email} - ${user.role} - ${user.status}`}>
              <button className="btn btn-soft" onClick={() => setUserStatus(user._id, user.status === "banned" ? "active" : "banned")}>{user.status === "banned" ? "Unban" : "Ban"}</button>
            </Row>
          ))}
        </Panel>
      </div>
    </main>
  );
}

function Metric({ label, value }) {
  return <div className="glass rounded-lg p-5"><p className="text-sm text-slate-400">{label}</p><strong className="mt-2 block text-3xl text-white">{value}</strong></div>;
}

function Panel({ title, icon, children }) {
  return <section className="glass rounded-lg p-5"><h2 className="mb-4 flex items-center gap-2 text-xl font-black text-white">{icon}{title}</h2><div className="space-y-3">{children}</div></section>;
}

function Row({ title, meta, children }) {
  return <div className="flex flex-col justify-between gap-3 rounded-lg border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center"><div><p className="font-bold text-white">{title}</p><p className="text-sm text-slate-400">{meta}</p></div><div className="flex items-center gap-2">{children}</div></div>;
}

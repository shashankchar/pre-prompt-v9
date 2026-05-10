import { Mic, Send, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import StatusPill from "../components/StatusPill";
import { useAuth } from "../context/AuthContext";
import api, { SOCKET_URL } from "../lib/api";

export default function ChatRoom() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("Pending");

  const socket = useMemo(() => {
    const token = localStorage.getItem("editbridge_token");
    return io(SOCKET_URL, { auth: { token }, autoConnect: false });
  }, []);

  useEffect(() => {
    api.get(`/projects/${projectId}`).then(({ data }) => {
      setProject(data.project);
      setStatus(data.project.status);
      setMessages(data.messages || []);
    }).catch(() => {
      setProject({ _id: projectId, title: "Demo project room", status: "In Progress", client: { name: "Client" }, editor: { name: "Editor" } });
      setMessages([
        { _id: "m1", sender: { name: "Client", role: "client" }, text: "Here are the references and pacing notes.", createdAt: new Date().toISOString() },
        { _id: "m2", sender: { name: "Editor", role: "editor" }, text: "Send me your email or WhatsApp", flagged: true, warning: "This message may contain off-platform contact details. Keep communication on EditBridge.", createdAt: new Date().toISOString() }
      ]);
    });

    socket.connect();
    socket.emit("project:join", projectId);
    socket.on("message:new", (message) => setMessages((current) => current.some((item) => item._id === message._id) ? current : [...current, message]));
    return () => socket.disconnect();
  }, [projectId, socket]);

  async function sendMessage(event) {
    event.preventDefault();
    if (!text.trim() && !file) return;

    if (!file) {
      socket.emit("message:send", { projectId, text });
      setText("");
      return;
    }

    const body = new FormData();
    body.append("text", text);
    body.append("file", file);
    body.append("fileType", file.type.startsWith("audio") ? "audio" : file.type.startsWith("image") ? "image" : "file");
    await api.post(`/messages/${projectId}`, body);
    setText("");
    setFile(null);
  }

  async function changeStatus(nextStatus) {
    setStatus(nextStatus);
    try {
      const { data } = await api.patch(`/projects/${projectId}/status`, { status: nextStatus });
      setProject(data.project);
    } catch {
      setProject((current) => ({ ...current, status: nextStatus }));
    }
  }

  return (
    <main className="section">
      <div className="glass rounded-lg p-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.22em] text-cyan-200">Project room</p>
            <h1 className="mt-2 text-3xl font-black text-white">{project?.title || "Loading project..."}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={status} />
            {(user?.role === "editor" || user?.role === "admin") && (
              <select className="field w-auto" value={status} onChange={(e) => changeStatus(e.target.value)}>
                {["Pending", "Accepted", "In Progress", "Revision", "Completed"].map((item) => <option key={item}>{item}</option>)}
              </select>
            )}
          </div>
        </div>

        {project?.voiceNoteUrl && (
          <div className="mt-5 rounded-lg border border-cyan-300/20 bg-cyan-400/10 p-4">
            <p className="mb-2 flex items-center gap-2 text-sm font-bold text-cyan-100"><Mic size={16} /> Project voice note</p>
            <audio src={project.voiceNoteUrl} controls className="w-full" />
          </div>
        )}

        <div className="mt-6 h-[52vh] space-y-3 overflow-y-auto rounded-lg border border-white/10 bg-black/25 p-4">
          {messages.map((message) => (
            <div className="max-w-2xl rounded-lg border border-white/10 bg-white/10 p-3" key={message._id}>
              <div className="mb-2 flex items-center justify-between gap-3 text-xs text-slate-400">
                <span className="font-bold text-slate-200">{message.sender?.name || "User"} · {message.sender?.role}</span>
                <time>{new Date(message.createdAt).toLocaleString()}</time>
              </div>
              {message.flagged && <p className="mb-2 rounded-md bg-amber-400/10 p-2 text-xs text-amber-100">{message.warning}</p>}
              {message.text && <p className={message.flagged ? "blur-sm select-none text-slate-200" : "text-slate-200"}>{message.text}</p>}
              {message.fileUrl && message.fileType === "audio" && <audio className="mt-2 w-full" src={message.fileUrl} controls />}
              {message.fileUrl && message.fileType !== "audio" && <a className="mt-2 inline-block text-sm font-bold text-cyan-200" href={message.fileUrl}>Open attachment</a>}
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} className="mt-4 flex flex-col gap-3 md:flex-row">
          <input className="field flex-1" placeholder="Type a message. Contact details will be warned and blurred." value={text} onChange={(e) => setText(e.target.value)} />
          <label className="icon-btn cursor-pointer" aria-label="Attach file"><Upload size={18} /><input className="hidden" type="file" onChange={(e) => setFile(e.target.files[0])} /></label>
          <button className="btn btn-gradient"><Send size={17} /> Send</button>
        </form>
        {file && <p className="mt-2 text-sm text-slate-400">Attached: {file.name}</p>}
      </div>
    </main>
  );
}

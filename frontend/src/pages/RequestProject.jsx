import { Mic, Upload } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/api";

export default function RequestProject() {
  const { editorId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", budget: "", deadline: "", referenceLinks: "" });
  const [voiceNote, setVoiceNote] = useState(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks = [];
    recorder.ondataavailable = (event) => chunks.push(event.data);
    recorder.onstop = () => setVoiceNote(new File([new Blob(chunks, { type: "audio/webm" })], "voice-note.webm"));
    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  }

  function stopRecording() {
    mediaRecorder?.stop();
    setRecording(false);
  }

  async function submit(event) {
    event.preventDefault();
    const body = new FormData();
    Object.entries({ ...form, editorProfileId: editorId }).forEach(([key, value]) => body.append(key, value));
    if (voiceNote) body.append("voiceNote", voiceNote);
    const { data } = await api.post("/projects", body);
    navigate(`/projects/${data.project._id}/chat`);
  }

  return (
    <main className="section max-w-4xl">
      <h1 className="text-4xl font-black text-white">Request project</h1>
      <p className="mt-3 text-slate-300">Send a concise brief, budget, deadline, references, and an optional voice note.</p>
      <form onSubmit={submit} className="glass mt-8 space-y-4 rounded-lg p-5">
        <input className="field" placeholder="Project title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <textarea className="field min-h-36" placeholder="Project description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <div className="grid gap-4 md:grid-cols-2">
          <input className="field" placeholder="Budget" type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
          <input className="field" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
        </div>
        <textarea className="field min-h-24" placeholder="Reference links, one per line" value={form.referenceLinks} onChange={(e) => setForm({ ...form, referenceLinks: e.target.value })} />
        <div className="flex flex-wrap gap-3">
          <label className="btn btn-soft cursor-pointer"><Upload size={17} /> Upload voice note<input className="hidden" type="file" accept="audio/*" onChange={(e) => setVoiceNote(e.target.files[0])} /></label>
          <button type="button" className="btn btn-soft" onClick={recording ? stopRecording : startRecording}><Mic size={17} /> {recording ? "Stop recording" : "Record audio"}</button>
          {voiceNote && <span className="chip">{voiceNote.name}</span>}
        </div>
        <button className="btn btn-gradient">Send request</button>
      </form>
    </main>
  );
}

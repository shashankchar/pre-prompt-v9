import { Clapperboard } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthPage({ mode }) {
  const isRegister = mode === "register";
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "client" });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      const user = isRegister ? await register(form) : await login(form.email, form.password);
      navigate(user.role === "editor" ? "/editor-dashboard" : user.role === "admin" ? "/admin" : "/client-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    }
  }

  return (
    <main className="grid min-h-[calc(100vh-73px)] place-items-center px-4 py-16">
      <form onSubmit={submit} className="glass w-full max-w-md rounded-lg p-6">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-white text-black"><Clapperboard /></span>
          <div>
            <h1 className="text-2xl font-black text-white">{isRegister ? "Create account" : "Welcome back"}</h1>
            <p className="text-sm text-slate-400">Use JWT auth with role-based dashboards.</p>
          </div>
        </div>
        <div className="space-y-3">
          {isRegister && <input className="field" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />}
          <input className="field" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="field" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          {isRegister && (
            <select className="field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="client">Client</option>
              <option value="editor">Editor</option>
            </select>
          )}
        </div>
        {error && <p className="mt-4 rounded-lg border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
        <button className="btn btn-gradient mt-5 w-full">{isRegister ? "Register" : "Login"}</button>
        <p className="mt-5 text-center text-sm text-slate-400">
          {isRegister ? "Already joined?" : "New to EditBridge?"}{" "}
          <Link className="font-bold text-white" to={isRegister ? "/login" : "/register"}>{isRegister ? "Sign in" : "Create an account"}</Link>
        </p>
      </form>
    </main>
  );
}

import { Clapperboard, LayoutDashboard, LogOut, Search, ShieldCheck, UserRound } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const dashboard = user?.role === "admin" ? "/admin" : user?.role === "editor" ? "/editor-dashboard" : "/client-dashboard";

  return (
    <div className="min-h-screen bg-ink text-slate-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(104,92,255,.34),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(22,163,184,.22),transparent_28%),linear-gradient(180deg,#05050a,#080914_55%,#05050a)]" />
      <header className="sticky top-0 z-40 border-b border-line bg-black/45 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 text-lg font-black tracking-wide">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-black"><Clapperboard size={20} /></span>
            EditBridge
          </Link>
          <div className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <NavLink to="/explore" className="hover:text-white">Explore</NavLink>
            <NavLink to="/prompts" className="hover:text-white">Prompt Bank</NavLink>
            {user && <NavLink to={dashboard} className="hover:text-white">Dashboard</NavLink>}
            {user?.role === "admin" && <NavLink to="/admin" className="hover:text-white">Admin</NavLink>}
          </div>
          <div className="flex items-center gap-2">
            <Link to="/explore" className="icon-btn" aria-label="Search editors"><Search size={18} /></Link>
            {user ? (
              <>
                <Link to={dashboard} className="icon-btn" aria-label="Dashboard">
                  {user.role === "admin" ? <ShieldCheck size={18} /> : <LayoutDashboard size={18} />}
                </Link>
                <button className="icon-btn" onClick={logout} aria-label="Logout"><LogOut size={18} /></button>
              </>
            ) : (
              <Link to="/login" className="btn btn-soft"><UserRound size={17} /> Sign in</Link>
            )}
          </div>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}

export default function StatusPill({ status }) {
  const map = {
    Pending: "bg-amber-400/10 text-amber-200",
    Accepted: "bg-sky-400/10 text-sky-200",
    "In Progress": "bg-violet-400/10 text-violet-200",
    Revision: "bg-orange-400/10 text-orange-200",
    Completed: "bg-emerald-400/10 text-emerald-200"
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${map[status] || map.Pending}`}>{status}</span>;
}

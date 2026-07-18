import { useEffect, useState } from "react";
import { getDashboard } from "../api";
import StatusChart from "../components/StatusChart";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard()
      .then((res) => setStats(res.data))
      .catch(() => setError("Could not load dashboard."));
  }, []);

  if (error) return <p className="p-6 text-red-600 text-sm">{error}</p>;
  if (!stats) return <p className="p-6 text-gray-400 text-sm">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total applications</p>
          <p className="text-3xl font-bold text-brand-600">{stats.total}</p>
        </div>
        {Object.entries(stats.by_status).map(([status, count]) => (
          <div key={status} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-500 capitalize">{status}</p>
            <p className="text-3xl font-bold">{count}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h2 className="font-semibold mb-4">Applications by status</h2>
        <StatusChart byStatus={stats.by_status} />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h2 className="font-semibold mb-4">Follow-ups due this week</h2>
        {stats.due_soon.length === 0 ? (
          <p className="text-sm text-gray-400">Nothing due soon.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {stats.due_soon.map((app) => (
              <li key={app.id} className="py-2 flex justify-between text-sm">
                <span>
                  {app.company} — {app.role}
                </span>
                <span className="text-amber-600 font-medium">{app.follow_up_date}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const STATUS_COLORS = {
  applied: "#6366f1",
  oa: "#f59e0b",
  interview: "#0ea5e9",
  offer: "#22c55e",
  rejected: "#ef4444",
};

export default function StatusChart({ byStatus }) {
  const data = Object.entries(byStatus).map(([status, count]) => ({
    status,
    count,
  }));

  if (data.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-10">
        No applications yet — add one to see your stats.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <XAxis dataKey="status" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || "#94a3b8"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

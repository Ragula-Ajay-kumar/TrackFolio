import { useState } from "react";

const STATUS_OPTIONS = ["applied", "oa", "interview", "offer", "rejected"];

export default function ApplicationForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    company: initial?.company || "",
    role: initial?.role || "",
    status: initial?.status || "applied",
    applied_date: initial?.applied_date || "",
    follow_up_date: initial?.follow_up_date || "",
    notes: initial?.notes || "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company.trim() || !form.role.trim()) {
      setError("Company and role are required.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.applied_date) delete payload.applied_date;
      if (!payload.follow_up_date) payload.follow_up_date = null;
      await onSubmit(payload);
    } catch (err) {
      setError(err?.response?.data?.detail || "Something went wrong. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-4"
      >
        <h2 className="text-lg font-semibold">
          {initial ? "Edit Application" : "Add Application"}
        </h2>

        {error && (
          <p className="text-sm bg-red-50 text-red-600 px-3 py-2 rounded-md">{error}</p>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Company</label>
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="e.g. Cisco"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <input
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="e.g. Software Consulting Engineer"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Applied date</label>
            <input
              type="date"
              name="applied_date"
              value={form.applied_date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Follow-up date (optional)</label>
          <input
            type="date"
            name="follow_up_date"
            value={form.follow_up_date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="Referral contact, round details, etc."
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-sm rounded-md bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

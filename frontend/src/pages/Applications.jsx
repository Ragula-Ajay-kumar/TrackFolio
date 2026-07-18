import { useEffect, useState } from "react";
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from "../api";
import ApplicationForm from "../components/ApplicationForm";

const STATUS_STYLES = {
  applied: "bg-indigo-50 text-indigo-600",
  oa: "bg-amber-50 text-amber-600",
  interview: "bg-sky-50 text-sky-600",
  offer: "bg-green-50 text-green-600",
  rejected: "bg-red-50 text-red-600",
};

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const loadApplications = () => {
    setLoading(true);
    getApplications()
      .then((res) => setApplications(res.data))
      .catch(() => setError("Could not load applications."))
      .finally(() => setLoading(false));
  };

  useEffect(loadApplications, []);

  const handleCreate = async (data) => {
    await createApplication(data);
    setShowForm(false);
    loadApplications();
  };

  const handleUpdate = async (data) => {
    await updateApplication(editing.id, data);
    setEditing(null);
    loadApplications();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    await deleteApplication(id);
    loadApplications();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Applications</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-brand-600 text-white text-sm px-4 py-2 rounded-md hover:bg-brand-700"
        >
          + Add Application
        </button>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-100 p-10 text-center text-gray-400 text-sm">
          No applications yet. Click "Add Application" to get started.
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-100">
          {applications.map((app) => (
            <div key={app.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="font-medium">{app.company}</p>
                <p className="text-sm text-gray-500">{app.role}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                    STATUS_STYLES[app.status] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {app.status}
                </span>
                <button
                  onClick={() => setEditing(app)}
                  className="text-sm text-gray-500 hover:text-brand-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(app.id)}
                  className="text-sm text-gray-500 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ApplicationForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}
      {editing && (
        <ApplicationForm
          initial={editing}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}

import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const isAuthed = !!localStorage.getItem("trackfolio_token");

  const handleLogout = () => {
    localStorage.removeItem("trackfolio_token");
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-brand-600">
        TrackFolio
      </Link>
      <div className="flex items-center gap-4">
        {isAuthed ? (
          <>
            <Link to="/" className="text-sm text-gray-600 hover:text-brand-600">
              Dashboard
            </Link>
            <Link to="/applications" className="text-sm text-gray-600 hover:text-brand-600">
              Applications
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-gray-600 hover:text-brand-600">
              Log in
            </Link>
            <Link
              to="/register"
              className="text-sm bg-brand-600 text-white px-3 py-1.5 rounded-md hover:bg-brand-700"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

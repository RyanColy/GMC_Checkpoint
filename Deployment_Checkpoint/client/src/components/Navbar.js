import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sort = searchParams.get("sort");

  const linkClass = (key) =>
    (key === "popular" ? sort === "popular" : !sort || sort === "new")
      ? "nav-link active"
      : "nav-link";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="logo-bars">
          <span className="bar bar1" />
          <span className="bar bar2" />
        </span>
        <span className="logo-text">Manga News</span>
      </Link>

      <div className="navbar-search">
        <span className="search-icon">🔍</span>
        <input placeholder="Rechercher un article..." />
      </div>

      <div className="navbar-links">
        <Link to="/?sort=new" className={linkClass("new")}>Nouveautés</Link>
        <Link to="/?sort=popular" className={linkClass("popular")}>Tendances</Link>
      </div>

      <div className="navbar-auth">
        {user ? (
          <>
            <span className="navbar-user">@{user.username}</span>
            <button className="btn-outline" onClick={handleLogout}>Déconnexion</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Connexion</Link>
            <Link to="/register" className="btn-pink">Rejoindre</Link>
          </>
        )}
      </div>
    </nav>
  );
}

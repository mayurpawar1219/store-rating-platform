import { Link, useLocation } from "react-router-dom";

function Navbar({ onLogout, role }) {
  const location = useLocation();

  const isLinkActive = (path) => {
    return location.pathname === path ? "nav__link nav__link--active" : "nav__link";
  };

  return (
    <header className="nav">
      <div className="nav__inner">
        <div className="nav__brand">Store Rating Platform</div>

        <nav className="nav__links">
          {role === "admin" && (
            <Link className={isLinkActive("/admin")} to="/admin">
              Admin Console
            </Link>
          )}
          {role === "user" && (
            <Link className={isLinkActive("/user")} to="/user">
              Store Directory
            </Link>
          )}
          {role === "owner" && (
            <Link className={isLinkActive("/owner")} to="/owner">
              Store Manager
            </Link>
          )}
        </nav>

        <div className="nav__user-section">
          {role && (
            <span className={`nav__badge nav__badge--${role}`}>
              {role}
            </span>
          )}
          
          {role ? (
            <button className="btn btn--secondary btn--sm" onClick={onLogout}>
              Logout
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Navbar;

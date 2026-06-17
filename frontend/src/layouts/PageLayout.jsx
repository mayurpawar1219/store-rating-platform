import Navbar from "../components/Navbar";

function PageLayout({ children, role, onLogout }) {
  return (
    <div className="page">
      <Navbar role={role} onLogout={onLogout} />
      <main className="container">{children}</main>
    </div>
  );
}

export default PageLayout;

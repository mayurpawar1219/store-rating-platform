import { useEffect, useState, useMemo } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import PageLayout from "../layouts/PageLayout";
import TextField from "../components/inputs/TextField";
import PasswordField from "../components/inputs/PasswordField";

function AdminDashboard() {
  const { role, logoutUser } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [ownerSubmitting, setOwnerSubmitting] = useState(false);
  const [storeSubmitting, setStoreSubmitting] = useState(false);
  
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);

  const [ownerForm, setOwnerForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });

  const [storeForm, setStoreForm] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });

  const fetchDashboard = async () => {
    try {
      const [dashRes, usersRes, storesRes] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/users"),
        api.get("/admin/stores"),
      ]);

      const d = dashRes.data || {};
      setStats({
        totalUsers: d.totalUsers ?? d.total_users ?? 0,
        totalStores: d.totalStores ?? d.total_stores ?? 0,
        totalRatings: d.totalRatings ?? d.total_ratings ?? 0,
      });

      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      setStores(Array.isArray(storesRes.data) ? storesRes.data : []);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load admin dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleCreateOwner = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setOwnerSubmitting(true);
    
    try {
      await api.post("/admin/create-owner", {
        name: ownerForm.name,
        email: ownerForm.email,
        address: ownerForm.address,
        password: ownerForm.password,
      });
      
      setSuccessMsg("Store Owner created successfully!");
      setOwnerForm({
        name: "",
        email: "",
        address: "",
        password: "",
      });
      
      await fetchDashboard();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create store owner.");
    } finally {
      setOwnerSubmitting(false);
    }
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    
    if (!storeForm.ownerId) {
      setError("Please select a store owner.");
      return;
    }

    setStoreSubmitting(true);

    try {
      await api.post("/admin/create-store", {
        name: storeForm.name,
        email: storeForm.email,
        address: storeForm.address,
        owner_id: Number(storeForm.ownerId),
      });

      setSuccessMsg("Store created successfully!");
      setStoreForm({
        name: "",
        email: "",
        address: "",
        ownerId: "",
      });

      await fetchDashboard();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create store.");
    } finally {
      setStoreSubmitting(false);
    }
  };

  const ownerOptions = useMemo(() => {
    return users.filter((u) => u.role === "owner");
  }, [users]);

  return (
    <PageLayout role={role} onLogout={logoutUser}>
      <div className="stack">
        <div className="pageHeader">
          <h1>Admin Command Panel</h1>
          <p className="muted">Monitor statistics, manage users, and configure stores.</p>
        </div>

        {error && <div className="alert alert--error">{error}</div>}
        {successMsg && <div className="alert alert--success">{successMsg}</div>}

        {loading ? (
          <LoadingSpinner label="Compiling dashboard records..." />
        ) : (
          <>
            <section className="cards">
              <div className="card">
                <div className="card__value">{stats.totalUsers}</div>
                <div className="card__label">Total Registered Users</div>
              </div>
              <div className="card">
                <div className="card__value">{stats.totalStores}</div>
                <div className="card__label">Total Configured Stores</div>
              </div>
              <div className="card">
                <div className="card__value">{stats.totalRatings}</div>
                <div className="card__label">Total Submitted Ratings</div>
              </div>
            </section>

            <div className="grid2">
              <section className="panel">
                <div className="panel__header">
                  <h2>User Accounts</h2>
                </div>
                <div className="tableWrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? (
                        users.map((u) => (
                          <tr key={u.id}>
                            <td style={{ fontWeight: "600" }}>{u.id}</td>
                            <td style={{ color: "var(--text-primary)", fontWeight: "500" }}>
                              {u.name || "-"}
                            </td>
                            <td>{u.email || "-"}</td>
                            <td>
                              <span
                                style={{
                                  padding: "4px 10px",
                                  borderRadius: "12px",
                                  fontSize: "0.75rem",
                                  fontWeight: "700",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.05em",
                                  backgroundColor:
                                    u.role === "admin"
                                      ? "#fef3c7"
                                      : u.role === "owner"
                                      ? "#e0f2fe"
                                      : "#f1f5f9",
                                  color:
                                    u.role === "admin"
                                      ? "#92400e"
                                      : u.role === "owner"
                                      ? "#0369a1"
                                      : "#475569",
                                  border:
                                    u.role === "admin"
                                      ? "1px solid #fde68a"
                                      : u.role === "owner"
                                      ? "1px solid #bae6fd"
                                      : "1px solid #e2e8f0",
                                }}
                              >
                                {u.role}
                              </span>
                            </td>
                            <td>{u.address || "-"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="tableEmpty">
                            No user records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="panel">
                <div className="panel__header">
                  <h2>Stores & Owners</h2>
                </div>
                <div className="tableWrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Store Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Assigned Owner</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stores.length > 0 ? (
                        stores.map((s) => (
                          <tr key={s.id}>
                            <td style={{ fontWeight: "600" }}>{s.id}</td>
                            <td style={{ color: "var(--text-primary)", fontWeight: "500" }}>
                              {s.name || "-"}
                            </td>
                            <td>{s.email || "-"}</td>
                            <td>{s.address || "-"}</td>
                            <td>{s.owner_name || <span className="muted">None</span>}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="tableEmpty">
                            No store records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            <div className="grid2">
              <section className="panel">
                <div className="panel__header">
                  <h2>Create Store Owner</h2>
                </div>
                <form className="form" onSubmit={handleCreateOwner}>
                  <TextField
                    label="Owner Name"
                    placeholder="Enter owner name"
                    value={ownerForm.name}
                    onChange={(val) => setOwnerForm((p) => ({ ...p, name: val }))}
                    required
                  />
                  <TextField
                    label="Email Address"
                    type="email"
                    placeholder="owner@store.com"
                    value={ownerForm.email}
                    onChange={(val) => setOwnerForm((p) => ({ ...p, email: val }))}
                    required
                  />
                  <TextField
                    label="Address"
                    placeholder="Owner's address"
                    value={ownerForm.address}
                    onChange={(val) => setOwnerForm((p) => ({ ...p, address: val }))}
                    required
                  />
                  <PasswordField
                    label="Security Password"
                    placeholder="Set owner password"
                    value={ownerForm.password}
                    onChange={(val) => setOwnerForm((p) => ({ ...p, password: val }))}
                    required
                  />
                  <button className="btn btn--primary" type="submit" disabled={ownerSubmitting} style={{ alignSelf: "flex-start", marginTop: "10px" }}>
                    {ownerSubmitting ? "Creating..." : "Create Owner"}
                  </button>
                </form>
              </section>

              <section className="panel">
                <div className="panel__header">
                  <h2>Create Store</h2>
                </div>
                <form className="form" onSubmit={handleCreateStore}>
                  <TextField
                    label="Store Name"
                    placeholder="Enter store name"
                    value={storeForm.name}
                    onChange={(val) => setStoreForm((p) => ({ ...p, name: val }))}
                    required
                  />
                  <TextField
                    label="Store Email"
                    type="email"
                    placeholder="contact@store.com"
                    value={storeForm.email}
                    onChange={(val) => setStoreForm((p) => ({ ...p, email: val }))}
                    required
                  />
                  <TextField
                    label="Store Address"
                    placeholder="Store physical location"
                    value={storeForm.address}
                    onChange={(val) => setStoreForm((p) => ({ ...p, address: val }))}
                    required
                  />
                  
                  <label className="field">
                    <span className="field__label">Assign Owner</span>
                    <select
                      className="field__input"
                      value={storeForm.ownerId}
                      onChange={(e) => setStoreForm((p) => ({ ...p, ownerId: e.target.value }))}
                      required
                    >
                      <option value="">Select store owner</option>
                      {ownerOptions.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.name} ({o.email})
                        </option>
                      ))}
                    </select>
                  </label>

                  <button className="btn btn--primary" type="submit" disabled={storeSubmitting} style={{ alignSelf: "flex-start", marginTop: "10px" }}>
                    {storeSubmitting ? "Creating..." : "Create Store"}
                  </button>
                </form>
              </section>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}

export default AdminDashboard;

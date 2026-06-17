import { useEffect, useState, useMemo } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import PageLayout from "../layouts/PageLayout";
import LoadingSpinner from "../components/LoadingSpinner";

function OwnerDashboard() {
  const { role, logoutUser } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [profile, setProfile] = useState({
    store_name: "",
    email: "",
    address: "",
    average_rating: 0,
  });
  
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        setError("");
        
        const [profileRes, dashRes] = await Promise.all([
          api.get("/stores/owner-profile"),
          api.get("/stores/owner-dashboard"),
        ]);
        
        if (profileRes.data) {
          setProfile(profileRes.data);
        }
        
        if (Array.isArray(dashRes.data)) {
          setReviews(dashRes.data);
        }
      } catch (err) {
        console.error("Failed to load owner dashboard", err);
        setError("Failed to fetch store details. Please verify database connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerData();
  }, []);

  const activeReviews = useMemo(() => {
    return reviews.filter((r) => r.user_name !== null && r.rating !== null);
  }, [reviews]);

  const avgRating = profile.average_rating ?? 0;

  return (
    <PageLayout role={role} onLogout={logoutUser}>
      <div className="stack">
        <div className="pageHeader">
          <h1>Store Analytics</h1>
          <p className="muted">Track customer satisfaction and review feedback logs.</p>
        </div>

        {error && <div className="alert alert--error">{error}</div>}

        {loading ? (
          <LoadingSpinner label="Retrieving store performance metrics..." />
        ) : (
          <>
            <section className="cards">
              <div className="card">
                <div className="card__value" style={{ fontSize: "1.5rem", color: "var(--text-primary)", fontWeight: "600" }}>
                  {profile.store_name || "My Store"}
                </div>
                <div className="card__label">Store Name</div>
              </div>
              <div className="card">
                <div className="card__value" style={{ color: "var(--primary)" }}>
                  ⭐ {Number(avgRating).toFixed(1)} / 5.0
                </div>
                <div className="card__label">Average Store Rating</div>
              </div>
              <div className="card">
                <div className="card__value" style={{ fontSize: "1.1rem", wordBreak: "break-word", color: "var(--text-secondary)" }}>
                  {profile.email || "No contact email"}
                </div>
                <div className="card__label">Store Contact Email</div>
              </div>
            </section>

            <section className="panel">
              <div className="panel__header">
                <h2>Customer Ratings & Reviews</h2>
              </div>
              
              <div className="tableWrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>User Name</th>
                      <th>Rating Score</th>
                      <th>Feedback Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeReviews.length > 0 ? (
                      activeReviews.map((rev, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: "600", color: "var(--text-primary)" }}>
                            {rev.user_name}
                          </td>
                          <td>
                            <div className="ratingBadge">
                              ⭐ {rev.rating} / 5
                            </div>
                          </td>
                          <td>
                            <span
                              style={{
                                padding: "4px 10px",
                                borderRadius: "12px",
                                fontSize: "0.75rem",
                                fontWeight: "700",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                display: "inline-block",
                                backgroundColor:
                                  rev.rating >= 4
                                    ? "var(--success-bg)"
                                    : rev.rating === 3
                                    ? "#fef3c7"
                                    : "var(--error-bg)",
                                color:
                                  rev.rating >= 4
                                    ? "var(--success-text)"
                                    : rev.rating === 3
                                    ? "#92400e"
                                    : "var(--error-text)",
                                border:
                                  rev.rating >= 4
                                    ? "1px solid var(--success-border)"
                                    : rev.rating === 3
                                    ? "1px solid #fde68a"
                                    : "1px solid var(--error-border)",
                              }}
                            >
                              {rev.rating >= 4
                                ? "Excellent"
                                : rev.rating === 3
                                ? "Average"
                                : "Needs Improvement"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="tableEmpty">
                          No customer ratings have been submitted for this store yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </PageLayout>
  );
}

export default OwnerDashboard;
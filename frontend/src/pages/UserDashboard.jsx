import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import PageLayout from "../layouts/PageLayout";
import LoadingSpinner from "../components/LoadingSpinner";

function UserDashboard() {
  const { role, logoutUser } = useAuth();
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [selectedRatings, setSelectedRatings] = useState({});
  const [feedback, setFeedback] = useState({ type: "", message: "", storeId: null });

  const fetchStores = async (searchTerm = "") => {
    try {
      const res = await api.get(`/stores?search=${searchTerm}`);
      setStores(res.data || []);
    } catch (error) {
      console.error("Failed to load stores", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearch(term);
    fetchStores(term);
  };

  const handleSelectRating = (storeId, value) => {
    setSelectedRatings((prev) => ({
      ...prev,
      [storeId]: Number(value),
    }));
  };

  const handleRatingAction = async (storeId, actionType) => {
    const rating = selectedRatings[storeId];
    if (!rating) {
      setFeedback({
        type: "error",
        message: "Please select a rating score between 1 and 5.",
        storeId,
      });
      return;
    }

    setFeedback({ type: "", message: "", storeId: null });

    try {
      const endpoint = actionType === "submit" ? "/ratings/submit" : "/ratings/update";
      const method = actionType === "submit" ? api.post : api.put;

      const res = await method(endpoint, {
        store_id: storeId,
        rating: rating,
      });

      setFeedback({
        type: "success",
        message: res.data?.message || "Rating saved successfully!",
        storeId,
      });

      await fetchStores(search);
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.response?.data?.message || "Something went wrong.",
        storeId,
      });
    }
  };

  return (
    <PageLayout role={role} onLogout={logoutUser}>
      <div className="stack">
        <div className="pageHeader">
          <h1>Explore Stores</h1>
          <p className="muted">Find stores and submit or update your ratings below.</p>
        </div>

        <div className="searchBox">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            className="searchBox__input"
            type="text"
            placeholder="Search stores by name or address..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        {loading ? (
          <LoadingSpinner label="Loading stores..." />
        ) : (
          <section className="panel" style={{ padding: "0", overflow: "hidden" }}>
            <div className="tableWrap" style={{ border: "none", boxShadow: "none" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Store Name</th>
                    <th>Address</th>
                    <th>Average Rating</th>
                    <th>Your Selection</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.length > 0 ? (
                    stores.map((store) => (
                      <tr key={store.id}>
                        <td style={{ fontWeight: "600", color: "var(--text-primary)" }}>
                          {store.name}
                        </td>
                        <td>{store.address}</td>
                        <td>
                          <div className="ratingBadge">
                            ⭐ {store.average_rating ? Number(store.average_rating).toFixed(1) : "0.0"} / 5.0
                          </div>
                        </td>
                        <td>
                          <select
                            className="field__input ratingSelect"
                            value={selectedRatings[store.id] || ""}
                            onChange={(e) => handleSelectRating(store.id, e.target.value)}
                          >
                            <option value="">Select</option>
                            <option value="1">1 Star</option>
                            <option value="2">2 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="5">5 Stars</option>
                          </select>
                        </td>
                        <td>
                          <div className="actionsRow">
                            <button
                              className="btn btn--primary btn--sm"
                              onClick={() => handleRatingAction(store.id, "submit")}
                            >
                              Submit Rating
                            </button>
                            <button
                              className="btn btn--secondary btn--sm"
                              onClick={() => handleRatingAction(store.id, "update")}
                            >
                              Update Rating
                            </button>
                          </div>
                          
                          {feedback.storeId === store.id && feedback.message && (
                            <div
                              className={`alert alert--${feedback.type}`}
                              style={{ marginTop: "10px", padding: "6px 12px", fontSize: "0.8rem" }}
                            >
                              {feedback.message}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="tableEmpty">
                        No stores match your search query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </PageLayout>
  );
}

export default UserDashboard;
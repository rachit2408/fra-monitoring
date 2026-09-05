import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function StateAnalytics() {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // FETCH ALL STATES
  // --------------------------------------------------

  useEffect(() => {
    fetch(`${API_URL}/states`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch states");
        }

        return response.json();
      })
      .then((data) => {
        setStates(data);

        if (data.length > 0) {
          setSelectedState(data[0].state);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  // --------------------------------------------------
  // FETCH SELECTED STATE
  // --------------------------------------------------

  useEffect(() => {
    if (!selectedState) return;

    fetch(
      `${API_URL}/states/${encodeURIComponent(selectedState)}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch state statistics");
        }

        return response.json();
      })
      .then((data) => {
        setStats(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [selectedState]);

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <section className="state-intelligence">
        <div className="state-loading">
          Loading state intelligence...
        </div>
      </section>
    );
  }

  if (!stats) {
    return null;
  }

  const approvalRate =
    stats.total_claims > 0
      ? (
          (stats.approved / stats.total_claims) *
          100
        ).toFixed(1)
      : 0;

  return (
    <section className="state-intelligence">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="state-intelligence-header">

        <div>
          <div className="section-eyebrow">
            GOVERNANCE INSIGHTS
          </div>

          <h2>
            State Intelligence
          </h2>

          <p>
            State-wise FRA implementation performance
          </p>
        </div>

        {/* STATE SELECTOR */}

        <div className="state-selector-wrapper">

          <label>
            SELECT STATE
          </label>

          <select
            value={selectedState}
            onChange={(e) =>
              setSelectedState(e.target.value)
            }
          >
            {states.map((state) => (
              <option
                key={state.state}
                value={state.state}
              >
                {state.state}
              </option>
            ))}
          </select>

        </div>

      </div>


      {/* ==========================================
          STATE TITLE
      ========================================== */}

      <div className="selected-state-banner">

        <div className="state-icon">
          📍
        </div>

        <div>
          <span>Currently viewing</span>

          <strong>
            {stats.state}
          </strong>
        </div>

      </div>


      {/* ==========================================
          STATISTICS
      ========================================== */}

      <div className="state-stats-grid">

        {/* TOTAL */}

        <div className="state-stat-card total-card">

          <div className="state-stat-top">
            <span className="state-stat-label">
              Total Claims
            </span>

            <div className="state-stat-icon">
              📋
            </div>
          </div>

          <strong>
            {stats.total_claims}
          </strong>

          <small>
            Registered claims
          </small>

        </div>


        {/* APPROVED */}

        <div className="state-stat-card approved-card">

          <div className="state-stat-top">
            <span className="state-stat-label">
              Approved
            </span>

            <div className="state-stat-icon">
              ✓
            </div>
          </div>

          <strong>
            {stats.approved}
          </strong>

          <small>
            Successfully approved
          </small>

        </div>


        {/* PENDING */}

        <div className="state-stat-card pending-card">

          <div className="state-stat-top">
            <span className="state-stat-label">
              Pending
            </span>

            <div className="state-stat-icon">
              ⏳
            </div>
          </div>

          <strong>
            {stats.pending}
          </strong>

          <small>
            Requires attention
          </small>

        </div>


        {/* UNDER VERIFICATION */}

        <div className="state-stat-card verification-card">

          <div className="state-stat-top">
            <span className="state-stat-label">
              Under Verification
            </span>

            <div className="state-stat-icon">
              🔍
            </div>
          </div>

          <strong>
            {stats.under_verification}
          </strong>

          <small>
            Currently being verified
          </small>

        </div>


        {/* REJECTED */}

        <div className="state-stat-card rejected-card">

          <div className="state-stat-top">
            <span className="state-stat-label">
              Rejected
            </span>

            <div className="state-stat-icon">
              ✕
            </div>
          </div>

          <strong>
            {stats.rejected}
          </strong>

          <small>
            Rejected claims
          </small>

        </div>

      </div>


      {/* ==========================================
          APPROVAL PERFORMANCE
      ========================================== */}

      <div className="state-performance">

        <div className="performance-info">

          <div>
            <span>
              Approval Performance
            </span>

            <h3>
              {approvalRate}%
            </h3>
          </div>

          <div className="performance-description">
            Approval rate for{" "}
            <strong>{stats.state}</strong>
          </div>

        </div>


        {/* PROGRESS BAR */}

        <div className="performance-bar">

          <div
            className="performance-fill"
            style={{
              width: `${approvalRate}%`,
            }}
          />

        </div>

        <div className="performance-footer">

          <span>
            0%
          </span>

          <span>
            Current approval rate
          </span>

          <span>
            100%
          </span>

        </div>

      </div>

    </section>
  );
}

export default StateAnalytics;
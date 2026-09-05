import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function ClaimDetails({ claim, onClose }) {
  const [anomaly, setAnomaly] = useState(null);
  const [anomalyLoading, setAnomalyLoading] = useState(true);
  const [anomalyError, setAnomalyError] = useState("");

  // ==================================================
  // FETCH ANOMALY INFORMATION
  // ==================================================

  useEffect(() => {
    if (!claim?.claim_id) {
      return;
    }

    setAnomalyLoading(true);
    setAnomalyError("");
    setAnomaly(null);

    fetch(
      `${API_URL}/claims/${claim.claim_id}/anomaly`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to check anomaly");
        }

        return response.json();
      })
      .then((data) => {
        setAnomaly(data);
        setAnomalyLoading(false);
      })
      .catch((error) => {
        console.error(error);

        setAnomalyError(
          "Unable to load AI risk assessment."
        );

        setAnomalyLoading(false);
      });
  }, [claim]);

  if (!claim) {
    return null;
  }

  // ==================================================
  // RISK CLASS
  // ==================================================

  const riskClass =
    anomaly?.risk_level
      ?.toLowerCase()
      .replace(/\s+/g, "-") || "normal";

  return (
    <div className="modal-overlay">

      <div className="claim-details-modal">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="modal-header">

          <div>
            <h2>Claim Details</h2>

            <p>
              Detailed FRA claim information
            </p>
          </div>

          <button
            className="close-button"
            onClick={onClose}
          >
            ✕
          </button>

        </div>


        {/* ==================================================
            CLAIM ID
        ================================================== */}

        <div className="claim-detail-id">
          {claim.claim_id}
        </div>


        {/* ==================================================
            DETAILS
        ================================================== */}

        <div className="details-grid">

          <div className="detail-item">
            <span>State</span>
            <strong>
              {claim.state || "—"}
            </strong>
          </div>

          <div className="detail-item">
            <span>District</span>
            <strong>
              {claim.district || "—"}
            </strong>
          </div>

          <div className="detail-item">
            <span>Claim Type</span>
            <strong>
              {claim.claim_type || "—"}
            </strong>
          </div>

          <div className="detail-item">
            <span>Status</span>

            <strong>
              <span
                className={`badge ${
                  claim.status
                    ?.toLowerCase()
                    .replace(/\s+/g, "-")
                }`}
              >
                {claim.status || "—"}
              </span>
            </strong>
          </div>

          <div className="detail-item">
            <span>Claimed Area</span>

            <strong>
              {claim.claimed_area ?? "—"} acres
            </strong>
          </div>

          <div className="detail-item">
            <span>Recorded Area</span>

            <strong>
              {claim.recorded_area ?? "—"} acres
            </strong>
          </div>

          <div className="detail-item">
            <span>Submission Date</span>

            <strong>
              {claim.submission_date || "—"}
            </strong>
          </div>

          <div className="detail-item">
            <span>Verification Date</span>

            <strong>
              {claim.verification_date || "—"}
            </strong>
          </div>

          <div className="detail-item">
            <span>Approval Date</span>

            <strong>
              {claim.approval_date || "—"}
            </strong>
          </div>

          <div className="detail-item">
            <span>Days Pending</span>

            <strong>
              {claim.days_pending ?? "—"}
            </strong>
          </div>

        </div>


        {/* ==================================================
            LOCATION
        ================================================== */}

        <div className="location-section">

          <h3>
            📍 Geographic Location
          </h3>

          <p>
            Latitude:{" "}
            {claim.latitude ?? "—"}
          </p>

          <p>
            Longitude:{" "}
            {claim.longitude ?? "—"}
          </p>

        </div>


        {/* ==================================================
            AI ANOMALY SECTION
        ================================================== */}

        <div className="ai-anomaly-section">

          <div className="ai-anomaly-header">

            <div>
              <h3>
                🤖 AI Risk Assessment
              </h3>

              <p>
                Automated claim consistency analysis
              </p>
            </div>

          </div>


          {/* LOADING */}

          {anomalyLoading && (

            <div className="anomaly-loading">
              🔄 Analyzing claim...
            </div>

          )}


          {/* ERROR */}

          {!anomalyLoading && anomalyError && (

            <div className="anomaly-error">
              ⚠️ {anomalyError}
            </div>

          )}


          {/* RESULT */}

          {!anomalyLoading &&
            !anomalyError &&
            anomaly && (

              <div>

                {/* RISK LEVEL */}

                <div
                  className={`risk-banner ${riskClass}`}
                >

                  <div className="risk-icon">

                    {anomaly.risk_level === "HIGH"
                      ? "🔴"
                      : anomaly.risk_level === "MEDIUM"
                      ? "🟠"
                      : "🟢"}

                  </div>

                  <div>

                    <span>
                      Risk Level
                    </span>

                    <strong>
                      {anomaly.risk_level}
                    </strong>

                  </div>

                </div>


                {/* NORMAL CLAIM */}

                {!anomaly.is_anomaly && (

                  <div className="no-anomaly">

                    <span className="success-icon">
                      ✓
                    </span>

                    <div>

                      <strong>
                        No Significant Anomaly
                      </strong>

                      <p>
                        This claim passed the
                        automated consistency checks.
                      </p>

                    </div>

                  </div>

                )}


                {/* ANOMALIES */}

                {anomaly.is_anomaly &&
                  anomaly.anomalies?.map(
                    (item, index) => (

                      <div
                        className={`anomaly-item ${
                          item.severity
                            ?.toLowerCase()
                        }`}
                        key={index}
                      >

                        <div className="anomaly-item-icon">
                          ⚠️
                        </div>

                        <div>

                          <strong>
                            {item.type}
                          </strong>

                          <span>
                            {item.severity}
                          </span>

                          <p>
                            {item.message}
                          </p>

                        </div>

                      </div>

                    )
                  )}


                {/* RECOMMENDATION */}

                <div className="recommendation-box">

                  <span>
                    💡 Recommended Action
                  </span>

                  <strong>
                    {anomaly.recommendation}
                  </strong>

                </div>

              </div>

            )}

        </div>


        {/* ==================================================
            FOOTER
        ================================================== */}

        <div className="modal-footer">

          <button
            className="close-modal-button"
            onClick={onClose}
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}

export default ClaimDetails;
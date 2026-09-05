import { useEffect, useState } from "react";
import "./App.css";

import MapView from "./MapView";
import ClaimDetails from "./ClaimDetails";
import StateAnalytics from "./StateAnalytics";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const API_URL = "http://127.0.0.1:8000";

function App() {

  // =========================================================
  // STATE
  // =========================================================

  const [claims, setClaims] = useState([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const limit = 20;
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] =
    useState("All States");

  const [selectedStatus, setSelectedStatus] =
    useState("All Status");

  const [selectedClaim, setSelectedClaim] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =========================================================
  // FETCH CLAIMS
  // =========================================================

  useEffect(() => {

    setLoading(true);
    setError("");

    fetch(
      `${API_URL}/claims?page=${page}&limit=${limit}`
    )
      .then((response) => {

        if (!response.ok) {
          throw new Error(
            "Failed to fetch claims"
          );
        }

        return response.json();
      })

      .then((data) => {

        setClaims(data.claims || []);
        setTotal(data.total || 0);
        setTotalPages(
          data.total_pages || 1
        );

        setLoading(false);
      })

      .catch((err) => {

        console.error(err);

        setError(
          "Unable to connect to backend API"
        );

        setLoading(false);
      });

  }, [page]);


  // =========================================================
  // STATES FOR FILTER
  // =========================================================

  const states = [
    "All States",

    ...new Set(
      claims
        .map((claim) => claim.state)
        .filter(Boolean)
    ),
  ];


  // =========================================================
  // SEARCH + FILTER
  // =========================================================

  const filteredClaims = claims.filter(
    (claim) => {

      const search =
        searchTerm
          .toLowerCase()
          .trim();

      const matchesSearch =
        search === "" ||
        claim.claim_id
          ?.toLowerCase()
          .includes(search) ||
        claim.state
          ?.toLowerCase()
          .includes(search) ||
        claim.district
          ?.toLowerCase()
          .includes(search);

      const matchesState =
        selectedState === "All States" ||
        claim.state === selectedState;

      const matchesStatus =
        selectedStatus === "All Status" ||
        claim.status === selectedStatus;

      return (
        matchesSearch &&
        matchesState &&
        matchesStatus
      );
    }
  );


  // =========================================================
  // STATISTICS
  // =========================================================

  const approved = claims.filter(
    (claim) =>
      claim.status === "Approved"
  ).length;

  const pending = claims.filter(
    (claim) =>
      claim.status === "Pending" ||
      claim.status ===
        "Under Verification"
  ).length;

  const rejected = claims.filter(
    (claim) =>
      claim.status === "Rejected"
  ).length;


  // =========================================================
  // STATUS PIE CHART
  // =========================================================

  const statusData = [

    {
      name: "Approved",
      value: approved,
    },

    {
      name: "Pending",
      value: pending,
    },

    {
      name: "Rejected",
      value: rejected,
    },

  ];


  const STATUS_COLORS = [
    "#16a34a",
    "#f59e0b",
    "#ef4444",
  ];


  // =========================================================
  // STATE CHART
  // =========================================================

  const stateCounts = {};

  claims.forEach((claim) => {

    if (claim.state) {

      stateCounts[claim.state] =
        (stateCounts[claim.state] || 0) +
        1;

    }

  });


  const stateData =
    Object.entries(stateCounts).map(
      ([state, count]) => ({
        state,
        claims: count,
      })
    );


  // =========================================================
  // CLAIM TYPE CHART
  // =========================================================

  const typeCounts = {};

  claims.forEach((claim) => {

    if (claim.claim_type) {

      typeCounts[claim.claim_type] =
        (typeCounts[claim.claim_type] || 0) +
        1;

    }

  });


  const typeData =
    Object.entries(typeCounts).map(
      ([type, count]) => ({

        type:
          type.length > 25
            ? type.substring(0, 25) + "..."
            : type,

        claims: count,

      })
    );


  // =========================================================
  // APPROVAL RATE
  // =========================================================

  const approvalRate =
    claims.length > 0
      ? (
          (approved /
            claims.length) *
          100
        ).toFixed(1)
      : 0;


  // =========================================================
  // PAGINATION
  // =========================================================

  const goToNextPage = () => {

    if (page < totalPages) {

      setPage(page + 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    }

  };


  const goToPreviousPage = () => {

    if (page > 1) {

      setPage(page - 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    }

  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <div className="loading">
        Loading FRA Dashboard...
      </div>
    );

  }


  // =========================================================
  // ERROR
  // =========================================================

  if (error) {

    return (
      <div className="error">
        {error}
      </div>
    );

  }


  // =========================================================
  // DASHBOARD
  // =========================================================

  return (

    <div className="dashboard">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="header">

        <div>

          <h1>
            🌲 FRA Monitoring System
          </h1>

          <p>
            Forest Rights Act Decision
            Support Dashboard
          </p>

        </div>


        <div className="system-status">

          <span className="status-dot"></span>

          System Online

        </div>

      </header>



      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <section className="stats-grid">


        <div className="stat-card">

          <div className="stat-title">
            Total Claims
          </div>

          <div className="stat-value">
            {total}
          </div>

          <div className="stat-subtitle">
            Registered claims
          </div>

        </div>



        <div className="stat-card approved">

          <div className="stat-title">
            Approved
          </div>

          <div className="stat-value">
            {approved}
          </div>

          <div className="stat-subtitle">
            Current page
          </div>

        </div>



        <div className="stat-card pending">

          <div className="stat-title">
            Pending
          </div>

          <div className="stat-value">
            {pending}
          </div>

          <div className="stat-subtitle">
            Requires monitoring
          </div>

        </div>



        <div className="stat-card rejected">

          <div className="stat-title">
            Rejected
          </div>

          <div className="stat-value">
            {rejected}
          </div>

          <div className="stat-subtitle">
            Current page
          </div>

        </div>


      </section>



      {/* =====================================================
          MAP
      ===================================================== */}

      <section className="map-section">

        <h2>
          FRA Claims Map
        </h2>

        <p>
          Geographic distribution of
          registered FRA claims
        </p>

        <MapView claims={claims} />

      </section>



      {/* =====================================================
          CLAIMS SECTION
      ===================================================== */}

      <section className="table-section">


        <div className="section-header">

          <div>

            <h2>
              FRA Claims
            </h2>

            <p>
              Claims retrieved from the
              monitoring system
            </p>

          </div>

        </div>



        {/* ===================================================
            FILTERS
        =================================================== */}

        <div className="filters">


          {/* SEARCH */}

          <div className="search-box">

            <span className="search-icon">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search Claim ID, State, District..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />

          </div>



          {/* STATE */}

          <select
            value={selectedState}
            onChange={(e) => {

              setSelectedState(
                e.target.value
              );

              setPage(1);

            }}
          >

            {states.map((state) => (

              <option
                key={state}
                value={state}
              >
                {state}
              </option>

            ))}

          </select>



          {/* STATUS */}

          <select
            value={selectedStatus}
            onChange={(e) => {

              setSelectedStatus(
                e.target.value
              );

              setPage(1);

            }}
          >

            <option value="All Status">
              All Status
            </option>

            <option value="Approved">
              Approved
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Under Verification">
              Under Verification
            </option>

            <option value="Rejected">
              Rejected
            </option>

          </select>


        </div>



        {/* ===================================================
            RESULT COUNT
        =================================================== */}

        <div className="result-count">

          Showing{" "}
          {filteredClaims.length}{" "}
          of{" "}
          {claims.length}{" "}
          claims

          {" • "}

          Page {page} of {totalPages}

        </div>



        {/* ===================================================
            TABLE
        =================================================== */}

        <div className="table-container">

          <table>

            <thead>

              <tr>

                <th>
                  Claim ID
                </th>

                <th>
                  State
                </th>

                <th>
                  District
                </th>

                <th>
                  Claim Type
                </th>

                <th>
                  Area (Acres)
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredClaims.length >
              0 ? (

                filteredClaims.map(
                  (claim) => (

                    <tr
                      key={
                        claim.claim_id
                      }

                      onClick={() =>
                        setSelectedClaim(
                          claim
                        )
                      }

                      className="clickable-row"
                    >

                      <td className="claim-id">

                        {claim.claim_id}

                      </td>


                      <td>
                        {claim.state}
                      </td>


                      <td>
                        {claim.district}
                      </td>


                      <td>
                        {claim.claim_type}
                      </td>


                      <td>
                        {claim.claimed_area}
                      </td>


                      <td>

                        <span
                          className={`badge ${claim.status
                            ?.toLowerCase()
                            .replace(
                              /\s+/g,
                              "-"
                            )}`}
                        >
                          {claim.status}
                        </span>

                      </td>


                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="no-results"
                  >
                    No claims found
                    matching your
                    filters.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>



        {/* ===================================================
            PAGINATION
        =================================================== */}

        <div className="pagination">


          <button
            onClick={
              goToPreviousPage
            }
            disabled={
              page === 1
            }
          >
            ← Previous
          </button>


          <span>
            Page {page} of{" "}
            {totalPages}
          </span>


          <button
            onClick={
              goToNextPage
            }
            disabled={
              page === totalPages
            }
          >
            Next →
          </button>


        </div>


      </section>



      {/* =====================================================
          DECISION ANALYTICS
      ===================================================== */}

      <section className="analytics-section">


        <div className="section-header">

          <div>

            <h2>
              Decision Analytics
            </h2>

            <p>
              Statistical overview of
              FRA claim implementation
            </p>

          </div>

        </div>



        {/* ANALYTICS SUMMARY */}

        <div className="analytics-summary">


          <div className="analytics-card">

            <span>
              Approval Rate
            </span>

            <strong>
              {approvalRate}%
            </strong>

            <small>
              Based on current page
            </small>

          </div>



          <div className="analytics-card">

            <span>
              Approved Claims
            </span>

            <strong>
              {approved}
            </strong>

            <small>
              Successfully approved
            </small>

          </div>



          <div className="analytics-card">

            <span>
              Pending Claims
            </span>

            <strong>
              {pending}
            </strong>

            <small>
              Require monitoring
            </small>

          </div>


        </div>



        {/* ===================================================
            CHARTS
        =================================================== */}

        <div className="charts-row">


          {/* STATUS PIE */}

          <div className="chart-card">

            <h3>
              Claims by Status
            </h3>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <PieChart>

                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  label
                >

                  {statusData.map(
                    (entry, index) => (

                      <Cell
                        key={`cell-${index}`}
                        fill={
                          STATUS_COLORS[
                            index
                          ]
                        }
                      />

                    )
                  )}

                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>



          {/* STATE BAR */}

          <div className="chart-card">

            <h3>
              Claims by State
            </h3>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <BarChart
                data={stateData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 60,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="state"
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="claims"
                  fill="#3b82f6"
                  radius={[
                    6,
                    6,
                    0,
                    0,
                  ]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>


        </div>



        {/* ===================================================
            CLAIM TYPE CHART
        =================================================== */}

        <div className="chart-card full-width-chart">

          <h3>
            Claims by Type
          </h3>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <BarChart
              data={typeData}
              layout="vertical"
              margin={{
                top: 10,
                right: 30,
                left: 120,
                bottom: 10,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                type="number"
              />

              <YAxis
                type="category"
                dataKey="type"
                width={120}
              />

              <Tooltip />

              <Bar
                dataKey="claims"
                fill="#8b5cf6"
                radius={[
                  0,
                  6,
                  6,
                  0,
                ]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>


      </section>



      {/* =====================================================
          STEP 15 — STATE INTELLIGENCE
      ===================================================== */}

      <StateAnalytics />



      {/* =====================================================
          CLAIM DETAILS MODAL
      ===================================================== */}

      {selectedClaim && (

        <ClaimDetails
          claim={selectedClaim}
          onClose={() =>
            setSelectedClaim(null)
          }
        />

      )}


    </div>

  );
}

export default App;
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

function Analytics({ claims }) {

  // -----------------------------
  // STATUS DATA
  // -----------------------------

  const approved = claims.filter(
    (claim) => claim.status === "Approved"
  ).length;

  const pending = claims.filter(
    (claim) => claim.status === "Pending"
  ).length;

  const rejected = claims.filter(
    (claim) => claim.status === "Rejected"
  ).length;

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


  // -----------------------------
  // STATE DATA
  // -----------------------------

  const stateCounts = {};

  claims.forEach((claim) => {

    if (!claim.state) return;

    stateCounts[claim.state] =
      (stateCounts[claim.state] || 0) + 1;

  });

  const stateData = Object.entries(stateCounts)
    .map(([state, count]) => ({
      state,
      claims: count,
    }))
    .sort((a, b) => b.claims - a.claims);


  // -----------------------------
  // CLAIM TYPE DATA
  // -----------------------------

  const claimTypeCounts = {};

  claims.forEach((claim) => {

    if (!claim.claim_type) return;

    claimTypeCounts[claim.claim_type] =
      (claimTypeCounts[claim.claim_type] || 0) + 1;

  });

  const claimTypeData = Object.entries(claimTypeCounts)
    .map(([type, count]) => ({
      name: type,
      value: count,
    }));


  // -----------------------------
  // APPROVAL RATE
  // -----------------------------

  const approvalRate =
    claims.length > 0
      ? ((approved / claims.length) * 100).toFixed(1)
      : 0;


  return (
    <section className="analytics-section">

      <div className="section-header">

        <div>

          <h2>Decision Analytics</h2>

          <p>
            Statistical overview of FRA claim implementation
          </p>

        </div>

      </div>


      {/* APPROVAL RATE */}

      <div className="analytics-summary">

        <div className="analytics-card">

          <div className="analytics-card-title">
            Approval Rate
          </div>

          <div className="analytics-card-value">
            {approvalRate}%
          </div>

          <div className="analytics-card-subtitle">
            Based on current claims
          </div>

        </div>


        <div className="analytics-card">

          <div className="analytics-card-title">
            Approved Claims
          </div>

          <div className="analytics-card-value">
            {approved}
          </div>

          <div className="analytics-card-subtitle">
            Successfully approved
          </div>

        </div>


        <div className="analytics-card">

          <div className="analytics-card-title">
            Pending Claims
          </div>

          <div className="analytics-card-value">
            {pending}
          </div>

          <div className="analytics-card-subtitle">
            Require monitoring
          </div>

        </div>

      </div>


      {/* CHARTS */}

      <div className="charts-grid">


        {/* STATUS PIE CHART */}

        <div className="chart-card">

          <h3>Claims by Status</h3>

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
                outerRadius={100}
                label
              >

                {statusData.map(
                  (entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                    />
                  )
                )}

              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>


        {/* STATE BAR CHART */}

        <div className="chart-card">

          <h3>Claims by State</h3>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart
              data={stateData}
            >

              <CartesianGrid />

              <XAxis
                dataKey="state"
                angle={-35}
                textAnchor="end"
                height={80}
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="claims"
                name="Claims"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>


        {/* CLAIM TYPE */}

        <div className="chart-card full-width">

          <h3>Claims by Type</h3>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart
              data={claimTypeData}
              layout="vertical"
              margin={{
                left: 40,
                right: 30,
              }}
            >

              <CartesianGrid />

              <XAxis type="number" />

              <YAxis
                type="category"
                dataKey="name"
                width={180}
              />

              <Tooltip />

              <Bar
                dataKey="value"
                name="Claims"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>


      </div>

    </section>
  );
}

export default Analytics;
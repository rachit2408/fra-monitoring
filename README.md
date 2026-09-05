# FRA Monitoring

## AI-Powered Decision Support System for Forest Rights Act Monitoring

FRA Monitoring is a web-based decision-support system designed to help monitor and analyze Forest Rights Act (FRA) claims using interactive maps, analytics, and automated anomaly detection.

The system provides a centralized interface for exploring FRA claims, identifying potentially problematic cases, monitoring state-wise progress, and supporting administrative decision-making.

---

## Problem Statement

Monitoring Forest Rights Act claims across multiple districts and states can involve large amounts of data related to claim status, processing time, land area, verification, and approval.

Manual monitoring makes it difficult to quickly identify:

- Delayed claims
- Land-area inconsistencies
- Missing verification information
- High-risk claims
- Districts with a large pending workload
- States with low approval rates

FRA Monitoring addresses this problem by combining GIS visualization, data analytics, and automated anomaly detection into a single decision-support platform.

---

## Objectives

The main objectives of the system are:

- Visualize FRA claims geographically
- Monitor claim processing status
- Identify potentially anomalous claims
- Classify claims according to risk level
- Provide state-wise and district-wise statistics
- Help administrators prioritize claims requiring attention
- Provide an interactive dashboard for FRA monitoring

---

## Key Features

### Interactive GIS Map

The system provides an interactive map for visualizing FRA claims geographically.

Users can view:

- Claim locations
- Claim status
- Claim information
- Anomaly information
- Geographic distribution of claims

---

### Monitoring Dashboard

The dashboard provides an overview of the current FRA claim dataset.

Key indicators include:

- Total claims
- Approved claims
- Pending claims
- Rejected claims
- Claims under verification
- Approval rate
- Pending rate
- Average processing time
- Anomaly information

---

### Anomaly Detection

The system automatically evaluates claims for potentially unusual conditions.

The current anomaly detection engine checks factors such as:

- Processing delays
- Land-area differences
- Missing verification information
- Missing verification records

The system generates explainable anomaly results instead of simply producing a numerical prediction.

---

### Risk Classification

Claims can be classified into different risk levels.

#### High Risk

High-risk claims require immediate officer review.

Examples include:

- Significant land-area mismatch
- Missing verification records
- Severe processing delays

#### Medium Risk

Medium-risk claims require additional verification.

Examples include:

- Extended processing time
- Moderate area variation
- Pending verification

#### Low Risk

Low-risk claims do not contain major detected anomalies and can continue through routine monitoring.

---

## System Architecture

The overall architecture of the system is:

```text
              FRA Claim Dataset
                     |
                     v
             FastAPI Backend
                     |
        +------------+------------+
        |            |            |
        v            v            v
     Claims       Statistics    Anomaly
     Service       Service       Engine
        |            |            |
        +------------+------------+
                     |
                     v
              React Frontend
                     |
       +-------------+-------------+
       |             |             |
       v             v             v
   GIS Map       Analytics      Claim Details
       |             |             |
       +-------------+-------------+
                     |
                     v
             Decision Support
```

---

## Technology Stack

### Frontend

- React.js
- Vite
- React Leaflet
- Leaflet
- Recharts
- Axios
- React Router
- CSS

### Backend

- Python
- FastAPI
- Pandas
- Uvicorn

### Data

- CSV
- GeoJSON
- Synthetic Forest Rights Act claim dataset
- Geographic coordinates for map visualization

---

## Project Structure

```text
fra-monitoring/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   │
│   │   ├── routes/
│   │   │   ├── claims.py
│   │   │   ├── stats.py
│   │   │   └── anomalies.py
│   │   │
│   │   └── services/
│   │       ├── data_service.py
│   │       └── anomaly_service.py
│   │
│   └── data/
│       ├── claims.csv
│       └── claims.geojson
│
├── frontend/
│   └── src/
│       ├── Analytics.jsx
│       ├── App.css
│       ├── App.jsx
│       ├── ClaimDetails.jsx
│       ├── MapView.jsx
│       ├── StateAnalytics.jsx
│       ├── index.css
│       └── main.jsx
│
├── scripts/
│   └── generate_mock_data.py
│
└── README.md
```

---

## Dataset

The project currently uses a synthetic dataset containing approximately 5,000 Forest Rights Act claims.

Each claim contains information such as:

- Claim ID
- State
- District
- Claim type
- Submission date
- Verification date
- Approval date
- Claim status
- Claimed land area
- Recorded land area
- Geographic coordinates
- Anomaly information

The dataset can be generated using:

```text
scripts/generate_mock_data.py
```

The dataset is intended for demonstration, testing, and hackathon purposes.

It does not represent actual government records or real beneficiaries.

---

## Getting Started

### Prerequisites

Make sure the following are installed:

- Python 3.10+
- Node.js 18+
- npm
- Git

---

## Clone the Repository

```bash
git clone https://github.com/rachit2408/fra-monitoring.git
cd fra-monitoring
```

---

## Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment.

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install the required dependencies:

```bash
pip install fastapi uvicorn pandas
```

Start the FastAPI server:

```bash
uvicorn app.main:app --reload
```

The backend will be available at:

```text
http://localhost:8000
```

FastAPI documentation will be available at:

```text
http://localhost:8000/docs
```

---

## Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## API Endpoints

### Health Check

```http
GET /health
```

Returns the current backend health status.

---

### Get Claims

```http
GET /claims
```

Returns FRA claims with pagination and filtering support.

Example:

```text
GET /claims?page=1&limit=20
```

---

### Get Individual Claim

```http
GET /claims/{claim_id}
```

Returns detailed information about a specific claim.

---

### Get Overall Statistics

```http
GET /stats
```

Returns overall monitoring statistics such as:

- Total claims
- Approved claims
- Pending claims
- Rejected claims
- Claims under verification
- Approval rate
- Pending rate
- Average processing time
- Total anomalies

---

### Get States

```http
GET /states
```

Returns state-level monitoring information.

---

### Get State Statistics

```http
GET /states/{state}
```

Returns detailed statistics for a particular state.

---

### Get District Statistics

```http
GET /districts/{district}
```

Returns district-level statistics.

---

### Analyze Claim Anomaly

```http
GET /claims/{claim_id}/anomaly
```

Analyzes a claim and returns detected anomalies, severity, and recommended action.

---

### Get Anomalies

```http
GET /anomalies
```

Returns claims that have been identified as potentially anomalous.

---

## Application Workflow

The system follows the following workflow:

```text
              FRA Claim Dataset
                     |
                     v
             Data Processing
                     |
                     v
             FastAPI Backend
                     |
          +----------+----------+
          |          |          |
          v          v          v
       Claims     Statistics  Anomaly
       Service     Service     Engine
          |          |          |
          +----------+----------+
                     |
                     v
              React Frontend
                     |
        +------------+------------+
        |            |            |
        v            v            v
      Map       Analytics      Claims
                               Explorer
        |            |            |
        +------------+------------+
                     |
                     v
             Decision Support
```

---

## Anomaly Detection

The system currently uses an explainable rule-based anomaly detection engine.

### Delayed Claims

Claims that remain pending for an unusually long period are flagged as potential processing delays.

```text
Pending Claim
      |
      v
Processing Time
      |
      v
Exceeds Threshold?
      |
     Yes
      |
      v
Delayed Claim
```

### Land Area Mismatch

The claimed land area is compared with the recorded land area.

```text
Claimed Area
      |
      v
Comparison
      |
      v
Recorded Area
      |
      v
Significant Difference?
      |
     Yes
      |
      v
Flag Anomaly
```

### Missing Verification Information

Claims that require verification but do not contain the expected verification information can be flagged for review.

### Missing Verification Records

Approved claims without the expected verification record can receive a high-risk classification.

---

## Decision Support

The system is designed to assist administrators and monitoring officers rather than replace human decision-making.

The dashboard helps identify:

- Districts with high pending claims
- States with low approval rates
- Claims requiring additional verification
- Potential land-record inconsistencies
- Delayed claims
- High-risk cases
- Areas requiring administrative attention

The final decision regarding any claim remains with the appropriate authority.

---

## GIS Visualization

The frontend uses Leaflet and React Leaflet to visualize claim locations on an interactive map.

The map provides:

- Claim markers
- Geographic distribution of claims
- Claim status information
- Anomaly indicators
- Claim-level details

The GIS interface provides a geographic overview of FRA claim activity.

---

## Analytics Dashboard

The analytics section provides visual summaries of the dataset.

Current analytics include:

- Total claims
- Approved claims
- Pending claims
- Rejected claims
- Claims under verification
- Approval rate
- State-wise statistics
- District-level information
- Anomaly information

Charts are implemented using Recharts.

---

## State-wise Monitoring

The system provides state-level monitoring capabilities.

For each state, administrators can examine:

- Total claims
- Approved claims
- Pending claims
- Rejected claims
- Claims under verification
- Approval rate
- Processing information
- Anomaly information

This enables comparison between different regions and helps identify areas that may require additional attention.

---

## Claims Explorer

The Claims Explorer provides a searchable and filterable interface for examining individual FRA claims.

Users can:

- Search for claims
- Filter claims by state
- Filter claims by district
- Filter claims by status
- Navigate through claims using pagination
- Open detailed claim information

---

## Claim Details

Selecting a claim opens a detailed view containing information such as:

- Claim ID
- State
- District
- Claim type
- Status
- Claimed area
- Recorded area
- Submission date
- Verification date
- Approval date
- Anomaly status
- Risk level
- Recommended action

This allows monitoring officers to investigate individual cases.

---

## Future Enhancements

The current implementation provides a functional hackathon prototype. The following improvements can further strengthen the system:

### AI/ML-based Anomaly Detection

Integrate machine learning algorithms such as:

- Isolation Forest
- Local Outlier Factor
- Autoencoders
- Clustering-based anomaly detection

These models can identify unusual claim patterns that may not be captured by manually defined rules.

### AI-generated Claim Explanations

An LLM-based layer could generate human-readable explanations for why a claim was flagged.

Example:

```text
This claim has been flagged because:

1. Processing time exceeds the expected threshold.
2. Claimed area differs significantly from recorded land area.
3. Verification information is incomplete.

Recommended action:
Review the land records and verification documents.
```

### District Boundary Visualization

Add actual district boundaries and enable district-level choropleth maps.

This would allow users to visually identify regions with:

- High pending rates
- Low approval rates
- High anomaly density
- Long processing times

### Improved Geospatial Validation

Claim coordinates can be validated against their corresponding district boundaries to ensure that claims are geographically consistent with their assigned administrative regions.

### Time-Series Analysis

Add trend analysis for:

- Monthly claim submissions
- Monthly approvals
- Processing-time trends
- Pending claim trends
- Anomaly trends

### Land-use Intelligence

Additional land-use information can be incorporated to identify potential inconsistencies between:

- Claimed land
- Recorded land
- Forest boundaries
- Land-use classification

### Advanced Filtering

Add filters for:

- Risk level
- Anomaly type
- Processing duration
- Claim type
- Area mismatch
- Date range

### Role-based Access

Future versions could provide different interfaces for:

- District officers
- State officers
- Monitoring authorities
- Administrators

---

## Security and Production Considerations

This repository is intended as a prototype and is not designed for direct production deployment.

A production implementation should include:

- Authentication
- Role-based authorization
- Secure API configuration
- Database-backed storage
- Input validation
- HTTPS
- Audit logging
- Secure handling of government data
- Data encryption
- Access control
- Backup and recovery mechanisms

Actual FRA records should only be used with appropriate authorization and security controls.

---

## Disclaimer

This project is a hackathon prototype developed for demonstrating an AI-assisted Forest Rights Act monitoring and decision-support system.

The dataset used by the project is synthetic and does not represent actual government records.

The anomaly detection results are intended to assist monitoring and prioritization. They should not be treated as final legal, administrative, or governmental decisions.

---

## Hackathon Relevance

The project addresses the Forest Rights Act monitoring problem by combining:

- Geographic Information Systems
- Data analytics
- Automated anomaly detection
- Risk classification
- State and district monitoring
- Interactive dashboards
- Decision-support capabilities

The objective is to transform large volumes of FRA claim information into actionable insights that can help monitoring authorities identify delays, inconsistencies, and cases requiring further review.

---

## Intended Users

The system is designed as a decision-support prototype for:

- Government monitoring officers
- District-level administrators
- State-level authorities
- Forest rights monitoring teams
- Data analysts
- Policy researchers

---

## License

This project is developed for educational and hackathon purposes.

Add an appropriate open-source license to the repository if the project is intended to be publicly distributed or reused.

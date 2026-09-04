from pathlib import Path
import pandas as pd


# Find the project root:
# fra-monitoring/
#     backend/
#         app/
#             services/
#                 data_service.py
PROJECT_ROOT = Path(__file__).resolve().parents[3]

DATA_PATH = PROJECT_ROOT / "backend" / "data" / "claims.csv"


# Load the CSV only once when the backend starts.
df = pd.read_csv(DATA_PATH)

# Convert date columns to proper datetime values.
date_columns = [
    "submission_date",
    "verification_date",
    "approval_date",
]

for column in date_columns:
    if column in df.columns:
        df[column] = pd.to_datetime(
            df[column],
            errors="coerce"
        )


def get_dataframe():
    """Return the complete claims dataframe."""
    return df


def get_claim_by_id(claim_id: str):
    """Return one claim by claim ID."""

    result = df[df["claim_id"] == claim_id]

    if result.empty:
        return None

    return result.iloc[0].to_dict()
from fastapi import APIRouter, HTTPException
import pandas as pd

from app.services.data_service import get_dataframe


router = APIRouter(
    tags=["Statistics"]
)


@router.get("/stats")
def get_stats():

    df = get_dataframe()

    total = len(df)

    approved = int(
        (df["status"] == "Approved").sum()
    )

    pending = int(
        (df["status"] == "Pending").sum()
    )

    rejected = int(
        (df["status"] == "Rejected").sum()
    )

    under_verification = int(
        (df["status"] == "Under Verification").sum()
    )

    approval_rate = (
        round((approved / total) * 100, 2)
        if total
        else 0
    )

    pending_rate = (
        round((pending / total) * 100, 2)
        if total
        else 0
    )

    # Calculate processing time only for approved claims.
    approved_df = df[
        df["approval_date"].notna()
        & df["submission_date"].notna()
    ].copy()

    if not approved_df.empty:

        processing_days = (
            approved_df["approval_date"]
            - approved_df["submission_date"]
        ).dt.days

        average_processing_time = round(
            processing_days.mean(),
            2
        )

    else:
        average_processing_time = 0

    return {
        "total_claims": total,
        "approved": approved,
        "pending": pending,
        "rejected": rejected,
        "under_verification": under_verification,
        "approval_rate": approval_rate,
        "pending_rate": pending_rate,
        "average_processing_time_days": average_processing_time,

        # Will be connected to the anomaly engine in STEP 4.
        "total_anomalies": 0
    }


@router.get("/states")
def get_states():

    df = get_dataframe()

    grouped = (
        df.groupby("state")
        .agg(
            total_claims=("claim_id", "count"),
            approved=("status", lambda x: (x == "Approved").sum()),
            pending=("status", lambda x: (x == "Pending").sum()),
            rejected=("status", lambda x: (x == "Rejected").sum()),
            under_verification=(
                "status",
                lambda x: (x == "Under Verification").sum()
            )
        )
        .reset_index()
    )

    return grouped.to_dict(orient="records")


@router.get("/states/{state}")
def get_state_statistics(state: str):

    df = get_dataframe()

    state_df = df[
        df["state"].str.lower() == state.lower()
    ]

    if state_df.empty:
        raise HTTPException(
            status_code=404,
            detail=f"State '{state}' not found"
        )

    total = len(state_df)

    approved = int(
        (state_df["status"] == "Approved").sum()
    )

    pending = int(
        (state_df["status"] == "Pending").sum()
    )

    rejected = int(
        (state_df["status"] == "Rejected").sum()
    )

    under_verification = int(
        (state_df["status"] == "Under Verification").sum()
    )

    return {
        "state": state_df.iloc[0]["state"],
        "total_claims": total,
        "approved": approved,
        "pending": pending,
        "rejected": rejected,
        "under_verification": under_verification
    }


@router.get("/districts/{district}")
def get_district_statistics(district: str):

    df = get_dataframe()

    district_df = df[
        df["district"].str.lower() == district.lower()
    ]

    if district_df.empty:
        raise HTTPException(
            status_code=404,
            detail=f"District '{district}' not found"
        )

    total = len(district_df)

    approved = int(
        (district_df["status"] == "Approved").sum()
    )

    pending = int(
        (district_df["status"] == "Pending").sum()
    )

    rejected = int(
        (district_df["status"] == "Rejected").sum()
    )

    under_verification = int(
        (
            district_df["status"]
            == "Under Verification"
        ).sum()
    )

    return {
        "district": district_df.iloc[0]["district"],
        "state": district_df.iloc[0]["state"],
        "total_claims": total,
        "approved": approved,
        "pending": pending,
        "rejected": rejected,
        "under_verification": under_verification
    }
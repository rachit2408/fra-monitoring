from fastapi import APIRouter, HTTPException

from app.services.data_service import get_dataframe
from app.services.anomaly_service import detect_anomalies


router = APIRouter(
    tags=["Anomaly Detection"]
)


# ==================================================
# CHECK SINGLE CLAIM
# ==================================================

@router.get("/claims/{claim_id}/anomaly")
def get_claim_anomaly(claim_id: str):

    df = get_dataframe()

    claim_df = df[
        df["claim_id"].astype(str).str.lower()
        == claim_id.lower()
    ]

    if claim_df.empty:

        raise HTTPException(
            status_code=404,
            detail=f"Claim '{claim_id}' not found"
        )

    claim = claim_df.iloc[0].to_dict()

    result = detect_anomalies(claim)

    return {
        "claim_id": claim_id,
        **result
    }


# ==================================================
# CHECK ALL CLAIMS
# ==================================================

@router.get("/anomalies")
def get_all_anomalies():

    df = get_dataframe()

    anomalies = []

    for _, row in df.iterrows():

        claim = row.to_dict()

        result = detect_anomalies(claim)

        if result["is_anomaly"]:

            anomalies.append({
                "claim_id": claim.get(
                    "claim_id"
                ),
                "state": claim.get(
                    "state"
                ),
                "district": claim.get(
                    "district"
                ),
                "risk_level": result[
                    "risk_level"
                ],
                "anomalies": result[
                    "anomalies"
                ],
                "recommendation": result[
                    "recommendation"
                ]
            })

    return {
        "total_anomalies": len(anomalies),
        "anomalies": anomalies
    }
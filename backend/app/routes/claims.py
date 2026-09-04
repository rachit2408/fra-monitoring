from fastapi import APIRouter, HTTPException, Query
import math

from app.services.data_service import get_dataframe, get_claim_by_id


router = APIRouter(
    prefix="/claims",
    tags=["Claims"]
)


def clean_record(record):
    """
    Convert Pandas values into JSON-friendly Python values.
    """

    cleaned = {}

    for key, value in record.items():

        if hasattr(value, "isoformat"):
            cleaned[key] = value.isoformat()

        elif value is None:
            cleaned[key] = None

        elif isinstance(value, float) and math.isnan(value):
            cleaned[key] = None

        else:
            cleaned[key] = value

    return cleaned


@router.get("")
def get_claims(
    state: str | None = None,
    district: str | None = None,
    status: str | None = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    """
    Return paginated FRA claims with optional filters.
    """

    df = get_dataframe().copy()

    # State filter
    if state:
        df = df[
            df["state"].str.lower() == state.lower()
        ]

    # District filter
    if district:
        df = df[
            df["district"].str.lower() == district.lower()
        ]

    # Status filter
    if status:
        df = df[
            df["status"].str.lower() == status.lower()
        ]

    total = len(df)

    # Pagination
    start = (page - 1) * limit
    end = start + limit

    records = df.iloc[start:end]

    claims = [
        clean_record(record)
        for record in records.to_dict(orient="records")
    ]

    total_pages = math.ceil(total / limit) if total else 0

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": total_pages,
        "claims": claims
    }


@router.get("/{claim_id}")
def get_claim(claim_id: str):
    """
    Return details of one FRA claim.
    """

    claim = get_claim_by_id(claim_id)

    if claim is None:
        raise HTTPException(
            status_code=404,
            detail=f"Claim {claim_id} not found"
        )

    return clean_record(claim)
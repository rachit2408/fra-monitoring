import pandas as pd


def detect_anomalies(claim):
    """
    Detect potential anomalies in a single FRA claim.

    Returns:
        {
            "is_anomaly": True/False,
            "risk_level": "HIGH/MEDIUM/LOW",
            "anomalies": [],
            "recommendation": ""
        }
    """

    anomalies = []

    # --------------------------------------------------
    # 1. DELAYED CLAIM
    # --------------------------------------------------

    days_pending = claim.get("days_pending")

    if days_pending is not None:
        try:
            days_pending = float(days_pending)

            if days_pending > 365:
                anomalies.append({
                    "type": "Delayed Claim",
                    "severity": "HIGH",
                    "message": (
                        f"Claim has been pending for "
                        f"{int(days_pending)} days, exceeding "
                        f"the expected processing period."
                    )
                })

            elif days_pending > 180:
                anomalies.append({
                    "type": "Extended Processing",
                    "severity": "MEDIUM",
                    "message": (
                        f"Claim has been pending for "
                        f"{int(days_pending)} days."
                    )
                })

        except (ValueError, TypeError):
            pass


    # --------------------------------------------------
    # 2. AREA MISMATCH
    # --------------------------------------------------

    claimed_area = claim.get("claimed_area")
    recorded_area = claim.get("recorded_area")

    try:
        if (
            claimed_area is not None
            and recorded_area is not None
        ):

            claimed_area = float(claimed_area)
            recorded_area = float(recorded_area)

            if recorded_area > 0:

                difference = abs(
                    claimed_area - recorded_area
                )

                percentage_difference = (
                    difference / recorded_area
                ) * 100

                if percentage_difference > 30:

                    anomalies.append({
                        "type": "Land Area Mismatch",
                        "severity": "HIGH",
                        "message": (
                            f"Claimed area ({claimed_area:.2f} acres) "
                            f"differs significantly from the "
                            f"recorded area ({recorded_area:.2f} acres)."
                        )
                    })

                elif percentage_difference > 15:

                    anomalies.append({
                        "type": "Area Variation",
                        "severity": "MEDIUM",
                        "message": (
                            f"Claimed and recorded land areas "
                            f"show a {percentage_difference:.1f}% "
                            f"difference."
                        )
                    })

    except (ValueError, TypeError, ZeroDivisionError):
        pass


    # --------------------------------------------------
    # 3. MISSING VERIFICATION
    # --------------------------------------------------

    status = str(
        claim.get("status", "")
    ).strip()

    verification_date = claim.get(
        "verification_date"
    )

    if (
        status in [
            "Pending",
            "Under Verification"
        ]
        and pd.isna(verification_date)
    ):

        anomalies.append({
            "type": "Verification Pending",
            "severity": "MEDIUM",
            "message": (
                "Claim requires verification but "
                "no verification date has been recorded."
            )
        })


    # --------------------------------------------------
    # 4. APPROVED WITHOUT VERIFICATION
    # --------------------------------------------------

    if status == "Approved":

        if pd.isna(verification_date):

            anomalies.append({
                "type": "Missing Verification Record",
                "severity": "HIGH",
                "message": (
                    "Claim is marked as approved but "
                    "does not contain a verification record."
                )
            })


    # --------------------------------------------------
    # CALCULATE OVERALL RISK
    # --------------------------------------------------

    if not anomalies:

        return {
            "is_anomaly": False,
            "risk_level": "NORMAL",
            "anomalies": [],
            "recommendation": "No significant anomaly detected."
        }


    severity_levels = [
        anomaly["severity"]
        for anomaly in anomalies
    ]


    if "HIGH" in severity_levels:

        risk_level = "HIGH"

        recommendation = (
            "Immediate officer review recommended."
        )

    elif "MEDIUM" in severity_levels:

        risk_level = "MEDIUM"

        recommendation = (
            "Additional verification is recommended."
        )

    else:

        risk_level = "LOW"

        recommendation = (
            "Monitor this claim during routine review."
        )


    return {
        "is_anomaly": True,
        "risk_level": risk_level,
        "anomalies": anomalies,
        "recommendation": recommendation
    }
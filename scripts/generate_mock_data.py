import random
import json
from pathlib import Path
from datetime import datetime, timedelta

import pandas as pd

RANDOM_SEED = 42
NUM_CLAIMS = 5000

random.seed(RANDOM_SEED)

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "backend" / "data"

DATA_DIR.mkdir(parents=True, exist_ok=True)


locations = {
    "Madhya Pradesh": {
        "districts": ["Bhopal", "Balaghat", "Mandla", "Dindori"],
        "lat_range": (22.0, 24.5),
        "lon_range": (77.0, 81.0),
    },
    "Chhattisgarh": {
        "districts": ["Bastar", "Kanker", "Surguja", "Dantewada"],
        "lat_range": (18.0, 23.0),
        "lon_range": (80.0, 83.0),
    },
    "Odisha": {
        "districts": ["Koraput", "Mayurbhanj", "Keonjhar", "Sundargarh"],
        "lat_range": (18.5, 22.5),
        "lon_range": (83.0, 87.5),
    },
    "Jharkhand": {
        "districts": ["Ranchi", "Gumla", "Simdega", "West Singhbhum"],
        "lat_range": (22.0, 24.5),
        "lon_range": (84.0, 87.5),
    },
    "Maharashtra": {
        "districts": ["Gadchiroli", "Nandurbar", "Chandrapur", "Nashik"],
        "lat_range": (18.0, 22.0),
        "lon_range": (73.0, 81.0),
    },
    "Kerala": {
        "districts": ["Wayanad", "Palakkad", "Idukki", "Kannur"],
        "lat_range": (9.5, 12.5),
        "lon_range": (75.0, 77.5),
    },
}


def random_date(start_date, end_date):
    delta = end_date - start_date
    random_days = random.randint(0, delta.days)

    return start_date + timedelta(days=random_days)



statuses = [
    "Approved",
    "Pending",
    "Rejected",
    "Under Verification",
]

status_weights = [0.45, 0.25, 0.15, 0.15]

claim_types = [
    "Individual Forest Right",
    "Community Forest Right",
    "Community Forest Resource",
]

start_date = datetime(2022, 1, 1)
end_date = datetime(2026, 1, 1)
today = datetime(2026, 9, 4)


claims = []

for i in range(1, NUM_CLAIMS + 1):

    claim_id = f"FRA-{i:05d}"


    state = random.choice(list(locations.keys()))
    state_info = locations[state]

    district = random.choice(state_info["districts"])

    latitude = round(
        random.uniform(*state_info["lat_range"]),
        6
    )

    longitude = round(
        random.uniform(*state_info["lon_range"]),
        6
    )


    claimed_area = round(random.uniform(0.5, 15.0), 2)

    recorded_area = round(
        claimed_area * random.uniform(0.85, 1.15),
        2
    )


    submission_date = random_date(start_date, end_date)

    status = random.choices(
        statuses,
        weights=status_weights,
        k=1
    )[0]

    verification_date = None
    approval_date = None


    if status == "Approved":

        verification_date = submission_date + timedelta(
            days=random.randint(10, 120)
        )

        approval_date = verification_date + timedelta(
            days=random.randint(5, 90)
        )

    elif status == "Under Verification":

        verification_date = submission_date + timedelta(
            days=random.randint(10, 180)
        )

    if status in ["Pending", "Under Verification"]:
        days_pending = (today - submission_date).days
    else:
        days_pending = 0

    anomaly_category = random.choices(
        [
            "Normal",
            "Delayed Claim",
            "Land Record Mismatch",
            "Unusual Area",
        ],
        weights=[75, 10, 10, 5],
        k=1,
    )[0]

    anomaly_flag = False
    anomaly_type = "None"
    severity = "None"


    if anomaly_category == "Delayed Claim":

        anomaly_flag = True
        anomaly_type = "Delayed Processing"
        severity = random.choice(["Medium", "High"])

        status = random.choice(["Pending", "Under Verification"])

        submission_date = today - timedelta(
            days=random.randint(180, 700)
        )

        days_pending = (today - submission_date).days

    elif anomaly_category == "Land Record Mismatch":

        anomaly_flag = True
        anomaly_type = "Land Record Mismatch"
        severity = random.choice(["Medium", "High"])

        multiplier = random.choice([
            random.uniform(0.3, 0.6),
            random.uniform(1.5, 2.5),
        ])

        recorded_area = round(
            claimed_area * multiplier,
            2
        )

    elif anomaly_category == "Unusual Area":

        anomaly_flag = True
        anomaly_type = "Unusual Claim Area"
        severity = random.choice(["Medium", "High"])

        claimed_area = round(
            random.uniform(30, 100),
            2
        )

        recorded_area = round(
            claimed_area * random.uniform(0.85, 1.15),
            2
        )

    claims.append({
        "claim_id": claim_id,
        "state": state,
        "district": district,
        "latitude": latitude,
        "longitude": longitude,
        "claimed_area": claimed_area,
        "recorded_area": recorded_area,
        "submission_date": submission_date.strftime("%Y-%m-%d"),
        "verification_date": (
            verification_date.strftime("%Y-%m-%d")
            if verification_date else None
        ),
        "approval_date": (
            approval_date.strftime("%Y-%m-%d")
            if approval_date else None
        ),
        "status": status,
        "days_pending": days_pending,
        "claim_type": random.choice(claim_types),
        "anomaly_flag": anomaly_flag,
        "anomaly_type": anomaly_type,
        "severity": severity,
    })

df = pd.DataFrame(claims)

csv_path = DATA_DIR / "claims.csv"

df.to_csv(csv_path, index=False)


features = []

for claim in claims:

    features.append({
        "type": "Feature",

        "properties": {
            "claim_id": claim["claim_id"],
            "state": claim["state"],
            "district": claim["district"],
            "status": claim["status"],
            "claimed_area": claim["claimed_area"],
            "recorded_area": claim["recorded_area"],
            "anomaly_flag": claim["anomaly_flag"],
            "anomaly_type": claim["anomaly_type"],
            "severity": claim["severity"],
        },

        "geometry": {
            "type": "Point",

            "coordinates": [
                claim["longitude"],
                claim["latitude"],
            ],
        },
    })


geojson_data = {
    "type": "FeatureCollection",
    "features": features,
}


geojson_path = DATA_DIR / "claims.geojson"

with open(geojson_path, "w", encoding="utf-8") as file:
    json.dump(geojson_data, file, indent=2)


print("\n✅ Dataset generated successfully!")
print(f"📊 Total claims: {len(df)}")

print(f"\n📄 CSV file created:")
print(csv_path)

print(f"\n🗺️ GeoJSON file created:")
print(geojson_path)

print("\n📊 Status Distribution:")
print(df["status"].value_counts())

print("\n⚠️ Synthetic Anomaly Distribution:")
print(df["anomaly_type"].value_counts())
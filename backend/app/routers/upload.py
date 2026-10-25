import io
import os
import json
from pathlib import Path
from typing import List, Dict, Any
import pandas as pd
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import UploadResponse
import app.crud as crud
from app.config import settings

router = APIRouter(prefix="/api/upload", tags=["Upload"])

SAMPLE_DATA_PATH = Path(__file__).resolve().parent.parent / "sample_data" / "gaming_activity.csv"


def normalize_dataframe(df: pd.DataFrame) -> List[Dict[str, Any]]:
    # Map common alternative column headers to target schema names
    column_mapping = {
        "game": "title",
        "name": "title",
        "game_title": "title",
        "activity": "title",
        "genre": "category",
        "type": "category",
        "device": "platform",
        "system": "platform",
        "hours": "hours_played",
        "time_spent": "hours_played",
        "duration": "hours_played",
        "cost": "money_spent",
        "spent": "money_spent",
        "price": "money_spent",
        "score": "rating",
        "review": "rating",
        "comment": "notes",
        "description": "notes"
    }

    # Normalize existing column names: lowercase, strip, replace spaces/dashes with underscores
    df.columns = [str(c).strip().lower().replace(" ", "_").replace("-", "_") for c in df.columns]
    df = df.rename(columns=column_mapping)

    # Validate essential column
    if "title" not in df.columns:
        raise ValueError("Dataset missing required column: 'title' (or 'game', 'name')")

    # Ensure required columns exist with defaults
    if "category" not in df.columns:
        df["category"] = "Other"
    else:
        df["category"] = df["category"].fillna("Other").astype(str)

    if "platform" not in df.columns:
        df["platform"] = "PC"
    else:
        df["platform"] = df["platform"].fillna("PC").astype(str)

    if "date" not in df.columns:
        df["date"] = pd.Timestamp.now().date()
    else:
        df["date"] = pd.to_datetime(df["date"], errors="coerce")
        # Replace unparseable dates with today
        df["date"] = df["date"].fillna(pd.Timestamp.now()).dt.date

    if "hours_played" not in df.columns:
        df["hours_played"] = 0.0
    else:
        df["hours_played"] = pd.to_numeric(df["hours_played"], errors="coerce").fillna(0.0)

    if "money_spent" not in df.columns:
        df["money_spent"] = 0.0
    else:
        df["money_spent"] = pd.to_numeric(df["money_spent"], errors="coerce").fillna(0.0)

    if "rating" in df.columns:
        df["rating"] = pd.to_numeric(df["rating"], errors="coerce")
    else:
        df["rating"] = None

    if "notes" not in df.columns:
        df["notes"] = None
    else:
        df["notes"] = df["notes"].astype(str).replace({"nan": None, "None": None})

    # Drop records where title is empty or null
    df = df.dropna(subset=["title"])
    df["title"] = df["title"].astype(str).str.strip()
    df = df[df["title"] != ""]

    if df.empty:
        raise ValueError("No valid activity records found in the uploaded file.")

    records = []
    for _, row in df.iterrows():
        records.append({
            "title": str(row["title"])[:150],
            "category": str(row["category"])[:80],
            "platform": str(row["platform"])[:80],
            "date": row["date"],
            "hours_played": max(0.0, float(row["hours_played"])),
            "money_spent": max(0.0, float(row["money_spent"])),
            "rating": float(row["rating"]) if pd.notna(row["rating"]) else None,
            "notes": str(row["notes"])[:1000] if pd.notna(row["notes"]) and row["notes"] != "" else None
        })

    return records


@router.post("", response_model=UploadResponse)
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    filename = file.filename or "unknown"
    ext = os.path.splitext(filename)[1].lower()

    if ext not in [".csv", ".json"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Please upload a .csv or .json file."
        )

    content = await file.read()
    if len(content) > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB}MB."
        )

    try:
        if ext == ".csv":
            try:
                df = pd.read_csv(io.BytesIO(content), sep=None, engine="python")
            except Exception:
                df = pd.read_csv(io.BytesIO(content))
        else:
            raw_data = json.loads(content.decode("utf-8"))
            if isinstance(raw_data, dict):
                for key in ["activities", "data", "records", "items"]:
                    if key in raw_data and isinstance(raw_data[key], list):
                        raw_data = raw_data[key]
                        break
            if not isinstance(raw_data, list):
                raise ValueError("JSON file must contain an array of activity objects.")
            df = pd.DataFrame(raw_data)

        records = normalize_dataframe(df)
        inserted_count = crud.bulk_create_activities(db, records)
        batch = crud.create_import_batch(
            db=db,
            filename=filename,
            file_format=ext.replace(".", ""),
            records_count=inserted_count
        )

        return UploadResponse(
            success=True,
            message=f"Successfully imported {inserted_count} activities from {filename}.",
            filename=filename,
            imported_records=inserted_count,
            batch_id=batch.id
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to process file: {str(e)}"
        )


@router.post("/load-sample", response_model=UploadResponse)
def load_sample_dataset(db: Session = Depends(get_db)):
    if not SAMPLE_DATA_PATH.exists():
        raise HTTPException(status_code=404, detail="Sample dataset file not found on server.")

    try:
        df = pd.read_csv(SAMPLE_DATA_PATH)
        records = normalize_dataframe(df)
        inserted_count = crud.bulk_create_activities(db, records)
        batch = crud.create_import_batch(
            db=db,
            filename="gaming_activity_sample.csv",
            file_format="csv",
            records_count=inserted_count
        )
        return UploadResponse(
            success=True,
            message=f"Successfully loaded {inserted_count} sample records into dashboard.",
            filename="gaming_activity_sample.csv",
            imported_records=inserted_count,
            batch_id=batch.id
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error loading sample dataset: {str(e)}"
        )

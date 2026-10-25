"""API router for activity management operations.

Provides REST endpoints for querying, creating, updating, and deleting
gaming activity sessions and purchases.
"""

from datetime import date
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import ActivityResponse, ActivityCreate, ActivityUpdate, DeleteAllResponse
import app.crud as crud

router = APIRouter(prefix="/api/activities", tags=["Activities"])


@router.get("", response_model=Dict[str, Any], summary="List activity records with pagination and filters")
def read_activities(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(25, ge=1, le=100, description="Maximum number of records to return"),
    search: Optional[str] = Query(None, description="Substring search on game title"),
    category: Optional[str] = Query(None, description="Filter by genre/category"),
    platform: Optional[str] = Query(None, description="Filter by hardware platform"),
    start_date: Optional[date] = Query(None, description="Filter records on or after date"),
    end_date: Optional[date] = Query(None, description="Filter records on or before date"),
    db: Session = Depends(get_db)
):
    """Retrieve a paginated collection of activity records matching optional criteria."""
    items, total = crud.get_activities(
        db,
        skip=skip,
        limit=limit,
        search=search,
        category=category,
        platform=platform,
        start_date=start_date,
        end_date=end_date
    )
    return {
        "items": [ActivityResponse.model_validate(item) for item in items],
        "total": total,
        "skip": skip,
        "limit": limit
    }


@router.post("", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED, summary="Create a new activity entry")
def create_new_activity(
    activity_in: ActivityCreate,
    db: Session = Depends(get_db)
):
    """Create and persist a new activity session or expenditure record."""
    return crud.create_activity(db, activity_in)


@router.get("/{activity_id}", response_model=ActivityResponse, summary="Get single activity record")
def read_single_activity(
    activity_id: int,
    db: Session = Depends(get_db)
):
    """Fetch an individual activity record by its primary key ID."""
    activity = crud.get_activity_by_id(db, activity_id)
    if not activity:
        raise HTTPException(status_code=404, detail="Activity record not found")
    return activity


@router.put("/{activity_id}", response_model=ActivityResponse, summary="Update an existing activity record")
def update_existing_activity(
    activity_id: int,
    activity_update: ActivityUpdate,
    db: Session = Depends(get_db)
):
    """Apply partial or full updates to an activity record."""
    updated = crud.update_activity(db, activity_id, activity_update)
    if not updated:
        raise HTTPException(status_code=404, detail="Activity record not found")
    return updated


@router.delete("/{activity_id}", status_code=status.HTTP_200_OK, summary="Delete an activity record")
def delete_single_activity(
    activity_id: int,
    db: Session = Depends(get_db)
):
    """Delete a specific activity record by its primary key ID."""
    success = crud.delete_activity(db, activity_id)
    if not success:
        raise HTTPException(status_code=404, detail="Activity record not found")
    return {"success": True, "message": f"Activity {activity_id} successfully deleted"}


@router.delete("", response_model=DeleteAllResponse, summary="Clear all activity records")
def delete_all_data(db: Session = Depends(get_db)):
    """Permanently delete all stored activity records across the catalog."""
    deleted_count = crud.delete_all_activities(db)
    return DeleteAllResponse(
        success=True,
        deleted_count=deleted_count,
        message=f"All {deleted_count} activities were cleared."
    )

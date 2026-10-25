from datetime import date
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import ActivityResponse, ActivityCreate, ActivityUpdate, DeleteAllResponse
import app.crud as crud

router = APIRouter(prefix="/api/activities", tags=["Activities"])


@router.get("", response_model=dict)
def read_activities(
    skip: int = Query(0, ge=0),
    limit: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    category: Optional[str] = None,
    platform: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
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


@router.post("", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED)
def create_new_activity(
    activity_in: ActivityCreate,
    db: Session = Depends(get_db)
):
    return crud.create_activity(db, activity_in)


@router.get("/{activity_id}", response_model=ActivityResponse)
def read_single_activity(
    activity_id: int,
    db: Session = Depends(get_db)
):
    activity = crud.get_activity_by_id(db, activity_id)
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    return activity


@router.put("/{activity_id}", response_model=ActivityResponse)
def update_existing_activity(
    activity_id: int,
    activity_update: ActivityUpdate,
    db: Session = Depends(get_db)
):
    updated = crud.update_activity(db, activity_id, activity_update)
    if not updated:
        raise HTTPException(status_code=404, detail="Activity not found")
    return updated


@router.delete("/{activity_id}", status_code=status.HTTP_200_OK)
def delete_single_activity(
    activity_id: int,
    db: Session = Depends(get_db)
):
    success = crud.delete_activity(db, activity_id)
    if not success:
        raise HTTPException(status_code=404, detail="Activity not found")
    return {"success": True, "message": f"Activity {activity_id} successfully deleted"}


@router.delete("", response_model=DeleteAllResponse)
def delete_all_data(db: Session = Depends(get_db)):
    deleted_count = crud.delete_all_activities(db)
    return DeleteAllResponse(
        success=True,
        deleted_count=deleted_count,
        message=f"All {deleted_count} activities were cleared."
    )

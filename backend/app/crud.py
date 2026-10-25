"""Database CRUD operations module.

Encapsulates data persistence, query building, filter composition,
and bulk ingestion routines using SQLAlchemy sessions.
"""

from datetime import date
from typing import List, Optional, Tuple, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models import Activity, ImportBatch
from app.schemas import ActivityCreate, ActivityUpdate


def get_activities(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    category: Optional[str] = None,
    platform: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None
) -> Tuple[List[Activity], int]:
    """Retrieve paginated activity records with multi-dimensional criteria filtering."""
    query = db.query(Activity)

    if search:
        query = query.filter(Activity.title.ilike(f"%{search.strip()}%"))
    if category and category != "all":
        query = query.filter(Activity.category == category)
    if platform and platform != "all":
        query = query.filter(Activity.platform == platform)
    if start_date:
        query = query.filter(Activity.date >= start_date)
    if end_date:
        query = query.filter(Activity.date <= end_date)

    total = query.count()
    items = query.order_by(desc(Activity.date), desc(Activity.id)).offset(skip).limit(limit).all()
    return items, total


def get_activity_by_id(db: Session, activity_id: int) -> Optional[Activity]:
    """Fetch an activity record by primary key."""
    return db.query(Activity).filter(Activity.id == activity_id).first()


def create_activity(db: Session, activity_in: ActivityCreate) -> Activity:
    """Persist a single new activity entity."""
    db_activity = Activity(**activity_in.model_dump())
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity


def bulk_create_activities(db: Session, activities_data: List[Dict[str, Any]]) -> int:
    """Efficiently persist multiple activity entities using bulk_save_objects."""
    if not activities_data:
        return 0
    instances = [Activity(**item) for item in activities_data]
    db.bulk_save_objects(instances)
    db.commit()
    return len(instances)


def update_activity(
    db: Session,
    activity_id: int,
    activity_update: ActivityUpdate
) -> Optional[Activity]:
    """Apply partial updates to an existing activity record."""
    db_activity = get_activity_by_id(db, activity_id)
    if not db_activity:
        return None

    update_data = activity_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_activity, field, value)

    db.commit()
    db.refresh(db_activity)
    return db_activity


def delete_activity(db: Session, activity_id: int) -> bool:
    """Delete a single activity record by primary key."""
    db_activity = get_activity_by_id(db, activity_id)
    if not db_activity:
        return False
    db.delete(db_activity)
    db.commit()
    return True


def delete_all_activities(db: Session) -> int:
    """Purge all stored activity records and return deleted row count."""
    count = db.query(Activity).count()
    db.query(Activity).delete()
    db.commit()
    return count


def create_import_batch(
    db: Session,
    filename: str,
    file_format: str,
    records_count: int
) -> ImportBatch:
    """Record an audit entry for a bulk dataset ingestion batch."""
    batch = ImportBatch(
        filename=filename,
        file_format=file_format,
        records_count=records_count
    )
    db.add(batch)
    db.commit()
    db.refresh(batch)
    return batch

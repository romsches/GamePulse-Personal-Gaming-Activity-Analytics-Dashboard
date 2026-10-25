from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import AnalyticsDashboard
from app.analytics import get_dashboard_analytics

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.get("", response_model=AnalyticsDashboard)
def get_analytics(
    start_date: Optional[date] = Query(None, description="Filter activities after this date"),
    end_date: Optional[date] = Query(None, description="Filter activities before this date"),
    category: Optional[str] = Query(None, description="Filter by category or 'all'"),
    platform: Optional[str] = Query(None, description="Filter by platform or 'all'"),
    search: Optional[str] = Query(None, description="Search keyword in title"),
    db: Session = Depends(get_db)
):
    return get_dashboard_analytics(
        db=db,
        start_date=start_date,
        end_date=end_date,
        category=category,
        platform=platform,
        search=search
    )

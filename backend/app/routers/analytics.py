"""API router for aggregated analytics metrics and visualization datasets."""

from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import AnalyticsDashboard
from app.analytics import get_dashboard_analytics

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.get("", response_model=AnalyticsDashboard, summary="Calculate aggregated dashboard analytics")
def get_analytics(
    start_date: Optional[date] = Query(None, description="Include activities on or after this date"),
    end_date: Optional[date] = Query(None, description="Include activities on or before this date"),
    category: Optional[str] = Query(None, description="Filter by genre/category name or 'all'"),
    platform: Optional[str] = Query(None, description="Filter by hardware platform or 'all'"),
    search: Optional[str] = Query(None, description="Search keyword contained within game title"),
    db: Session = Depends(get_db)
):
    """Compute high-level KPIs, monthly time-series, and categorical distributions."""
    return get_dashboard_analytics(
        db=db,
        start_date=start_date,
        end_date=end_date,
        category=category,
        platform=platform,
        search=search
    )

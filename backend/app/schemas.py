from datetime import date as dt_date, datetime as dt_datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


# Activity Schemas
class ActivityBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=150)
    category: str = Field(..., min_length=1, max_length=80)
    platform: str = Field(default="PC", max_length=80)
    date: dt_date = Field(...)
    hours_played: float = Field(..., ge=0.0, le=100.0)
    money_spent: float = Field(default=0.0, ge=0.0)
    rating: Optional[float] = Field(default=None, ge=1.0, le=10.0)
    notes: Optional[str] = Field(default=None, max_length=1000)


class ActivityCreate(ActivityBase):
    pass


class ActivityUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=150)
    category: Optional[str] = Field(None, min_length=1, max_length=80)
    platform: Optional[str] = Field(None, max_length=80)
    date: Optional[dt_date] = None
    hours_played: Optional[float] = Field(None, ge=0.0, le=100.0)
    money_spent: Optional[float] = Field(None, ge=0.0)
    rating: Optional[float] = Field(None, ge=1.0, le=10.0)
    notes: Optional[str] = Field(None, max_length=1000)


class ActivityResponse(ActivityBase):
    id: int
    created_at: dt_datetime

    model_config = ConfigDict(from_attributes=True)


# Analytics Schemas
class DashboardKpis(BaseModel):
    total_hours: float
    total_spent: float
    avg_cost_per_hour: float
    total_activities: int
    unique_games: int
    top_game: Optional[str] = None
    top_category: Optional[str] = None
    total_days_active: int


class MonthlyTrendItem(BaseModel):
    month: str  # YYYY-MM
    hours: float
    spent: float
    session_count: int


class CategoryDistributionItem(BaseModel):
    category: str
    hours: float
    spent: float
    percentage: float


class PlatformDistributionItem(BaseModel):
    platform: str
    hours: float
    count: int


class TopGameItem(BaseModel):
    title: str
    category: str
    total_hours: float
    total_spent: float
    sessions_count: int


class AnalyticsDashboard(BaseModel):
    kpis: DashboardKpis
    monthly_trend: List[MonthlyTrendItem]
    category_distribution: List[CategoryDistributionItem]
    platform_distribution: List[PlatformDistributionItem]
    top_games: List[TopGameItem]
    categories_list: List[str]
    platforms_list: List[str]


class UploadResponse(BaseModel):
    success: bool
    message: str
    filename: str
    imported_records: int
    batch_id: int


class DeleteAllResponse(BaseModel):
    success: bool
    deleted_count: int
    message: str

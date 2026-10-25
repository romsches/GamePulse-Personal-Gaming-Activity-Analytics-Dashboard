"""Pydantic schemas and Data Transfer Objects (DTOs).

Provides bidirectional validation, serialization, and OpenAPI schema generation
under Pydantic v2 conventions.
"""

from datetime import date as dt_date, datetime as dt_datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


# ============================================================================
# Activity Schemas
# ============================================================================

class ActivityBase(BaseModel):
    """Base payload fields shared across creation, update, and retrieval."""

    title: str = Field(
        ...,
        min_length=1,
        max_length=150,
        description="Title of the game or activity"
    )
    category: str = Field(
        ...,
        min_length=1,
        max_length=80,
        description="Genre or activity classification (e.g. RPG, Shooter)"
    )
    platform: str = Field(
        default="PC",
        max_length=80,
        description="Hardware or distribution platform (e.g. PC, PS5, Switch)"
    )
    date: dt_date = Field(
        ...,
        description="Calendar date of the session or purchase (YYYY-MM-DD)"
    )
    hours_played: float = Field(
        ...,
        ge=0.0,
        le=100.0,
        description="Session duration in hours"
    )
    money_spent: float = Field(
        default=0.0,
        ge=0.0,
        description="Monetary cost or purchase value in USD"
    )
    rating: Optional[float] = Field(
        default=None,
        ge=1.0,
        le=10.0,
        description="Personal evaluation score from 1.0 to 10.0"
    )
    notes: Optional[str] = Field(
        default=None,
        max_length=1000,
        description="Contextual remarks, achievements, or expansion progress"
    )


class ActivityCreate(ActivityBase):
    """Payload schema for creating a new activity record."""
    pass


class ActivityUpdate(BaseModel):
    """Payload schema for partial updates to an existing activity record."""

    title: Optional[str] = Field(None, min_length=1, max_length=150)
    category: Optional[str] = Field(None, min_length=1, max_length=80)
    platform: Optional[str] = Field(None, max_length=80)
    date: Optional[dt_date] = None
    hours_played: Optional[float] = Field(None, ge=0.0, le=100.0)
    money_spent: Optional[float] = Field(None, ge=0.0)
    rating: Optional[float] = Field(None, ge=1.0, le=10.0)
    notes: Optional[str] = Field(None, max_length=1000)


class ActivityResponse(ActivityBase):
    """Serialized activity response entity including system-generated identifiers."""

    id: int
    created_at: dt_datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# Analytical & Aggregation Schemas
# ============================================================================

class DashboardKpis(BaseModel):
    """Top-level statistical key performance indicators."""

    total_hours: float = Field(..., description="Cumulative hours played across dataset")
    total_spent: float = Field(..., description="Cumulative USD expenditure")
    avg_cost_per_hour: float = Field(..., description="Entertainment efficiency ratio ($/hr)")
    total_activities: int = Field(..., description="Total count of recorded activity sessions")
    unique_games: int = Field(..., description="Count of distinct game titles")
    top_game: Optional[str] = Field(None, description="Game title with maximum aggregate hours")
    top_category: Optional[str] = Field(None, description="Category with maximum aggregate hours")
    total_days_active: int = Field(..., description="Count of distinct active calendar days")


class MonthlyTrendItem(BaseModel):
    """Time-series aggregation record for a specific calendar month."""

    month: str = Field(..., description="Calendar period in YYYY-MM format")
    hours: float = Field(..., description="Total hours played during the month")
    spent: float = Field(..., description="Total USD spent during the month")
    session_count: int = Field(..., description="Number of sessions logged in the month")


class CategoryDistributionItem(BaseModel):
    """Genre/category share breakdown."""

    category: str = Field(..., description="Genre name")
    hours: float = Field(..., description="Total hours played in this category")
    spent: float = Field(..., description="Total expenses in this category")
    percentage: float = Field(..., description="Percentage of total playtime")


class PlatformDistributionItem(BaseModel):
    """Hardware platform usage distribution."""

    platform: str = Field(..., description="Platform identifier (PC, PS5, etc.)")
    hours: float = Field(..., description="Total hours played on this platform")
    count: int = Field(..., description="Session frequency count")


class TopGameItem(BaseModel):
    """Ranked game performance item."""

    title: str = Field(..., description="Game title")
    category: str = Field(..., description="Primary genre")
    total_hours: float = Field(..., description="Aggregate hours logged")
    total_spent: float = Field(..., description="Aggregate expenditure")
    sessions_count: int = Field(..., description="Total logged sessions")


class AnalyticsDashboard(BaseModel):
    """Complete aggregated analytical response envelope."""

    kpis: DashboardKpis
    monthly_trend: List[MonthlyTrendItem]
    category_distribution: List[CategoryDistributionItem]
    platform_distribution: List[PlatformDistributionItem]
    top_games: List[TopGameItem]
    categories_list: List[str]
    platforms_list: List[str]


# ============================================================================
# Ingestion & Operation Result Schemas
# ============================================================================

class UploadResponse(BaseModel):
    """Result summary of a dataset ingestion request."""

    success: bool
    message: str
    filename: str
    imported_records: int
    batch_id: int


class DeleteAllResponse(BaseModel):
    """Confirmation summary after clearing dataset records."""

    success: bool
    deleted_count: int
    message: str

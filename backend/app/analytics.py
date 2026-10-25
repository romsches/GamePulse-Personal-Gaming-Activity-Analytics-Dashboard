from datetime import date
from typing import Optional, List, Dict, Any
import pandas as pd
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models import Activity
from app.schemas import (
    AnalyticsDashboard,
    DashboardKpis,
    MonthlyTrendItem,
    CategoryDistributionItem,
    PlatformDistributionItem,
    TopGameItem
)


def get_dashboard_analytics(
    db: Session,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    category: Optional[str] = None,
    platform: Optional[str] = None,
    search: Optional[str] = None
) -> AnalyticsDashboard:
    # 1. Fetch available categories & platforms across the whole DB for dropdown filters
    all_categories = [
        r[0] for r in db.query(Activity.category).distinct().filter(Activity.category.isnot(None)).all()
    ]
    all_platforms = [
        r[0] for r in db.query(Activity.platform).distinct().filter(Activity.platform.isnot(None)).all()
    ]

    # 2. Build filtered SQL query
    query = db.query(
        Activity.id,
        Activity.title,
        Activity.category,
        Activity.platform,
        Activity.date,
        Activity.hours_played,
        Activity.money_spent,
        Activity.rating
    )

    if search:
        query = query.filter(Activity.title.ilike(f"%{search}%"))
    if category and category != "all":
        query = query.filter(Activity.category == category)
    if platform and platform != "all":
        query = query.filter(Activity.platform == platform)
    if start_date:
        query = query.filter(Activity.date >= start_date)
    if end_date:
        query = query.filter(Activity.date <= end_date)

    records = query.all()

    # Empty State fallback
    if not records:
        return AnalyticsDashboard(
            kpis=DashboardKpis(
                total_hours=0.0,
                total_spent=0.0,
                avg_cost_per_hour=0.0,
                total_activities=0,
                unique_games=0,
                top_game=None,
                top_category=None,
                total_days_active=0
            ),
            monthly_trend=[],
            category_distribution=[],
            platform_distribution=[],
            top_games=[],
            categories_list=sorted(all_categories),
            platforms_list=sorted(all_platforms)
        )

    # 3. Load into pandas DataFrame for analytical data transformations
    df = pd.DataFrame([
        {
            "id": r.id,
            "title": r.title,
            "category": r.category,
            "platform": r.platform,
            "date": pd.to_datetime(r.date),
            "hours_played": float(r.hours_played or 0.0),
            "money_spent": float(r.money_spent or 0.0),
            "rating": r.rating
        }
        for r in records
    ])

    # KPI Calculations
    total_hours = round(float(df["hours_played"].sum()), 2)
    total_spent = round(float(df["money_spent"].sum()), 2)
    avg_cost_per_hour = round(total_spent / total_hours, 2) if total_hours > 0 else 0.0
    total_activities = int(len(df))
    unique_games = int(df["title"].nunique())
    total_days_active = int(df["date"].dt.date.nunique())

    # Top Game by hours
    game_hours = df.groupby("title")["hours_played"].sum()
    top_game = str(game_hours.idxmax()) if not game_hours.empty else None

    # Top Category by hours
    cat_hours = df.groupby("category")["hours_played"].sum()
    top_category = str(cat_hours.idxmax()) if not cat_hours.empty else None

    kpis = DashboardKpis(
        total_hours=total_hours,
        total_spent=total_spent,
        avg_cost_per_hour=avg_cost_per_hour,
        total_activities=total_activities,
        unique_games=unique_games,
        top_game=top_game,
        top_category=top_category,
        total_days_active=total_days_active
    )

    # Monthly Trend (Time Series Aggregation)
    df["month"] = df["date"].dt.strftime("%Y-%m")
    monthly_df = df.groupby("month").agg(
        hours=("hours_played", "sum"),
        spent=("money_spent", "sum"),
        session_count=("id", "count")
    ).reset_index().sort_values("month")

    monthly_trend = [
        MonthlyTrendItem(
            month=row["month"],
            hours=round(float(row["hours"]), 2),
            spent=round(float(row["spent"]), 2),
            session_count=int(row["session_count"])
        )
        for _, row in monthly_df.iterrows()
    ]

    # Category Distribution
    cat_df = df.groupby("category").agg(
        hours=("hours_played", "sum"),
        spent=("money_spent", "sum")
    ).reset_index().sort_values("hours", ascending=False)

    category_distribution = []
    for _, row in cat_df.iterrows():
        cat_h = round(float(row["hours"]), 2)
        pct = round((cat_h / total_hours * 100), 1) if total_hours > 0 else 0.0
        category_distribution.append(
            CategoryDistributionItem(
                category=row["category"],
                hours=cat_h,
                spent=round(float(row["spent"]), 2),
                percentage=pct
            )
        )

    # Platform Distribution
    plat_df = df.groupby("platform").agg(
        hours=("hours_played", "sum"),
        count=("id", "count")
    ).reset_index().sort_values("hours", ascending=False)

    platform_distribution = [
        PlatformDistributionItem(
            platform=row["platform"],
            hours=round(float(row["hours"]), 2),
            count=int(row["count"])
        )
        for _, row in plat_df.iterrows()
    ]

    # Top Games (Top 10)
    top_games_df = df.groupby("title").agg(
        category=("category", "first"),
        total_hours=("hours_played", "sum"),
        total_spent=("money_spent", "sum"),
        sessions_count=("id", "count")
    ).reset_index().sort_values("total_hours", ascending=False).head(10)

    top_games = [
        TopGameItem(
            title=row["title"],
            category=row["category"],
            total_hours=round(float(row["total_hours"]), 2),
            total_spent=round(float(row["total_spent"]), 2),
            sessions_count=int(row["sessions_count"])
        )
        for _, row in top_games_df.iterrows()
    ]

    return AnalyticsDashboard(
        kpis=kpis,
        monthly_trend=monthly_trend,
        category_distribution=category_distribution,
        platform_distribution=platform_distribution,
        top_games=top_games,
        categories_list=sorted(all_categories),
        platforms_list=sorted(all_platforms)
    )

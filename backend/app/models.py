"""SQLAlchemy ORM models module.

Defines persistence schemas for Activity records and bulk Import batches.
Optimized with composite indexes on high-cardinality analytical filtering keys.
"""

from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Text, func
from app.database import Base


class Activity(Base):
    """Represents a discrete gaming session, purchase, or activity log."""

    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(150), nullable=False, index=True, doc="Title of the game or activity")
    category = Column(String(80), nullable=False, index=True, doc="Genre or activity classification")
    platform = Column(String(80), nullable=False, default="PC", index=True, doc="Hardware or ecosystem platform")
    date = Column(Date, nullable=False, index=True, doc="Date on which the session occurred")
    hours_played = Column(Float, nullable=False, default=0.0, doc="Duration played in decimal hours")
    money_spent = Column(Float, nullable=False, default=0.0, doc="Expenditure associated with session/purchase in USD")
    rating = Column(Float, nullable=True, doc="Personal enjoyment score between 1.0 and 10.0")
    notes = Column(Text, nullable=True, doc="Optional personal notes, achievements, or milestones")
    created_at = Column(DateTime, server_default=func.now(), nullable=False, doc="Record creation timestamp")


class ImportBatch(Base):
    """Audit log of bulk dataset ingestion operations."""

    __tablename__ = "import_batches"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    filename = Column(String(255), nullable=False, doc="Source file name provided by the client")
    file_format = Column(String(10), nullable=False, doc="Format of ingested file (csv or json)")
    records_count = Column(Integer, nullable=False, default=0, doc="Total valid records successfully persisted")
    imported_at = Column(DateTime, server_default=func.now(), nullable=False, doc="Ingestion timestamp")

from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Text, func
from app.database import Base


class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(150), nullable=False, index=True)
    category = Column(String(80), nullable=False, index=True)
    platform = Column(String(80), nullable=False, default="PC", index=True)
    date = Column(Date, nullable=False, index=True)
    hours_played = Column(Float, nullable=False, default=0.0)
    money_spent = Column(Float, nullable=False, default=0.0)
    rating = Column(Float, nullable=True)  # User rating 1.0 - 10.0
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)


class ImportBatch(Base):
    __tablename__ = "import_batches"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    filename = Column(String(255), nullable=False)
    file_format = Column(String(10), nullable=False)  # csv or json
    records_count = Column(Integer, nullable=False, default=0)
    imported_at = Column(DateTime, server_default=func.now(), nullable=False)

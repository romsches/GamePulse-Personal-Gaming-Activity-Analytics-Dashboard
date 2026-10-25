import io
import pytest
from starlette.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
import app.models
from app.main import app

# Test SQLite in-memory database with StaticPool to share state across requests
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture
def client():
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as c:
        yield c
    Base.metadata.drop_all(bind=engine)


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_create_and_read_activity(client):
    payload = {
        "title": "Hollow Knight",
        "category": "Metroidvania",
        "platform": "PC",
        "date": "2026-10-01",
        "hours_played": 3.5,
        "money_spent": 14.99,
        "rating": 9.8,
        "notes": "City of Tears exploration"
    }
    create_res = client.post("/api/activities", json=payload)
    assert create_res.status_code == 201
    data = create_res.json()
    assert data["title"] == "Hollow Knight"
    activity_id = data["id"]

    # Read all
    get_res = client.get("/api/activities")
    assert get_res.status_code == 200
    assert get_res.json()["total"] == 1
    assert get_res.json()["items"][0]["id"] == activity_id

    # Read single
    single_res = client.get(f"/api/activities/{activity_id}")
    assert single_res.status_code == 200
    assert single_res.json()["category"] == "Metroidvania"


def test_analytics_calculation(client):
    # Insert multiple activities
    client.post("/api/activities", json={
        "title": "Cyberpunk 2077",
        "category": "RPG",
        "platform": "PC",
        "date": "2026-09-10",
        "hours_played": 10.0,
        "money_spent": 29.99,
        "rating": 9.5
    })
    client.post("/api/activities", json={
        "title": "Cyberpunk 2077",
        "category": "RPG",
        "platform": "PC",
        "date": "2026-09-12",
        "hours_played": 5.0,
        "money_spent": 0.0,
        "rating": 9.0
    })
    client.post("/api/activities", json={
        "title": "Counter-Strike 2",
        "category": "Shooter",
        "platform": "PC",
        "date": "2026-09-15",
        "hours_played": 3.0,
        "money_spent": 0.0,
        "rating": 8.0
    })

    # Fetch analytics
    analytics_res = client.get("/api/analytics")
    assert analytics_res.status_code == 200
    data = analytics_res.json()

    kpis = data["kpis"]
    assert kpis["total_hours"] == 18.0
    assert kpis["total_spent"] == 29.99
    assert kpis["unique_games"] == 2
    assert kpis["top_game"] == "Cyberpunk 2077"
    assert kpis["top_category"] == "RPG"

    assert len(data["monthly_trend"]) == 1
    assert data["monthly_trend"][0]["month"] == "2026-09"
    assert data["monthly_trend"][0]["hours"] == 18.0


def test_csv_upload(client):
    csv_content = """title,category,platform,date,hours_played,money_spent,rating,notes
Hades,Roguelike,PC,2026-10-01,2.0,24.99,9.5,Escape run
Portal 2,Puzzle,PC,2026-10-02,3.0,9.99,10.0,Co-op chambers
"""
    files = {"file": ("test.csv", io.BytesIO(csv_content.encode("utf-8")), "text/csv")}
    response = client.post("/api/upload", files=files)
    assert response.status_code == 200
    assert response.json()["imported_records"] == 2

    # Check that records are in database
    get_res = client.get("/api/activities")
    assert get_res.json()["total"] == 2


def test_load_sample_data(client):
    response = client.post("/api/upload/load-sample")
    assert response.status_code == 200
    assert response.json()["imported_records"] > 0

    analytics_res = client.get("/api/analytics")
    assert analytics_res.json()["kpis"]["total_hours"] > 0

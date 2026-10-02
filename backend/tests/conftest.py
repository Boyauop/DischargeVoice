import os

os.environ["DATABASE_URL"] = "sqlite:///./test.db"
os.environ["JWT_SECRET_KEY"] = "test-secret"

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.models.user import Base
from app.database.session import engine


@pytest.fixture()
def client() -> TestClient:
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    return TestClient(app)

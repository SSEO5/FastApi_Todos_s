import sys
import os
import datetime

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from fastapi.testclient import TestClient
from main import app, save_todos, load_todos, TodoItem, TodoStatus

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_and_teardown():
    # 테스트 전 초기화
    save_todos([])
    yield
    # 테스트 후 정리
    save_todos([])


def test_get_todos_empty():
    response = client.get("/todos")
    assert response.status_code == 200
    assert response.json() == []


def test_get_todos_with_items():
    todo = TodoItem(
        id=1,
        title="Test",
        description="Test description",
        due_date=None,
        status=TodoStatus.not_started,
    )
    save_todos([todo.model_dump(mode="json")])
    response = client.get("/todos")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["title"] == "Test"


def test_create_todo():
    todo = {
        "id": 1,
        "title": "Test",
        "description": "Test description",
        "due_date": None,
        "status": "시작 전",
    }
    response = client.post("/todos", json=todo)
    assert response.status_code == 200
    assert response.json()["title"] == "Test"
    assert response.json()["status"] == "시작 전"


def test_create_todo_invalid():
    todo = {"id": 1, "title": "Test"}
    response = client.post("/todos", json=todo)
    assert response.status_code == 422


def test_update_todo():
    todo = TodoItem(
        id=1,
        title="Test",
        description="Test description",
        due_date=None,
        status="시작 전",
    )
    save_todos([todo.model_dump(mode="json")])
    updated_todo = {
        "id": 1,
        "title": "Updated",
        "description": "Updated description",
        "due_date": str(datetime.date.today()),
        "status": "완료",
    }
    response = client.put("/todos/1", json=updated_todo)
    assert response.status_code == 200
    assert response.json()["title"] == "Updated"
    assert response.json()["status"] == "완료"


def test_update_todo_not_found():
    updated_todo = {
        "id": 1,
        "title": "Updated",
        "description": "Updated description",
        "due_date": str(datetime.date.today()),
        "status": "완료",
    }
    response = client.put("/todos/1", json=updated_todo)
    assert response.status_code == 404


def test_delete_todo():
    todo = TodoItem(
        id=1,
        title="Test",
        description="Test description",
        due_date=None,
        status=TodoStatus.not_started,
    )
    save_todos([todo.model_dump(mode="json")])
    response = client.delete("/todos/1")
    assert response.status_code == 200
    assert response.json()["message"] == "To-Do item deleted"


def test_delete_todo_not_found():
    response = client.delete("/todos/1")
    assert response.status_code == 200
    assert response.json()["message"] == "To-Do item deleted"


def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "html" in response.text.lower()


def test_reset():
    save_todos(
        [
            {
                "id": 1,
                "title": "a",
                "description": "b",
                "due_date": None,
                "status": "시작 전",
            }
        ]
    )
    response = client.delete("/reset")
    assert response.status_code == 200
    assert response.json()["message"] == "Reset complete"
    assert load_todos() == []


def test_search_todos():
    save_todos(
        [
            {
                "id": 1,
                "title": "Buy milk",
                "description": "",
                "due_date": None,
                "status": "시작 전",
            },
            {
                "id": 2,
                "title": "Read book",
                "description": "",
                "due_date": None,
                "status": "시작 전",
            },
        ]
    )
    response = client.get("/todos/search?query=milk")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["title"] == "Buy milk"


def test_todo_stats():
    save_todos(
        [
            {
                "id": 1,
                "title": "A",
                "description": "",
                "due_date": None,
                "status": "완료",
            },
            {
                "id": 2,
                "title": "B",
                "description": "",
                "due_date": None,
                "status": "진행 중",
            },
        ]
    )
    response = client.get("/todos/stats")
    assert response.status_code == 200
    stats = response.json()
    assert stats["total"] == 2
    assert stats["completed"] == 1
    assert stats["not_completed"] == 1

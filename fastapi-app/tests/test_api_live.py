import os
import datetime
import requests
from dotenv import load_dotenv
import pytest

load_dotenv()
BASE_URL = os.getenv("BASE_URL")


@pytest.fixture(autouse=True)
def cleanup_todos():
    requests.delete(f"{BASE_URL}/reset")
    yield
    requests.delete(f"{BASE_URL}/reset")


def test_get_todos_empty():
    response = requests.get(f"{BASE_URL}/todos")
    assert response.status_code == 200
    assert response.json() == []


def test_get_todos_with_items():
    todo = {
        "id": 1,
        "title": "Test",
        "description": "Test description",
        "due_date": None,
        "status": "시작 전",
    }
    requests.post(f"{BASE_URL}/todos", json=todo)
    response = requests.get(f"{BASE_URL}/todos")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["title"] == "Test"


def test_create_todo():
    todo = {
        "id": 2,
        "title": "Test",
        "description": "Another description",
        "due_date": None,
        "status": "시작 전",
    }
    response = requests.post(f"{BASE_URL}/todos", json=todo)
    assert response.status_code == 200
    assert response.json()["title"] == "Test"
    assert response.json()["status"] == "시작 전"


def test_create_todo_invalid():
    todo = {"id": 3, "title": "Test"}
    response = requests.post(f"{BASE_URL}/todos", json=todo)
    assert response.status_code == 422


def test_update_todo():
    todo = {
        "id": 1,
        "title": "Test",
        "description": "Test description",
        "due_date": None,
        "status": "시작 전",
    }
    requests.post(f"{BASE_URL}/todos", json=todo)

    updated_todo = {
        "id": 1,
        "title": "Updated",
        "description": "Updated description",
        "due_date": str(datetime.date.today()),
        "status": "완료",
    }
    response = requests.put(f"{BASE_URL}/todos/1", json=updated_todo)
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
    response = requests.put(f"{BASE_URL}/todos/1", json=updated_todo)
    assert response.status_code == 404


def test_delete_todo():
    todo = {
        "id": 1,
        "title": "Test",
        "description": "Test description",
        "due_date": None,
        "status": "시작 전",
    }
    requests.post(f"{BASE_URL}/todos", json=todo)
    response = requests.delete(f"{BASE_URL}/todos/1")
    assert response.status_code == 200
    assert response.json()["message"] == "To-Do item deleted"


def test_delete_todo_not_found():
    response = requests.delete(f"{BASE_URL}/todos/1")
    assert response.status_code == 200
    assert response.json()["message"] == "To-Do item deleted"


def test_read_root():
    response = requests.get(f"{BASE_URL}/")
    assert response.status_code == 200
    assert "<html" in response.text.lower()


def test_reset():
    todo = {
        "id": 99,
        "title": "Temp",
        "description": "Will be cleared",
        "due_date": None,
        "status": "시작 전",
    }
    requests.post(f"{BASE_URL}/todos", json=todo)

    response = requests.delete(f"{BASE_URL}/reset")
    assert response.status_code == 200
    assert response.json()["message"] == "Reset complete"

    check = requests.get(f"{BASE_URL}/todos")
    assert check.status_code == 200
    assert check.json() == []


def test_search_todos():
    todo1 = {
        "id": 10,
        "title": "Buy milk",
        "description": "",
        "due_date": None,
        "status": "시작 전",
    }
    todo2 = {
        "id": 11,
        "title": "Read book",
        "description": "",
        "due_date": None,
        "status": "시작 전",
    }
    requests.post(f"{BASE_URL}/todos", json=todo1)
    requests.post(f"{BASE_URL}/todos", json=todo2)

    response = requests.get(f"{BASE_URL}/todos/search?query=milk")
    assert response.status_code == 200
    result = response.json()
    assert len(result) == 1
    assert result[0]["title"] == "Buy milk"


def test_todo_stats():
    todos = [
        {
            "id": 21,
            "title": "A",
            "description": "",
            "due_date": None,
            "status": "완료",
        },
        {
            "id": 22,
            "title": "B",
            "description": "",
            "due_date": None,
            "status": "시작 전",
        },
    ]
    for todo in todos:
        requests.post(f"{BASE_URL}/todos", json=todo)

    response = requests.get(f"{BASE_URL}/todos/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2
    assert data["completed"] == 1
    assert data["not_completed"] == 1

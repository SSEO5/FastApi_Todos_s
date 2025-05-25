from io import BytesIO
import sys
import os
import datetime
import uuid

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from fastapi.testclient import TestClient
from main import UPLOAD_DIRECTORY, app, save_todos, load_todos, TodoItem, TodoStatus

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


def test_load_todos_not_existing_file():
    # 파일이 없는 경우
    TODO_FILE = "todo.json"
    if os.path.exists(TODO_FILE):
        os.remove(TODO_FILE)
    assert load_todos() == []


def test_get_todos_by_priority():
    save_todos(
        [
            {
                "id": 1,
                "title": "High priority task",
                "description": "",
                "due_date": None,
                "status": "시작 전",
                "priority": "높음",
            },
            {
                "id": 2,
                "title": "Low priority task",
                "description": "",
                "due_date": None,
                "status": "진행 중",
                "priority": "낮음",
            },
            {
                "id": 3,
                "title": "Medium priority task",
                "description": "",
                "due_date": None,
                "status": "완료",
                "priority": "중간",
            },
            {
                "id": 4,
                "title": "No priority task",
                "description": "",
                "due_date": None,
                "status": "시작 전",
            },
        ]
    )
    response_high = client.get("/todos/priority/높음")
    assert response_high.status_code == 200
    assert len(response_high.json()) == 1
    assert response_high.json()[0]["title"] == "High priority task"
    assert response_high.json()[0]["priority"] == "높음"

    response_low = client.get("/todos/priority/낮음")
    assert response_low.status_code == 200
    assert len(response_low.json()) == 1
    assert response_low.json()[0]["title"] == "Low priority task"
    assert response_low.json()[0]["priority"] == "낮음"

    response_medium = client.get("/todos/priority/중간")
    assert response_medium.status_code == 200
    assert len(response_medium.json()) == 1
    assert response_medium.json()[0]["title"] == "Medium priority task"
    assert response_medium.json()[0]["priority"] == "중간"

    response_no_priority = client.get("/todos/priority/높음")
    assert all("priority" in todo for todo in response_no_priority.json())

    response_invalid = client.get("/todos/priority/잘못된우선순위")
    assert response_invalid.status_code == 422


def test_upload_attachment():
    # 1. To-Do 항목 생성
    todo = TodoItem(
        id=1,
        title="Task with attachment",
        description="Attach a document",
        due_date=None,
        status=TodoStatus.not_started,
    )
    save_todos([todo.model_dump(mode="json")])

    # 2. 파일 업로드 요청
    file_content = b"This is a test file content."
    file_name = "test_document.txt"
    files = {"file": (file_name, BytesIO(file_content), "text/plain")}

    response = client.post("/todos/1/attachments", files=files)
    assert response.status_code == 200
    attachment_info = response.json()
    assert attachment_info["original_filename"] == file_name
    assert attachment_info["file_type"] == "text/plain"
    assert "id" in attachment_info
    assert "filename" in attachment_info  # 서버에 저장된 파일 이름

    # 3. 파일이 실제로 저장되었는지 확인
    saved_file_path = os.path.join(UPLOAD_DIRECTORY, attachment_info["filename"])
    assert os.path.exists(saved_file_path)
    with open(saved_file_path, "rb") as f:
        assert f.read() == file_content

    # 4. To-Do 항목에 첨부 파일 정보가 추가되었는지 확인
    updated_todos = load_todos()
    assert len(updated_todos[0]["attachments"]) == 1
    assert updated_todos[0]["attachments"][0]["original_filename"] == file_name


def test_upload_attachment_todo_not_found():
    file_content = b"This is a test file content."
    file_name = "test_document.txt"
    files = {"file": (file_name, BytesIO(file_content), "text/plain")}

    response = client.post("/todos/999/attachments", files=files)
    assert response.status_code == 404
    assert response.json()["detail"] == "To-Do item not found"


def test_get_attachments():
    # 1. To-Do 항목과 첨부 파일 생성
    todo = TodoItem(
        id=1,
        title="Task with attachment",
        description="Attach a document",
        due_date=None,
        status=TodoStatus.not_started,
    )
    save_todos([todo.model_dump(mode="json")])

    file_content1 = b"Content of file 1."
    file_name1 = "file1.txt"
    files1 = {"file": (file_name1, BytesIO(file_content1), "text/plain")}
    response1 = client.post("/todos/1/attachments", files=files1)
    assert response1.status_code == 200

    file_content2 = b"Content of file 2."
    file_name2 = "image.png"
    files2 = {"file": (file_name2, BytesIO(file_content2), "image/png")}
    response2 = client.post("/todos/1/attachments", files=files2)
    assert response2.status_code == 200

    # 2. 첨부 파일 목록 조회
    response = client.get("/todos/1/attachments")
    assert response.status_code == 200
    attachments = response.json()
    assert len(attachments) == 2
    assert attachments[0]["original_filename"] == file_name1
    assert attachments[1]["original_filename"] == file_name2


def test_get_attachments_todo_not_found():
    response = client.get("/todos/999/attachments")
    assert response.status_code == 404
    assert response.json()["detail"] == "To-Do item not found"


def test_download_attachment():
    # 1. To-Do 항목과 첨부 파일 생성
    todo = TodoItem(
        id=1,
        title="Download test",
        description="Test file download",
        due_date=None,
        status=TodoStatus.not_started,
    )
    save_todos([todo.model_dump(mode="json")])

    file_content = b"This is content for download."
    file_name = "download_me.pdf"
    files = {"file": (file_name, BytesIO(file_content), "application/pdf")}
    upload_response = client.post("/todos/1/attachments", files=files)
    assert upload_response.status_code == 200
    attachment_id = upload_response.json()["id"]

    # 2. 첨부 파일 다운로드 요청
    download_response = client.get(f"/todos/1/attachments/{attachment_id}/download")
    assert download_response.status_code == 200
    assert download_response.headers["content-type"] == "application/pdf"
    assert (
        download_response.headers["content-disposition"]
        == f'attachment; filename="{file_name}"'
    )
    assert download_response.content == file_content


def test_download_attachment_todo_not_found():
    response = client.get(f"/todos/999/attachments/{uuid.uuid4()}/download")
    assert response.status_code == 404
    assert response.json()["detail"] == "To-Do item not found"


def test_download_attachment_not_found_in_todo():
    # 1. To-Do 항목 생성 (첨부 파일 없음)
    todo = TodoItem(
        id=1,
        title="No attachment",
        description="",
        due_date=None,
        status=TodoStatus.not_started,
    )
    save_todos([todo.model_dump(mode="json")])

    # 2. 존재하지 않는 첨부 파일 ID로 다운로드 요청
    response = client.get(f"/todos/1/attachments/{uuid.uuid4()}/download")
    assert response.status_code == 404
    assert response.json()["detail"] == "Attachment not found in To-Do item"


def test_download_attachment_file_not_found_on_server():
    # 1. To-Do 항목과 첨부 파일 정보는 있지만 실제 파일은 없는 경우 시뮬레이션
    attachment_id = str(uuid.uuid4())
    todo = TodoItem(
        id=1,
        title="Missing file test",
        description="",
        due_date=None,
        status=TodoStatus.not_started,
        attachments=[
            {
                "id": attachment_id,
                "filename": "non_existent_file.txt",  # 실제 존재하지 않는 파일
                "original_filename": "missing.txt",
                "file_type": "text/plain",
            }
        ],
    )
    save_todos([todo.model_dump(mode="json")])

    # 2. 다운로드 요청
    response = client.get(f"/todos/1/attachments/{attachment_id}/download")
    assert response.status_code == 404
    assert response.json()["detail"] == "Attachment file not found on server"


def test_delete_attachment():
    # 1. To-Do 항목과 첨부 파일 생성
    todo = TodoItem(
        id=1,
        title="Delete test",
        description="Delete an attachment",
        due_date=None,
        status=TodoStatus.not_started,
    )
    save_todos([todo.model_dump(mode="json")])

    file_content = b"Content to be deleted."
    file_name = "delete_me.txt"
    files = {"file": (file_name, BytesIO(file_content), "text/plain")}
    upload_response = client.post("/todos/1/attachments", files=files)
    assert upload_response.status_code == 200
    attachment_id = upload_response.json()["id"]
    uploaded_filename = upload_response.json()["filename"]

    # 2. 실제 파일이 존재하는지 확인
    saved_file_path = os.path.join(UPLOAD_DIRECTORY, uploaded_filename)
    assert os.path.exists(saved_file_path)

    # 3. 첨부 파일 삭제 요청
    delete_response = client.delete(f"/todos/1/attachments/{attachment_id}")
    assert delete_response.status_code == 200
    assert delete_response.json()["message"] == "Attachment deleted successfully"

    # 4. To-Do 항목에서 첨부 파일 정보가 삭제되었는지 확인
    updated_todos = load_todos()
    assert len(updated_todos[0]["attachments"]) == 0

    # 5. 실제 파일이 서버에서 삭제되었는지 확인
    assert not os.path.exists(saved_file_path)


def test_delete_attachment_todo_not_found():
    response = client.delete(f"/todos/999/attachments/{uuid.uuid4()}")
    assert response.status_code == 404
    assert response.json()["detail"] == "To-Do item not found"


def test_delete_attachment_not_found_in_todo():
    # 1. To-Do 항목 생성 (첨부 파일 없음)
    todo = TodoItem(
        id=1,
        title="No attachment to delete",
        description="",
        due_date=None,
        status=TodoStatus.not_started,
    )
    save_todos([todo.model_dump(mode="json")])

    # 2. 존재하지 않는 첨부 파일 ID로 삭제 요청
    response = client.delete(f"/todos/1/attachments/{uuid.uuid4()}")
    assert response.status_code == 404
    assert response.json()["detail"] == "Attachment not found"

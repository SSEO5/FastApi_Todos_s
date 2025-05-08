from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import json
import os
import datetime
from fastapi.middleware.cors import CORSMiddleware
from enum import Enum

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TodoStatus(str, Enum):
    not_started = "시작 전"
    in_progress = "진행 중"
    completed = "완료"


class Priority(str, Enum):
    high = "높음"
    medium = "중간"
    low = "낮음"


# To-Do 항목 모델
class TodoItem(BaseModel):
    id: int
    title: str
    description: str
    due_date: datetime.date | None
    status: TodoStatus = TodoStatus.not_started
    priority: Priority | None = None


# JSON 파일 경로
TODO_FILE = "todo.json"


# JSON 파일에서 To-Do 항목 로드
def load_todos():
    if os.path.exists(TODO_FILE):
        with open(TODO_FILE, "r") as file:
            return json.load(file)
    return []


# JSON 파일에 To-Do 항목 저장
def save_todos(todos):
    with open(TODO_FILE, "w") as file:
        json.dump(todos, file, indent=4)


# To-Do 목록 조회
@app.get("/todos", response_model=list[TodoItem])
def get_todos():
    return load_todos()


# 신규 To-Do 항목 추가
@app.post("/todos", response_model=TodoItem)
def create_todo(todo: TodoItem):
    todos = load_todos()
    todos.append(todo.model_dump(mode="json"))
    save_todos(todos)
    return todo


# To-Do 항목 수정
@app.put("/todos/{todo_id}", response_model=TodoItem)
def update_todo(todo_id: int, updated_todo: TodoItem):
    todos = load_todos()
    for todo in todos:
        if todo["id"] == todo_id:
            todo.update(updated_todo.model_dump(mode="json", exclude_unset=True))
            save_todos(todos)
            return updated_todo
    raise HTTPException(status_code=404, detail="To-Do item not found")


# To-Do 항목 삭제
@app.delete("/todos/{todo_id}", response_model=dict)
def delete_todo(todo_id: int):
    todos = load_todos()
    todos = [todo for todo in todos if todo["id"] != todo_id]
    save_todos(todos)
    return {"message": "To-Do item deleted"}


# HTML 파일 서빙
@app.get("/", response_class=HTMLResponse)
def read_root():
    with open("templates/index.html", "r") as file:
        content = file.read()
    return HTMLResponse(content=content)


@app.delete("/reset")
def reset():
    save_todos([])
    return {"message": "Reset complete"}


@app.get("/todos/search", response_model=list[TodoItem])
def search_todos(query: str = ""):
    todos = load_todos()
    results = [todo for todo in todos if query.lower() in todo["title"].lower()]
    return results


@app.get("/todos/stats")
def todo_stats():
    todos = load_todos()
    completed = [t for t in todos if t["status"] == "완료"]
    not_completed = [t for t in todos if t["status"] != "완료"]
    return {
        "total": len(todos),
        "completed": len(completed),
        "not_completed": len(not_completed),
    }


@app.get("/todos/priority/{priority}", response_model=list[TodoItem])
def get_todos_by_priority(priority: Priority):
    todos = load_todos()
    results = [todo for todo in todos if todo.get("priority") == priority.value]
    return results

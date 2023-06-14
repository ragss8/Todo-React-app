from fastapi import FastAPI,HTTPException,APIRouter
from pydantic import BaseModel
from pymongo import MongoClient
from typing import List

app = FastAPI()

mongodb_uri ='mongodb+srv://raghugaikwad8641:Raghugaikwad8@userinfo.d4n8sns.mongodb.net/?retryWrites=true&w=majority'
port = 8000
client = MongoClient(mongodb_uri, port)
db = client.get_database('todoapp')
user_collection = db.todos



# Model for a todo item
class TodoItem(BaseModel):
    id: int
    text: str
    completed: bool

# Endpoint to add a new todo item
@app.post("/todos")
async def add_todo_item(item: TodoItem):
    todo_dict = item.dict()
    todo_dict["completed"] = False
    user_collection.insert_one(todo_dict)
    return item

# Endpoint to edit a todo item
@app.put("/todos/{item_id}")
async def edit_todo_item(item_id: int, item: TodoItem):
    query = {"id": item_id}
    updated_item = {"$set": {"text": item.text}}
    result = user_collection.update_one(query, updated_item)

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Todo item not found")

    return item

# Endpoint to delete a todo item
@app.delete("/todos/{item_id}")
async def delete_todo_item(item_id: int):
    query = {"id": item_id}
    result = user_collection.delete_one(query)

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Todo item not found")

    return {"message": "Todo item deleted"}

# Endpoint to toggle the completion status of a todo item
@app.put("/todos/{item_id}/toggle")
async def toggle_todo_item(item_id: int):
    query = {"id": item_id}
    todo = user_collection.find_one(query)

    if todo is None:
        raise HTTPException(status_code=404, detail="Todo item not found")

    completed = not todo["completed"]
    updated_item = {"$set": {"completed": completed}}
    user_collection.update_one(query, updated_item)

    return {"message": "Todo item toggled"}

# Endpoint to filter todo items based on completion status
@app.get("/todos/{status}", response_model=List[TodoItem])
async def filter_todo_items(status: str):
    if status == "completed":
        query = {"completed": True}
    elif status == "active":
        query = {"completed": False}
    elif status == "all":
        query = {}
    else:
        raise HTTPException(status_code=400, detail="Invalid status")

    items = user_collection.find(query)
    todo_items = [TodoItem(**item) for item in items]

    return todo_items






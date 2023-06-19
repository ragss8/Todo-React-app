from fastapi import FastAPI,HTTPException, Body
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from fastapi.responses import JSONResponse
from bson import ObjectId
from typing import List

app = FastAPI(debug= True)

mongodb_uri ='mongodb+srv://raghugaikwad8641:Raghugaikwad8@userinfo.d4n8sns.mongodb.net/?retryWrites=true&w=majority'
port = 8000
client = MongoClient(mongodb_uri, port)
db = client.get_database('todoapp')
user_collection = db.todos


class TodoItem(BaseModel):
    item_text: str
    completed: bool

@app.post("/todos")
async def create_todo(todo: TodoItem):
    new_todo = dict(todo)
    inserted_id = user_collection.insert_one(new_todo).inserted_id
    new_todo["_id"] = str(inserted_id)
    return {"todo_id": str(inserted_id), "item_text": new_todo["item_text"], "message": "Todo created successfully"}


@app.delete("/todos/{todo_id}")
async def delete_todo(todo_id: str):
    try:
        todo_object_id = ObjectId(todo_id)
        
        # Retrieve the todo item from user_collection
        todo_item = user_collection.find_one({"_id": todo_object_id})

        if todo_item:
            # Retrieve the deleted todo item's ID
            deleted_todo_id = str(todo_item["_id"])

            # Delete the todo item
            result = user_collection.delete_one({"_id": todo_object_id})

            if result.deleted_count:
                return {"message": "Todo deleted successfully", "deleted_todo_id": deleted_todo_id}
            else:
                return {"message": "Todo not found"}
        else:
            return {"message": "Todo not found"}
    except Exception as e:
        return {"message": f"Error deleting todo: {str(e)}"}
    
""" @app.get("/todos/{todo_id}")
async def get_todo_by_id(todo_id: str):
    todo = user_collection.find_one({"_id": ObjectId(todo_id)})
    if todo:
        todo_item = {
            "todo_id": str(todo["_id"]),
            "item_text": todo["item_text"],
            "completed": todo["completed"]
        }
        return todo_item
    else:
        raise HTTPException(status_code=404, detail="Todo not found")  """   


# Endpoint to edit a todo item
@app.get("/todos/{todo_id}/edit")
async def edit_todo(todo_id: str):
    try:
        # Convert the provided string to a valid ObjectId
        object_id = ObjectId(todo_id)
        
        # Find the todo item with the given ObjectId
        todo = user_collection.find_one({"_id": object_id})
        if todo is None:
            raise HTTPException(status_code=404, detail="Todo item not found")
        
        # Convert the retrieved todo item to a dictionary
        todo_dict = dict(todo)
        todo_dict["_id"] = str(todo_dict["_id"])  # Convert _id to string
        
        return {"todo": todo_dict}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.put("/todos/{todo_id}")
async def update_todo_item(todo_id: str, todo: TodoItem):
    result = user_collection.update_one(
        {"_id": ObjectId(todo_id)},
        {"$set": {
            "item_text": todo.item_text,
            "completed": todo.completed
        }}
    )
    if result.modified_count > 0:
        return {"message": "Todo updated successfully"}
    else:
        raise HTTPException(status_code=404, detail="Todo not found or update failed")


# Endpoint to toggle the completion status of a todo item
@app.put("/todos/{todo_id}/toggle")
async def toggle_todo_status(todo_id: str):
    try:
        # Convert the provided string to a valid ObjectId
        object_id = ObjectId(todo_id)

        # Find the todo item with the given ObjectId
        todo = user_collection.find_one({"_id": object_id})
        if todo is None:
            raise HTTPException(status_code=404, detail="Todo item not found")

        # Toggle the completed status of the todo item
        new_completed_status = not todo["completed"]
        user_collection.update_one(
            {"_id": object_id},
            {"$set": {"completed": new_completed_status}}
        )

        return {"message": "Todo item status toggled successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Endpoint to filter todo items based on completion status
@app.get("/todos")
def get_filtered_todos(filter_type: str):
    filter_query = {}
    if filter_type == "completed":
        filter_query = {"completed": True}
    elif filter_type == "active":
        filter_query = {"completed": False}
    elif filter_type == "all":
        pass
    else:
        raise HTTPException(status_code=400 , detail="Invalid filter type")    
    todos = user_collection.find(filter_query)
    return list(todos)

""" @app.get("/todos")
def get_filtered_todos(filter_type: str):
    filtered_todos = []

    if filter_type == "all":
        filtered_todos = todos
    elif filter_type == "completed":
        filtered_todos = [todo for todo in todos if todo["completed"]]
    elif filter_type == "active":
        filtered_todos = [todo for todo in todos if not todo["completed"]]

    return filtered_todos """


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

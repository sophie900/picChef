import os
from typing import Union
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from identify_image import identify_dish, FileTypeError
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from models import SavedRecipe, User


# Initialize FastAPI app
app = FastAPI()


# CORS configuration
origins = [
    "http://localhost:5173"  # Vite's default dev server port is 5173
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# App routes
@app.get('/')
def read_root():
    return {'Hello': 'World'}


# Sample endpoint with path and query parameters
# @app.get('/items/{item_id}')
# def read_item(item_id: int, q: Union[str, None] = None, r: Union[str, None] = None):
#     return {'item_id': item_id, 'q': q, 'r': r}


# File upload endpoint
@app.post('/uploadfile/')
async def upload_file(file: UploadFile):
    """
    Endpoint to upload an image file and identify the dish using Gemini AI.
    Returns the identified dish name.
    
    If an error occurs, returns an error message.
    """

    print(f'Received file: {file.filename}')

    # Read the file content as bytes
    image_contents = await file.read()
    file_type = os.path.splitext(file.filename)[1][1:].lower()  # Get file extension and convert to lowercase
    # print(type(image_contents))  # Uncomment to check the type of contents

    try:
        # Pass the file to Gemini AI model for dish identification
        dish_name, recipes = identify_dish(image_contents, file_type)
        print(dish_name)  # Ensure dish is identified correctly

        return {
            'dish_name': dish_name,  # String containing original dish name
            'recipes': recipes  # List of dictionaries containing recipe info
        }
    except FileTypeError as e:  # Wrong file type, raise HTTP exception with error message
        print(f'Error: {e}')
        
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


# Configuration for save recipe endpoint

# Create pydantic model for JSON input
class RecipeData(BaseModel):
    name: str
    link: str
    image: str


# Save recipe endpoint
@app.post('/saverecipe/')
def save_recipe(recipe_data: RecipeData):
    try:
        # Ensure recipe_data has the required fields
        print(recipe_data.name, recipe_data.link, recipe_data.image)
    except:
        raise HTTPException(
            status_code=400,
            detail='Could not save recipe: recipe data is incomplete'
        )

    try:
        # Create engine and start the DB session
        engine = create_engine('sqlite:///data/recipe_data.db')

        with Session(engine) as session:
            recipe = SavedRecipe(
                name=recipe_data.name,
                link=recipe_data.link,
                image=recipe_data.image,
                user_id=1  # TODO: change this based on the user
            )
            session.add(recipe)  # Add recipe to saved_recipe table
            session.commit()  # Remember to commit the changes!

        return {'message': f'Saved recipe: {recipe_data.name}'}
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail='Could not save recipe: ' + str(e)
        )


# TODO: Create an endpoint for handling URL uploads

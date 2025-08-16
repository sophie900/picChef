import os
from fastapi import FastAPI, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from identify_image import identify_dish, FileTypeError, ImageQualityError
from scrape_recipes import build_query, scrape_recipe
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
# class FileInfo(BaseModel):
#     dish_name: str
#     recipes: dict


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
        dish_name = identify_dish(image_contents, file_type)
        print(dish_name)  # Ensure dish is identified correctly

        return {
            'dish_name': dish_name,  # String containing original dish name
            # 'recipes': recipes  # List of dictionaries containing recipe info
        }
    except (FileTypeError, ImageQualityError) as e:
        # Handle custom errors: wrong file type and poor image quality
        print(f'Error: {e}')

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )



# Search dishes GET endpoint
class SearchDishInput(BaseModel):
    dish_name: str


# class SearchDishOutput(BaseModel):
#     recipes: dict[list]


@app.get('/search')
async def search_dish(q: str = Query()):  # Query is required
    """
    Given a dish query, scrapes allrecipes for related recipes.

    Returns a dictionary containing a list of recipes.
    """

    # print(q)  # Debug: print the query
    url_to_scrape = build_query(q)  # Restructure query to search allrecipes.com

    # Scrape recipes on search results page
    recipes = scrape_recipe(url_to_scrape)

    return {
        'recipes': recipes
    }



# Save recipe endpoint
class RecipeData(BaseModel):
    name: str
    link: str
    image: str

class SaveRecipeMessage(BaseModel):
    message: str


@app.post('/saverecipe/')
def save_recipe(recipe_data: RecipeData) -> SaveRecipeMessage:
    """
    Endpoint for saving a recipe and its corresponding information (name, link, image).

    Returns a message indicating a successful operation, or raises an HTTPError.
    """
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
            session.commit()  # Remember to commit the changes

        return {'message': f'Saved recipe: {recipe_data.name}'}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail='Could not save recipe: ' + str(e)
        )


# TODO: Create an endpoint for handling URL uploads

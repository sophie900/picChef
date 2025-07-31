import os
from typing import Union
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from identify_image import identify_dish, FileTypeError


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
async def upload_file(file: UploadFile = File(...)):
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
            'dish_name': dish_name,
            'recipes': recipes
        }
    except FileTypeError as e:  # Wrong file type, raise HTTP exception with error message
        print(f'Error: {e}')
        
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


# TODO: Create an endpoint for handling URL uploads

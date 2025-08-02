from dotenv import load_dotenv
import os
from google import genai
from google.genai import types
from scrape_recipes import build_query, scrape_recipe


# Load environment variables from .env file
load_dotenv()
my_api_key = os.getenv('GEMINI_API_KEY')

client = genai.Client(api_key=my_api_key)



# Define custom exceptions
class FileTypeError(Exception):
    """Custom exception for unsupported file types."""
    pass



class ImageQualityError(Exception):
    """An exception to raise when the user provides an image with no identifiable dish."""
    pass



def identify_dish(image_bytes: bytes, file_type: str) -> tuple[str, list[dict]]:
    """
    Identifies the dish in the uploaded image using Gemini AI.
    Returns a tuple with the dish name and generated recipes.
    """

    # Validate file type
    supported_types = ['png', 'jpg', 'jpeg', 'webp', 'heic', 'heif']

    if file_type not in supported_types:
        raise FileTypeError(f"Unsupported file type: {file_type}. Supported types are: {', '.join(supported_types)}.")
    elif file_type == 'jpg':
        file_type = 'jpeg'

    # Create a Part object for the image
    image = types.Part.from_bytes(
        data=image_bytes,
        mime_type=f'image/{file_type}'
    )

    # Generate Gemini response
    response = client.models.generate_content(
        model='gemini-2.5-flash-lite',
        contents=[
            'Identify the dish as concisely as possible. Return "error" if no dish is present.',
            image
        ]
    )
    dish_name = response.text.strip()
    print(dish_name)  # Debug

    if 'error' in dish_name.lower():
        raise ImageQualityError('Image does not contain a dish. Please choose a different image.')

    # TODO: refactor code to separate concerns (image identification, recipe scraping)
    # # Build query to search allrecipes.com for dish
    # url_to_scrape = build_query(dish_name)

    # # Scrape recipes on search results page
    # recipes = scrape_recipe(url_to_scrape)

    return dish_name



from dotenv import load_dotenv
import os
from google import genai
from google.genai import types


# Load environment variables from .env file
load_dotenv()
my_api_key = os.getenv('GEMINI_API_KEY')

client = genai.Client(api_key=my_api_key)



class FileTypeError(Exception):
    """Custom exception for unsupported file types."""
    pass


def identify_dish(image_bytes: bytes, file_type: str) -> tuple[str, list]:
    """
    Identifies the dish in the uploaded image using Gemini AI.
    Returns a string response with the dish name.
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
            'Identify the dish as concisely as possible',
            image
        ]
    )
    dish_name = response.text.strip()

    recipes = client.models.generate_content(
        model='gemini-2.5-flash-lite',
        contents=[
            f'Provide 3-6 valid, usable recipe links for {dish_name}, separated by a single space. Do not include anything else.'
        ]
    )

    return dish_name, recipes.text.split()

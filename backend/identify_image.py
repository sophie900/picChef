from dotenv import load_dotenv
import os
from google import genai
from google.genai import types


# Load environment variables from .env file
load_dotenv()
my_api_key = os.getenv('GEMINI_API_KEY')

client = genai.Client(api_key=my_api_key)


def identify_dish(image_bytes: bytes, file_type: str) -> str:
    """
    Identifies the dish in the uploaded image using Gemini AI.
    Returns a string response with the dish name.
    """

    # Validate file type
    supported_types = ['png', 'jpeg', 'webp', 'heic', 'heif']

    if file_type not in supported_types:
        raise ValueError(f"Unsupported file type: {file_type}. Supported types are: {', '.join(supported_types)}.")
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
    return response.text

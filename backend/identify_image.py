from dotenv import load_dotenv
import os
from google import genai
from google.genai import types


# Load environment variables from .env file
load_dotenv()
my_api_key = os.getenv('GEMINI_API_KEY')

client = genai.Client(api_key=my_api_key)


def identify_dish(image_bytes: bytes) -> str:
    """
    Identifies the dish in the uploaded image using Gemini AI.
    Returns a string response with the dish name.
    """

    image = types.Part.from_bytes(
        data=image_bytes,
        mime_type='image/jpeg'  # TODO: Adjust MIME type based on actual image type
    )

    response = client.models.generate_content(
        model='gemini-2.5-flash-lite',
        contents=[
            'Identify the dish as concisely as possible',
            image
        ]
    )
    return response.text

from typing import Union
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware


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


@app.get('/items/{item_id}')
def read_item(item_id: int, q: Union[str, None] = None, r: Union[str, None] = None):
    return {'item_id': item_id, 'q': q, 'r': r}


# File upload endpoint
@app.post('/uploadfile/')
async def upload_file(file: UploadFile = File(...)):
    print(f'Received file: {file.filename}')
    return {'filename': file.filename}

from typing import Union
from fastapi import FastAPI

# Initialize FastAPI app
app = FastAPI()


# App routes
@app.get('/')
def read_root():
    return {'Hello': 'World'}


@app.get('/items/{item_id}')
def read_item(item_id: int, q: Union[str, None] = None, r: Union[str, None] = None):
    return {'item_id': item_id, 'q': q, 'r': r}

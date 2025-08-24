# picChef


## About the Project
### From camera to kitchen 🧑‍🍳

*Calling all foodies!*

Imagine this: you're doomscrolling social media and stumble across a scrumptious dish.
Eager to try your hand at recreating it, you're disappointed to find that you have no idea what the dish is!
If only there were a tool to help bring recipes to life, from camera to kitchen...

That's where **picChef** comes in. Simply upload an image of a dish and picChef will generate a detailed recipe.

### Built With 💻

#### Frontend
* **React** frontend for modularity, with **Typescript** for type safety
* **Tailwind** for modern, responsive styling
* **Motion** library for seamless UI animations

#### Backend
* **FastAPI** and **Python** for the backend
* **SQLite** database for recipe storage & **SQLAlchemy** ORM for DB interaction
* **Gemini** for image recognition
* **BeautifulSoup** library for recipe scraping

### Features ✨
- [x] Upload image from file picker
- [ ] Upload image via URL
- [x] Image preview before upload
- [x] Gemini AI image identification
- [x] Search results page with recipes scraped from allrecipes.com
- [ ] Dark/light theme switcher
- [x] Saved recipes page
- [ ] Custom notes for recipes
- [ ] Filter saved recipes by condition
- [ ] Authentication/login


## Getting Started

### Prerequisites
- Python 3.8+
- Node.js
- npm

### Running the Application

1. Clone the repository:  
```
git clone https://github.com/sophie900/picChef.git && npm install
```

2. Create virtual environment and install Python packages:  
- *Navigate to `backend` directory:*  
`cd backend`

- *Create a virtual environment:*  
`python -m venv venv`

- *Activate virtual environment:*  
`source venv/bin/activate` on macOS/Linux  
`.\venv\Scripts\activate` on Windows

- *Install requirements:*  
`pip install -r requirements.txt`

3. Get a Gemini API key [here](https://aistudio.google.com/apikey), then store it as an environment variable
```
cd backend
echo "GEMINI_API_KEY=YOUR_API_KEY_HERE" >> .env
```

4. While in the `backend` folder, run the server  
```
fastapi dev main.py
```

5. Navigate to backend folder and run server
```
cd frontend
npm run dev
```

6. The application should be running at [http://localhost:5173/](http://localhost:5173/).

7. Happy cooking!

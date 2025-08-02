from bs4 import BeautifulSoup
import requests


def build_query(dish_name: str) -> str:
    """Given a dish name, builds a query to search allrecipes.com for the dish."""

    base_string = 'https://www.allrecipes.com/search?q='

    dish_query = '+'.join(dish_name.split())  # Split and join using + symbol

    return base_string + dish_query


def scrape_recipe(url: str) -> list[dict]:
    """
    Scrapes recipes from the given URL. Returns a dictionary with recipe details.
    """
    try:
        # Retrieve the page content
        response = requests.get(url)
        response.raise_for_status()  # Raise HTTPError if one occurred

        # Create the soup
        soup = BeautifulSoup(response.content, 'html.parser')

        # Scrape card info for all recipe cards within the container
        card_container = soup.find(id='mntl-search-results__list_1-0')

        all_recipes = []

        for card in card_container.children:
            if (card.name == 'a') and ('href' in card.attrs):
                all_recipes.append({
                    'recipe_name': card.select_one('.card__content .card__title').text.strip(),
                    'recipe_link': card['href'],
                    'recipe_image': card.select_one('.card__top .card__media .img-placeholder img')['data-src']
                })

        return all_recipes
    except Exception as e:
        print(f'Error scraping recipes: {e}')
        return {'error': str(e)}

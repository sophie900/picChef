import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { motion } from 'motion/react'
import RecipeCard from './RecipeCard'



const SearchResults = () => {
    // Retrieve search query from URL
    const [searchParams] = useSearchParams();  // Note that this must be a state variable
    const dish_query = searchParams.get('q')
    console.log('Query received:', dish_query)  // Debug: log the query

    // Define interface for RecipeObject
    interface RecipeObject {
        recipe_name: string;
        recipe_link: string;
        recipe_image: string;
    }
    const [recipes, setRecipes] = useState<Array<RecipeObject>>([]);  // Store recipe information


    // Employ useEffect hook to retrieve dish data from API
    useEffect(() => {
        const fetchRecipes = async () => {
            if (typeof dish_query === 'string') {
                const params = new URLSearchParams({ q: dish_query }).toString();  // Format query parameters

                const response = await fetch('http://127.0.0.1:8000/search/?' + params, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const response_json = await response.json()
                    const recipes_returned = response_json.recipes
                    setRecipes(recipes_returned)  // Set state variable to store list of recipes
                } else {
                    null  // TODO: add error handling
                }
            } else {
                null  // TODO: error check here
            }
        }

        fetchRecipes();  // Call the fetch recipes function
    }, [dish_query]);

    return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="m-auto
          "
        >
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
                Generated Recipes {dish_query ? 'for ' + dish_query : '' }
            </h2>

            <div className="flex gap-3 justify-center flex-wrap
            bg-gray-50/80 dark:bg-gray-700/40
            p-8 rounded-lg shadow-lg shadow-indigo-400/40
            w-full 
            border border-indigo-200/50 dark:border-indigo-500/10">
                {
                    recipes.length == 0 ? "None yet! Upload an image to get started." : 
                    recipes.map((element, index) => (  // Map each recipe link to a RecipeCard component
                        <RecipeCard
                        key={index}  // Use the index as key (temp)
                        title={element.recipe_name}  // Pass recipe info as props
                        recipeLink={element.recipe_link}
                        image={element.recipe_image}
                        />
                    ))
                }
            </div>
        </motion.div>
    );

}

export default SearchResults;

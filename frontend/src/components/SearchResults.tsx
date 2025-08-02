import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { motion } from 'motion/react'
import RecipeContainer from './RecipeContainer'
import RecipeCard from './RecipeCard'



const SearchResults = () => {
    // Retrieve search query from URL
    const [searchParams] = useSearchParams();  // Note that this must be a state variable
    const query = searchParams.get('q')
    console.log(query)  // Debug: log the query

    // Define interface for RecipeObject
    interface RecipeObject {
        recipe_name: string;
        recipe_link: string;
        recipe_image: string;
    }
    const [recipes, setRecipes] = useState<Array<RecipeObject>>([]);  // Store recipe information


    // Employ useEffect hook to retrieve dish data from API
    useEffect(() => {
        }
    );

    return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 2,
            scale: {
              type: "spring",
              bounce: 0.4,
              damping: 12,
              mass: 1.5
            }
          }}
          className="bg-gray-50/80 dark:bg-gray-700/40
            p-8 rounded-lg shadow-lg shadow-indigo-400/40
            w-full md:w-2xl lg:w-4xl max-w-4xl
            border border-indigo-200/50 dark:border-indigo-500/10"
        >
          <RecipeContainer
            contents={
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
          />
        </motion.div>
    );

}

export default SearchResults;

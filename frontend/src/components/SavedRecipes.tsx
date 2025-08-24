import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import RecipeCard from './RecipeCard'
import { createClient } from "@supabase/supabase-js";

// Create supabase client
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)


const SavedRecipes = () => {
    // Define interface for RecipeObject
    interface RecipeObject {
        recipe_name: string;
        recipe_link: string;
        recipe_image: string;
    }
    // const [recipes, setRecipes] = useState<Array<RecipeObject>>([]);  // Store recipe information
    const [recipes, setRecipes] = useState<Array<RecipeObject>>([]);  // Store recipe information

    async function getRecipes() {
        const { data } = await supabase.from('recipe').select();
        console.log('Supabase response:')
        console.log(data)
        setRecipes(data);
    }


    // Employ useEffect hook to retrieve dish data from API
    useEffect(() => {
        getRecipes();
    //   const fetchRecipes = async () => {
    //         const response = await fetch('http://127.0.0.1:8000/savedrecipes/', {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });

    //         if (response.ok) {
    //             const response_json = await response.json()
    //             const recipes_returned = response_json
    //             setRecipes(recipes_returned)  // Set state variable to store list of recipes
    //         } else {
    //             null  // TODO: add error handling
    //         }
    //   }

    //     fetchRecipes();  // Call the fetch recipes function
    }, []);

    return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1,
            scale: {
              type: "spring",
              bounce: 0.4,
              damping: 12,
              mass: 1.5
            }
          }}
          className="m-auto flex flex-col justify-center items-center"
        >

            <h2 className="text-3xl mt-18 font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
                Saved Recipes
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

export default SavedRecipes;

import { motion } from "motion/react"

interface RecipeCardProps {
    title: string;
    recipeLink: string;
    image: string;
}



const handleSaveRecipe = async (recipe_name: string, recipe_link: string, recipe_image: string) => {
  try {
    console.log('Saving recipe...')

    const response = await fetch('http://127.0.0.1:8000/saverecipe/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'  // Set correct Content-Type header
      },
      body: JSON.stringify({
        'name': recipe_name,
        'link': recipe_link,
        'image': recipe_image
      })
    })

    if (response.ok) {
      const response_json = await response.json();
      console.log(response_json.message);  // Log the response JSON
    } else {
      const errorData: { detail?: string } = await response.json();
      console.log('Error: ', errorData.detail)
    }
  } catch {
    null  // TODO: fix this
  }
}



const RecipeCard = ({ title, recipeLink, image }: RecipeCardProps) => {
  return (
    <>
      <motion.div
        initial={{ y: 10 }}
        animate={{ y: 0 }}
        transition={{
          duration: 0.5,
        }}
        className="
          bg-gray-200/75 dark:bg-gray-700/75 hover:bg-gray-300/75 dark:hover:bg-gray-500/50
          p-4 rounded-xl shadow-md w-full sm:w-4/9 md:w-4/9 lg:w-3/10 xl:w-1/5
          hover:-translate-y-1 transition-all
        "
      >
        <img src={image} alt={title + " image"} className="w-full" />
        <h2 className="overflow-hidden text-lg font-semibold mt-2 mb-1">{title}</h2>
        <a href={recipeLink} className="wrap-break-word">
            {recipeLink}
        </a>
        <button onClick={ () => {handleSaveRecipe(title, recipeLink, image)} }>  { /* Save recipe on button click */}
          { /* SVG code courtesy to flaticon.com */ }
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="Outline"
            viewBox="0 0 24 24"
            className="
              float-right
              w-1/8 mt-4
            fill-gray-400 dark:fill-gray-800 hover:fill-gray-600 dark:hover:fill-gray-400"
            >
              <path d="M20.137,24a2.8,2.8,0,0,1-1.987-.835L12,17.051,5.85,23.169a2.8,2.8,0,0,1-3.095.609A2.8,2.8,0,0,1,1,21.154V5A5,5,0,0,1,6,0H18a5,5,0,0,1,5,5V21.154a2.8,2.8,0,0,1-1.751,2.624A2.867,2.867,0,0,1,20.137,24ZM6,2A3,3,0,0,0,3,5V21.154a.843.843,0,0,0,1.437.6h0L11.3,14.933a1,1,0,0,1,1.41,0l6.855,6.819a.843.843,0,0,0,1.437-.6V5a3,3,0,0,0-3-3Z"/>
          </svg>
        </button>
      </motion.div>
    </>
  );
}

export default RecipeCard;

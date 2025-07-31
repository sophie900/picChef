import { motion } from "motion/react"

interface RecipeCardProps {
    title: string;
    recipeLink: string;
    image: string;
}

// TODO: implement the RecipeCard component
const RecipeCard = ({ title, recipeLink, image }: RecipeCardProps) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="
        bg-gray-200/75 dark:bg-gray-600/50 dark:hover:bg-gray-500/50
        p-4 rounded-xl shadow-md w-full sm:w-2/5 md:w-2/7
        hover:-translate-y-1 transition-all"
      >
        <img src={image} className="w-full" />
        <h2 className="overflow-hidden">{title}</h2>
        <a href={recipeLink} className="wrap-break-word">
            {recipeLink}
        </a>
        <button>
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

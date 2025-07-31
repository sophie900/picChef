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
          className='
          bg-gray-200/75 dark:bg-gray-600/50 dark:hover:bg-gray-500/50
            p-4 rounded-xl shadow-md w-full sm:w-2/5 md:w-2/7
            hover:-translate-y-1 transition-all'
        >
        <img src={image}></img>
        <h2 className="overflow-hidden">{title}</h2>
        <a href={recipeLink} className="wrap-break-word">
            {recipeLink}
        </a>
        </motion.div>
    </>
  );
}

export default RecipeCard;

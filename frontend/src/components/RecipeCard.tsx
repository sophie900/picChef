import { motion } from "motion/react"

interface RecipeCardProps {
    title: string;
    description: string;
    recipeLink: string;
}

// TODO: implement the RecipeCard component
const RecipeCard = ({ title, description, recipeLink }: RecipeCardProps) => {
  return (
    <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-gray-200/75 dark:bg-gray-600/50 p-4 rounded-xl shadow-md w-full sm:w-2/5 md:w-2/7'
        >
        <h2 className="overflow-hidden">{title}</h2>
        <p className="overflow-hidden">{description}</p>
        <a href={recipeLink} className="wrap-break-word">
            {recipeLink}
        </a>
        </motion.div>
    </>
  );
}

export default RecipeCard;

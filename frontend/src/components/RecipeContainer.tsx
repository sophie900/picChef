interface RecipeContainerProps {
    contents: string | React.ReactNode;
}

const RecipeContainer = ({ contents }: RecipeContainerProps) => {
  return (
    <>
      <h2 className="text-xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">Generated Recipes</h2>
      <div className="italic">
        { contents }
      </div>
    </>
  );
}

export default RecipeContainer;

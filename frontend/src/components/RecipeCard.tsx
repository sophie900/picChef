interface RecipeCardProps {
    title: string;
    description: string;
    imageURL: string;
}

// TODO: implement the RecipeCard component
const RecipeCard = ({ title, description, imageURL }: RecipeCardProps) => {
  return (
    <>
        {title}, {description}, {imageURL}
    </>
  );
}

export default RecipeCard;

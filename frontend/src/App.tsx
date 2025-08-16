import { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion, stagger } from "motion/react"
import './App.css'


function App() {
  // State variables
  const [selectedFile, setSelectedFile] = useState<File | null>(null);  // Store the selected file
  const [imageData, setImageData] = useState<string>();  // Store image data for preview
  const [loading, setLoading] = useState<boolean>(false);  // Manage loading status during upload
  const [message, setMessage] = useState<string>('');  // Hold success/error message
  const navigate = useNavigate();

  // // Define interface for RecipeObject
  // interface RecipeObject {
  //   recipe_name: string;
  //   recipe_link: string;
  //   recipe_image: string;
  // }
  // const [recipes, setRecipes] = useState<Array<RecipeObject>>([]);  // Store recipe information




  // Handler for file input change
  const handleFileChange = (event: React.FormEvent) => {
    const files = (event.target as HTMLInputElement).files;

    if (files && files.length > 0) {
      console.log('Selected file:', files[0]);  // Debug statement to log the selected file
      setSelectedFile(files[0]);

      // Set image data for preview
      const reader = new FileReader();
      reader.onload = () => {
        setImageData(reader.result as string);  // Set the image data for preview
      };
      reader.readAsDataURL(files[0]);  // Read the file as a data URL

      // Clear any previous messages
      setMessage('');
    } else {
      console.error('No file selected');
    }
  }


  // Handler for the upload button click
  // No explicit event parameter needed for this async function
  const handleUpload = async (): Promise<void> => {
    // Check if a file is selected
    if (!selectedFile) {
      setMessage('Please select an image to upload.');
      return;
    }

    // Debug statement checking if file is selected
    console.log('Uploading file:', selectedFile);

    setLoading(true);  // Start loading

    // Create a FormData object to send the file
    const formData = new FormData();
    // Append the selected file with the key 'file'
    formData.append('file', selectedFile);

    try {
      // Make a POST request to the FastAPI endpoint
      const response = await fetch('http://127.0.0.1:8000/uploadfile/', {
        method: 'POST',
        body: formData,  // FormData automatically sets the correct 'Content-Type' header
      });

      // Check if the response was successful
      if (response.ok) {
        setMessage('Upload successful!');

        const response_json = await response.json();
        console.log(response_json);  // Log the response JSON
        // setRecipes(response_json.recipes);

        // Navigate to search page!
        navigate(`/search?q=${response_json.dish_name}`)

      } else {
        const errorData: { detail?: string } = await response.json();  // Type annotation for error JSON response
        setMessage(`Upload failed: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error: any) {  // Catch network errors or other exceptions
      console.error('Error uploading file:', error);  // Debug message to log the error
      setMessage(`Network error or server unreachable: ${error.message || 'Please check your connection.'}`);
    } finally {
      setLoading(false);  // End loading
      setSelectedFile(null);  // Clear the selected file after attempt

      // Clear the file input visually
      // TODO: do this in a more React way
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }
  };

  // Animation settings for container holding components to stagger
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: stagger(0.25),
      }
    }
  }

  // Animation settings for individual components
  const staggerText = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  }

  const staggerBox = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 },
  }


  return (
    <>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="flex flex-col justify-center items-center main-content"
      >

        {/* Title and subtitle */}
        <motion.h1 variants={staggerText} transition={{duration: 2}}>picChef</motion.h1>
        <motion.h3 variants={staggerText} transition={{duration: 1}} className="italic subtitle">From camera to kitchen.</motion.h3>

        {/* Main container for dish uploader */}
        <motion.div
          variants={staggerBox}
          transition={{
              duration: 1,
              scale: {
                type: "spring",
                bounce: 0.4,
                damping: 9
              }
          }}
          className="
          bg-gray-50/80 dark:bg-gray-700/40
            p-8 rounded-lg shadow-lg shadow-indigo-400/40
            w-80% md:w-md lg:w-lg max-w-2xl
            mt-16 mb-16
            border border-indigo-200/50 dark:border-indigo-500/10"
        >
          <h2 className="text-xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">Dish Uploader</h2>

          <div className="mb-6">
            <label htmlFor="file-input" className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
              Select an image of your dish:
            </label>

            <input  // File input for image selection
              id="file-input"
              type="file"
              accept="image/*"  // Restrict to image files
              value=""  // Initially, no file is selected
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 dark:text-gray-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-100 file:text-indigo-700
                        hover:file:bg-indigo-200"
            />
          </div>

          {/* Uncomment the following section to allow image URL uploads (NOT DONE YET) */}
          {/* <div className="mb-6">
            <label htmlFor="image-url-input" className="block text-gray-700 text-sm font-semibold mb-2">
              Or upload an image from a URL:
            </label>

            <input
              id="image-url-input"
              type="text"
              accept="text/plain"
              className="rounded-lg bg-gray-50 text-gray-500 text-sm min-w-60 p-1 inset-shadow-gray-300 inset-shadow-sm"
              />
          </div> */}

          {/* Boolean logic to display file info */}
          {selectedFile && (
            <div className="
              mb-6 p-4 rounded-lg bg-indigo-50 dark:bg-gray-900/30 border border-indigo-200 dark:border-indigo-400/40
              text-indigo-700 dark:text-indigo-300 text-sm">
              <p className="font-medium">Selected File:</p>
              <img className="mx-auto m-2" src={imageData} />
              <p className="truncate">{selectedFile.name}</p>
              <p className="text-xs text-indigo-500 dark:text-indigo-400">Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={loading || !selectedFile}  // Disable button when loading or no file selected
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition duration-300 ease-in-out
                      ${loading || !selectedFile
                        ? 'bg-indigo-300 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-md hover:shadow-lg cursor-pointer'}`}
          >
            {loading ? 'Uploading...' : 'Upload Image'}
          </button>

          {message && (
            <div
              className={
                `mt-6 p-4 rounded-lg text-center
                ${message.includes('successful')
                  ? 'bg-green-100 dark:bg-green-300/20 text-green-800 dark:text-green-100 border border-green-300 dark:border-green-500'
                  : 'bg-red-100 dark:bg-red-300/20 text-red-800 dark:text-red-100 border border-red-300 dark:border-red-500/50'}`
              }
            >
              <p className="font-medium">{message}</p>
            </div>
          )}

        </motion.div>

        {/* <motion.div
          variants={staggerBox}
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
        </motion.div> */}
      </motion.div>
    </>
  )
}

export default App;

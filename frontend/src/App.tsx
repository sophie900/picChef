import { useState } from 'react'
import { motion, stagger } from "motion/react"
import './App.css'


function App() {
  // State variables
  const [selectedFile, setSelectedFile] = useState<File | null>(null);// Store the selected file
  const [loading, setLoading] = useState<boolean>(false);  // Manage loading status during upload
  const [message, setMessage] = useState<string>('');  // Hold success/error message


  // Handler for file input change
  const handleFileChange = (event: React.FormEvent) => {
    const files = (event.target as HTMLInputElement).files;

    if (files && files.length > 0) {
      console.log('Selected file:', files[0]);  // Debug statement to log the selected file
      setSelectedFile(files[0]);

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
    setMessage('Uploading...');  // Show uploading message

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
      } else {
        const errorData: { detail?: string } = await response.json();  // Type annotation for error JSON response
        setMessage(`Upload failed: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error: any) {  // Catch any type of error
      // Catch network errors or other exceptions
      console.error('Error uploading file:', error);
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
      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        animate="show"
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
                visualDuration: 1,
                bounce: 0.4,
                damping: 9
              }
          }}
          className="bg-white p-8 rounded-lg shadow-lg shadow-indigo-400/40 max-w-md mt-8 mb-8 ml-4 mr-4 border border-gray-200"
        >
          <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Dish Uploader</h2>

          <div className="mb-6">
            <label htmlFor="file-input" className="block text-gray-700 text-sm font-semibold mb-2">
              Select an image of your dish:
            </label>

            <input  // File input for image selection.
              id="file-input"
              type="file"
              accept="image/*"  // Restrict to image files
              value=''  // Initially, no file is selected
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700
                        hover:file:bg-indigo-100"
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
            <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200 text-indigo-700 text-sm">
              <p className="font-medium">Selected File:</p>
              <p className="truncate">{selectedFile.name}</p>
              <p className="text-xs text-indigo-500">Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
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
              className={`mt-6 p-4 rounded-lg text-center
                        ${message.includes('successful') ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}
            >
              <p className="font-medium">{message}</p>
            </div>
          )}

        </motion.div>
      </motion.ul>
    </>
  )
}

export default App;

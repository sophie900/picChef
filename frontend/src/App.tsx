import { useState } from 'react'
import './App.css'


function App() {
  // State to store the selected file
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // State to manage loading status during upload
  const [loading, setLoading] = useState<boolean>(false);

  // State to hold the upload message (success/error)
  const [message, setMessage] = useState<string>('');


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
        setMessage(`Upload successful! File: ${selectedFile.name}`);
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
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }
  };


  return (
    <>
      <h1>picChef</h1>
      <h3 className="italic">From camera to kitchen.</h3>

      {/* <div id="image-upload" className="m-4 p-8 bg-(--dark-grey-2) rounded-lg shadow-lg shadow-(color:--dark-grey-1) min-h-50">
        <label htmlFor="image-upload" className="text-md text-stone-200">
          <h2>Upload an image of your dish:</h2>
        </label>

        <br />

        <input
          type="file"
          id="image-upload"
          name="image-file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-md text-stone-500 file:bg-stone-200 file:p-2 file:rounded-md file:mr-4"/>

        <br />
        <br />

        <button className="bg-blue-500 text-white font-semibold p-2 rounded-md hover:bg-blue-600
          hover:cursor-pointer transition duration-300 ease-in-out">
          Upload Image
        </button>
      </div> */}


      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md m-8 border border-gray-200">
        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Dish Uploader</h2>

        <div className="mb-6">
          <label htmlFor="file-input" className="block text-gray-700 text-sm font-semibold mb-2">
            Select an image of your dish:
          </label>

          <input  // File input for image selection
            id="file-input"
            type="file"
            accept="image/*"  // Restrict to image files
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100 cursor-pointer"
          />
        </div>

        {/* Boolean logic to display file info */}
        {selectedFile && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-blue-800 text-sm">
            <p className="font-medium">Selected File:</p>
            <p className="truncate">{selectedFile.name}</p>
            <p className="text-xs text-blue-600">Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={loading || !selectedFile}  // Disable button when loading or no file selected
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition duration-300 ease-in-out
                     ${loading || !selectedFile
                       ? 'bg-blue-300 cursor-not-allowed'
                       : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md hover:shadow-lg'}`}
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

    </div>

    </>
  )
}

export default App;

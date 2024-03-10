"use client";
import { useState } from "react";
import { create } from "@web3-storage/w3up-client";
import { ThreeDots } from "@/components/Loaders";

export default function Page() {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageURI, setImageURI] = useState("");
  const [text, setText] = useState("");
  const [requestLabelers, setRequestLabelers] = useState(1);
  const [cost, setCost] = useState(5);

  const handleTextChange = (e) => {
    e.preventDefault();
    setText(e.target.value);
  };

  const handleRequestLabelersChange = (e) => {
    const labelers = parseInt(e.target.value);
    setRequestLabelers(labelers);
    setCost(labelers * 5);
  };

  const handleFileChange = (e) => {
    e.preventDefault();
    setFiles([...e.target.files]); // Store all selected files in state
  };

  const uploadFilesToFileCoin = async () => {
    setIsLoading(true);
    const formData = new FormData();
    // Assuming `files` is your array of file objects
    files.forEach((file, index) => {
      formData.append("files[]", file, file.name);
    });

    const request = new Request("/api/filecoin/uploadToIPFS", {
      method: "POST",
      body: formData,
    });

    try {
      const response = await fetch(request);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setImageURI(data.uri["/"] || "");

      const loStoDataType = {
        label: text,
        price: String(cost),
      };

      if (!localStorage.getItem("jobs")) {
        const localStorageData: { [key: string]: typeof loStoDataType } = {};
        localStorageData[data.uri["/"]] = loStoDataType;
        localStorage.setItem("jobs", JSON.stringify(localStorageData));
      } else {
        let jobs: { [key: string]: typeof loStoDataType } = JSON.parse(
          localStorage.getItem("jobs") || "{}"
        );
        jobs[data.uri["/"]] = loStoDataType;
        localStorage.setItem("jobs", JSON.stringify(jobs));
      }

      localStorage.setItem("recentFilesURI", data.uri["/"]);
      localStorage.setItem("recentFilesArray", JSON.stringify(data.files));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
          Request Labeling
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Topic</label>
          <div className="flex items-center">
            <input
              className="border-2 border-gray-300 p-2 rounded-md w-full"
              type="text"
              value={text}
              onChange={handleTextChange}
              placeholder="e.g. cars, cats, dogs"
            />
            {isLoading ? (
              <ThreeDots />
            ) : (
              <input
                className="ml-4"
                type="file"
                onChange={handleFileChange}
                multiple
              />
            )}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Request labelers
          </label>
          <input
            className="border-2 border-gray-300 p-2 rounded-md w-full"
            type="number"
            min="1"
            value={requestLabelers}
            onChange={handleRequestLabelersChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Cost</label>
          <input
            className="border-2 border-gray-300 p-2 rounded-md w-full"
            type="text"
            value={`$${cost}.00`}
            readOnly
          />
        </div>
        {files.length > 0 && (
          <button
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-md"
            onClick={uploadFilesToFileCoin}
          >
            Request Task
          </button>
        )}
        {imageURI && (
          <div className="mt-4">
            <a
              className="text-blue-500 underline"
              href={"https://" + imageURI + ".ipfs.w3s.link"}
            >
              Go To Your Files here: {imageURI}
            </a>
          </div>
        )}
      </div>
    </main>
  );
}

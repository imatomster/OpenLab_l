"use client";
import { useState } from "react";
import { create } from "@web3-storage/w3up-client";
import { ThreeDots } from "@/components/Loaders";

export default function Page() {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageURI, setImageURI] = useState("");
  const [text, setText] = useState("");
  const [price, setPrice] = useState("");

  const handleTextChange = (e) => {
    e.preventDefault();
    setText(e.target.value);
  };

  const handlePriceChange = (e) => {
    e.preventDefault();
    setPrice(e.target.value);
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

    const request = new Request("api/filecoin/uploadToIPFS", {
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
        price: parseInt(price),
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
      <h1 className="title">Upload files with Web3.Storage</h1>
      <div>
        Label this data for a CV model on...
        <input
          className="border-2 border-gray-300 p-2 rounded-md"
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="e.g. cars, cats, dogs"
        />
      </div>
      {isLoading ? (
        <ThreeDots />
      ) : (
        <input
          className="input"
          type="file"
          onChange={handleFileChange}
          multiple
        />
      )}

      <input
        className="border-2 border-gray-300 p-2 rounded-md"
        type="text"
        value={price}
        onChange={handlePriceChange}
        placeholder="0.01 eth"
      />

      {files.length > 0 && (
        <button className="upload" onClick={uploadFilesToFileCoin}>
          Upload Files
        </button>
      )}
      {imageURI && (
        <div className="link">
          <a
            className="underline"
            href={"https://" + imageURI + ".ipfs.w3s.link"}
          >
            Go To Your Files here: {imageURI}
          </a>
          {}
        </div>
      )}
    </main>
  );
}

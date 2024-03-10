"use client";
import { useState, useEffect } from "react";
import { create } from "@web3-storage/w3up-client";
import { ThreeDots } from "@/components/Loaders";

export default function Page() {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageURI, setImageURI] = useState("");

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

    const request = new Request("api/filecoin", {
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

      if (!localStorage.getItem("jobs")) {
        localStorage.setItem("jobs", JSON.stringify([data.uri["/"]]));
      } else {
        let jobs = JSON.parse(localStorage.getItem("jobs") || "[]");
        jobs.push(data.uri["/"]);
        localStorage.setItem("jobs", JSON.stringify(jobs));
      }

      localStorage.setItem("filesURI", data.uri["/"]);
      localStorage.setItem("filesArray", JSON.stringify(data.files));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="title">Upload files with Web3.Storage</h1>
      {isLoading && <ThreeDots />}
      <input
        className="input"
        type="file"
        onChange={handleFileChange}
        multiple
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

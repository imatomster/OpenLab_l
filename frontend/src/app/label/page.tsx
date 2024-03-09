// import "./App.css";
import { Web3Storage } from "web3.storage";
import { useState } from "react";

export default function Page() {
  const [file, setFile] = useState(null);
  const [imageURI, setImageURI] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const client = new Web3Storage({ token: process.env.REACT_APP_TOKEN });
  const handleFileChange = (e) => {
    e.preventDefault();
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  const uploadFile = async () => {
    setIsUploading(true);
    const fileToUpload = new File([file], file.name.split(" ").join(""), {
      type: file.type,
    });
    const cid = await client.put([fileToUpload], {
      name: file.name,
    });
    setImageURI(
      `https://${cid}.ipfs.w3s.link/${file.name.split(" ").join("")}`
    );
    setFile(null);
    setIsUploading(false);
  };

  return (
    <div className="container">
      <h1 className="title">Upload files with Web3.Storage</h1>
      {isUploading && <div className="uploading">Uploading file...</div>}
      <input className="input" type={"file"} onChange={handleFileChange} />
      {file && (
        <button className="upload" onClick={uploadFile}>
          Upload File
        </button>
      )}
      {imageURI.length > 0 && (
        <div className="link">
          <a href={imageURI}>Go To Your File</a>
          {imageURI}
        </div>
      )}
    </div>
  );
}

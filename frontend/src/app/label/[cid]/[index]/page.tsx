"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getImageByIndex, listIPFS } from "@/lib/web3Storage";
import { ThreeDots } from "@/components/Loaders";
import { useAleph } from '@/context/AlephContext'; // Adjust the import path as necessary

export default function Page({
  params,
}: {
  params: { index: string; cid: string };
}) {
  const { index, cid } = params;
  const searchParams = useSearchParams();
  const label = searchParams.get("label");
  const price = searchParams.get("price");
  const CIDLength = searchParams.get("CIDLength");

  const [image, setImage] = useState({});

  useEffect(() => {
    const fetchImages = async () => {
      const imgBlob = await getImageByIndex(cid, index);
      setImage(imgBlob);
      console.log(imgBlob);
    };

    fetchImages();
  }, []);

  const { handleAddPost } = useAleph();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white flex-col bg-opacity-80 p-8 rounded-lg shadow-md w-1/2 mx-auto flex justify-center items-center">
        <span className="mb-5">
          Is this image (number {index}) a {label}?
        </span>
        {image ? (
          <img
            src={image["img"]}
            alt={image["name"]}
            style={{ minWidth: "100%", maxWidth: "100%", height: "auto" }}
          />
        ) : (
          <ThreeDots />
        )}
        <div className="mt-5 flex-row items-center justify-between">
          <button onClick={() => handleAddPost("yes")}
            className="mr-2 bg-black text-white px-4 py-2 rounded-full shadow hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition duration-300"
          >
            Yes
          </button>
          <button onClick={() => handleAddPost("no")}
            className="mr-2 bg-black text-white px-4 py-2 rounded-full shadow hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition duration-300"
          >
            No
          </button>
          <Link
            href={{
              pathname: `/label/${cid}/${index}/result`,
              query: {
                label: label,
                CIDLength: CIDLength,
                price: price,
              },
            }}
            className="mr-2 bg-black text-white px-4 py-2 rounded-full shadow hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition duration-300"
          >
            See Results
          </Link>
        </div>
      </div>
    </main>
  );
}

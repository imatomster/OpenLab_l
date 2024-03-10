"use client";
import { getImageByIndex, listIPFS } from "@/lib/web3Storage";
import { ThreeDots } from "@/components/Loaders";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Page({ params }: { params: { cid: string } }) {
  const searchParams = useSearchParams();
  const label = searchParams.get("label");
  const price = searchParams.get("price");

  // prices are 0 right now for some reason, might not take decimals
  console.log(label, price);

  const { cid } = params;
  const [CIDLength, setCIDLength] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const request = new Request("/api/filecoin/fetchFromIPFS", {
        method: "POST",
        body: cid,
      });

      try {
        const response = await fetch(request);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data;
      } catch (error) {
        console.error("Error uploading to IPFS:", error);
      }
    };

    const fetchImages = async () => {
      const listofIPFS = await listIPFS(cid);
      console.log(listofIPFS);
      const len = listofIPFS.length;
      setCIDLength(len);
    };

    fetchImages();
    return;
    fetchData();
  }, []); // The empty array means this effect runs once on mount

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">
          Computer Vision Job Request for {label}
        </h2>
      </div>
      {!CIDLength ? (
        <div className="mb-10">
          <ThreeDots />
        </div>
      ) : (
        <div className="mb-10">
          There are {CIDLength} images that are stored on{" "}
          <a className="underline" href={"https://" + cid + ".ipfs.w3s.link"}>
            {"https://" + cid + ".ipfs.w3s.link"}
          </a>
        </div>
      )}

      <Link
        href={{
          pathname: `/label/${cid}/${0}`,
          query: {
            label: label,
            CIDLength: CIDLength,
            price: price,
          },
        }}
        className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-black shadow hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
      >
        Begin Labeling
      </Link>
    </main>
  );
}

"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { cid: string } }) {
  const { cid } = params;
  const [cidLength, setCIDLength] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const request = new Request("api/filecoin/fetchFromIPFS", {
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

    fetchData();
  }, []); // The empty array means this effect runs once on mount

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <span>
        Images are stored on{" "}
        <a className="underline" href={"https://" + cid + ".ipfs.w3s.link"}>
          {"https://" + cid + ".ipfs.w3s.link"}
        </a>
      </span>
      <Link
        href={{
          pathname: `/label/${cid}/${0}`,
          query: {
            label: "cat",
            length: "10",
          },
        }}
      >
        Begin Labeling
      </Link>
    </main>
  );
}

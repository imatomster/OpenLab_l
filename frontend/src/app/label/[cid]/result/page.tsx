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

  function TaskCompletedCard() {
    const ethAmount = "XX.XX"; // Replace this with the actual amount

    return (
      <div className="bg-white flex-col bg-opacity-80 p-8 rounded-lg shadow-md w-1/2 mx-auto flex justify-center items-center">
        <div className="flex items-center my-4 space-x-2">
          {" "}
          {/* space-x-2 adds horizontal spacing */}
          <img src="/assets/logo.png" alt="Logo" width={64} height={64} />
          <span className="text-xl font-bold">Task Completed!</span>
        </div>

        <div className="mt-5 flex items-center my-4 space-x-2">
          <Link
            className="bg-white rounded-md shadow-md p-4 flex flex-col items-center text-center"
            href="/"
          >
            Return to Homepage
          </Link>
          <button className="bg-white rounded-md shadow-md p-4 flex flex-col items-center text-center">
            Claim your ${price}!
          </button>
        </div>
      </div>
    );
  }

  const { cid } = params;
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <TaskCompletedCard />
    </main>
  );
}

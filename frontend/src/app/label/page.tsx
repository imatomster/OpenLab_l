"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { siteConfig } from "@/config/site";

export default function Page() {
  const [jobs, setJobs] = useState({});

  type loStoDataType = {
    label: string;
    price: number;
  };

  useEffect(() => {
    const jobs: { [key: string]: loStoDataType } = JSON.parse(
      localStorage.getItem("jobs") || "{}"
    );
    console.log(jobs);
    setJobs(jobs);
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">
          Choose your favorite projects to contribute and earn rewards.
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {jobs &&
          Object.keys(jobs).map((cid, index) => (
            <Link
              href={{
                pathname: `/label/${cid}`,
                query: {
                  label: jobs[cid].label,
                  price: jobs[cid].price,
                },
              }}
              key={index}
              className="bg-white rounded-md shadow-md p-4 flex flex-col items-center text-center"
            >
              <img
                src="https://media.autoexpress.co.uk/image/private/s--X-WVjvBW--/f_auto,t_content-image-full-desktop@1/v1689934611/autoexpress/2023/07/Tesla%20Model%20S%20Plaid%20001_yujihf.jpg"
                alt="Project Image"
                width={200}
                height={150}
                className="mb-4"
              />
              <h3 className="text-lg font-semibold">{jobs[cid].label}</h3>
              <p className="text-sm text-gray-500">
                18K labelers • 2 weeks ago
              </p>
              <div className="mt-4">
                <span className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
                  ${jobs[cid].price}
                </span>
              </div>
            </Link>
          ))}
      </div>
    </main>
  );
}

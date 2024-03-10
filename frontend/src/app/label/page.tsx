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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Please Select a Job that you would like to help label data for:
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
            className="underline"
          >
            {" "}
            Job {index}
          </Link>
        ))}
    </main>
  );
}

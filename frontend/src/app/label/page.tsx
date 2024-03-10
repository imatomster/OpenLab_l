"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { NavBar } from "@/components/NavBar";
import { siteConfig } from "@/config/site";

export default function Page() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const jobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    setJobs(jobs);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Hello
      {jobs &&
        jobs.map((job, index) => (
          <a href={"https://" + job + ".ipfs.w3s.link"} className="underline">
            {" "}
            Job {index}
          </a>
        ))}
    </main>
  );
}

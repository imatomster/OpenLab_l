"use client";
import Link from "next/link";

export default function Page({
  params,
}: {
  params: { index: string; cid: string };
}) {
  const { index, cid } = params;
  let next_index = parseInt(index) + 1;
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      These are all the other labels people did for this image {index} on {cid}:
      <Link href={`/label/${cid}/${next_index}`}> Next Item</Link>
    </main>
  );
}

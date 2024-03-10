"use client";
import Link from "next/link";

export default function Page({
  params,
}: {
  params: { index: string; cid: string };
}) {
  const { index, cid } = params;
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <span>
        This is image {index} stored on {cid}
      </span>
      <span>Is this a picture of a {"cat"}</span>
      <Link href={`/label/${cid}/${index}/result`}> Yes </Link>
      <Link href={`/label/${cid}/${index}/result`}> No </Link>
    </main>
  );
}

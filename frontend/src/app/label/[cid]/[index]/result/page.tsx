"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid"; // Make sure to install `@heroicons/react`

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
  let next_index = parseInt(index) + 1;

  const ActivityList = ({ activities }) => {
    return (
      <div className="w-1/2 mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 to-blue-500 p-4 text-white text-lg font-semibold">
          Activity on Image {index}:{" "}
        </div>
        <ul>
          {activities.map((activity, index) => (
            <li
              key={index}
              className="flex justify-between items-center px-4 py-2 border-b"
            >
              <span className="text-gray-700 font-medium">{activity.user}</span>
              {activity.status === "success" ? (
                // <CheckCircleIcon className="h-5 w-5 text-blue-500" />
                <CheckCircleIcon className="h-5 w-5 text-blue-500" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-red-500" />
              )}
            </li>
          ))}
        </ul>
        <div className="flex justify-center p-4">
          {parseInt(index) + 1 >= parseInt(CIDLength) ? (
            <Link
              href={{
                pathname: `/label/${cid}/result`,
                query: { label: label, CIDLength: CIDLength, price: price },
              }}
              className="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600 focus:outline-none focus:ring"
            >
              {" "}
              Finish{" "}
            </Link>
          ) : (
            <Link
              href={{
                pathname: `/label/${cid}/${next_index}`,
                query: { label: label, CIDLength: CIDLength, price: price },
              }}
              className="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600 focus:outline-none focus:ring"
            >
              {" "}
              Next Item{" "}
            </Link>
          )}
        </div>
      </div>
    );
  };

  function ActivityListModal() {
    function generateRandomActivities(count: string) {
      const activities = [];
      const statuses = ["success", "error"];

      for (let i = 0; i < count; i++) {
        const user = `0x${Math.random().toString(16).substr(2, 10)}...`;
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        activities.push({ user, status });
      }

      return activities;
    }

    const activities = generateRandomActivities(10);
    return <ActivityList activities={activities} />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ActivityListModal />
    </main>
  );
}

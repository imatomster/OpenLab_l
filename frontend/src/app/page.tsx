import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      {/* Use `inline-flex` to make the container of the text an inline5flexbox container */}
      <div className="inline-flex flex-row items-center text-2xl text-white text-center z-10 mb-5">
        {/* Text content */}
        <span>
          PERMISSIONLESS {"<>"} VERIFIABLE {"<>"} DECENTRALIZED DATA
        </span>

        {/* Simulated horizontal line using a border on a span */}
        <span
          className="border-b border-white h-0.5 mx-2"
          style={{ width: "200px" }}
        />
      </div>

      {/* Rounded rectangle with three sections */}
      <div className="flex flex-row justify-around items-center w-full max-w-4xl px-6 py-4 bg-white rounded-2xl shadow-lg z-10">
        {/* Section 1 */}
        <div className="flex-1 text-center">
          <p className="font-semibold">Label Data</p>
          {/* Additional content */}
        </div>

        {/* Vertical dividers */}
        <div className="h-full w-px bg-gray-300"></div>

        {/* Section 2 */}
        <div className="flex-1 text-center">
          <p className="font-semibold">Request Labeling</p>
          {/* Additional content */}
        </div>

        {/* Vertical dividers */}
        <div className="h-full w-px bg-gray-300"></div>

        {/* Section 3 */}
        <div className="flex-1 text-center">
          <p className="font-semibold">My Status</p>
          {/* Additional content */}
        </div>
      </div>
    </div>
  );
}

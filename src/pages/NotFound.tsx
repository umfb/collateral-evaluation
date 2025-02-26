import { Link } from "react-router-dom";
import { GiBeamSatellite } from "react-icons/gi";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
      <img src="/mfb-logo.png" alt="Logo" className="mb-4 w-32 h-auto" />
      <p className="mt-4 text-2xl text-[#800]">
        Uh-oh! Looks like you’ve stumbled into a black hole!
      </p>
      <p className="mt-2 text-lg">Don’t worry, it happens to the best of us!</p>
      <Link
        to="/"
        style={{ textDecoration: "none" }}
        className="mt-6 px-4 flex gap-2 items-center py-2 text-lg text-white active:bg-[#800] bg-[#800] no-underline rounded hover:bg-[#400] transition duration-300"
      >
        <GiBeamSatellite /> Beam Me Back Home
      </Link>
    </div>
  );
}

import AudioRecorder from "./AudioRecorder";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-row bg-orange-500 text-white p-2 text-lg h-12 absolute w-screen z-10 shadow-lg">
      <div className="flex flex-row gap-4">
        <h1 className="font-semibold">STRIVE</h1>
        <p
          className="hover:underline cursor-pointer"
          onClick={handleDialogOpen}
        >
          How to use
        </p>
        <Link to="/goal-setting" className="hover:underline cursor-pointer">
          Goal Setting
        </Link>
      </div>
      <div className="ml-auto flex items-center">
        <AudioRecorder />
      </div>
      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-xl border-4 border-gray-300 shadow-lg text-black ">
            <h2 className="text-xl font-semibold mb-4 text-center">
              How to use
            </h2>
            <p>
              <ul className="list-disc list-inside">
                <li>
                  Select a node from the left sidebar and click on the canvas to
                  add it.
                </li>
                <li>
                  Click on a node to edit its text or add an image or video.
                </li>
                <li>Click on the "Start Recording" button to record audio.</li>
                <li>You can also click on the node to move around the map</li>
              </ul>
            </p>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded flex m-auto"
              onClick={handleDialogClose}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

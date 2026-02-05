import { MapPin, CircleCheckBig, X } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../Button";
import { formatDate, formatTime } from "@/Utilities/helpers";

const ViewMatchModal = ({ isOpen, onClose, data = {} }) => {
  const [showPlayersModal, setShowPlayersModal] = useState(false);
  const [playerList, setPlayerList] = useState([]);

  useEffect(() => {
    setPlayerList(data?.players || []);
  }, [data]);

  if (!isOpen || !data) return null;


  return (
    <>
      {/* MAIN MATCH MODAL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-500 bg-opacity-70">
        <div className="bg-white rounded-3xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between px-6 pt-4 bg-white rounded-t-lg">
            <h2 className="text-xl font-bold">Match Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Title + Location */}
            <div>
              <h3 className="pb-3 text-2xl font-semibold">
                {data?.name || "N/A"}
              </h3>

              <div className="pb-4">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-600" />
                  <span>
                    {data?.location?.country + ", " + data?.location?.state ||
                      "No location specified"}
                  </span>
                </div>
                <p className="ml-6 text-xs text-gray-400">
                  {data?.location?.streetAddress || "No address specified"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <p>{formatDate(data?.date) || "No date"}</p>

                <div className="flex flex-wrap items-center gap-1">
                  <CircleCheckBig className="w-4 h-4 text-green-500" />
                  <span>{(data?.skills || []).join(", ") || "All levels"}</span>
                </div>

                <p>
                  {formatTime(data?.startTime) || "--"} -{" "}
                  {formatTime(data?.endTime) || "--"}
                </p>
              </div>
            </div>

            {/* Player Count */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold">
                  {data?.players?.length + "/" + data?.playersRequired || "N/A"}
                </p>
                <p className="text-sm text-gray-600">Players</p>
              </div>

              <button
                className="font-medium text-buttontext"
                onClick={() => setShowPlayersModal(true)}
              >
                View All
              </button>
            </div>

            <Button
              className="w-full bg-white border-2 border-gray-300 rounded-3xl text-buttontext"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* PLAYERS LIST MODAL */}
      {showPlayersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-70">
          <div className="w-full min-h-[448px] max-w-md p-6 bg-white rounded-3xl ">
            <div className="flex items-center justify-end pb-4">
              <button
                onClick={() => setShowPlayersModal(false)}
                className="text-gray-500"
              >
                <X />
              </button>
            </div>

            <div className="space-y-3 max-h-[448px] overflow-y-auto">
              {playerList.length === 0 && (
                <p className="text-sm text-center text-gray-500">
                  No players joined yet
                </p>
              )}

              {playerList.map((player, index) => (
                <div
                  key={index}
                  className="flex flex-row items-start justify-start rounded-xl"
                >
                  {" "}
                  <img
                    src={player?.profilePic?.url}
                    alt={player?.firstName}
                    className="w-8 h-8 mr-2 rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {player.firstName + " " + player.lastName}
                    </span>
                    <span className="text-xs text-gray-500 ">
                      {player.phone || "1231231231"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewMatchModal;

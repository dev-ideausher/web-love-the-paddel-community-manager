import React, { useState, useRef } from "react";
import { Play, Pause, Trash2 } from "lucide-react";
import { deleteMediaAPI } from "@/services/clubServices";
import ClipLoader from "react-spinners/ClipLoader";

const MediaGallery = ({ businessPhotos = [], businessVideos = [], vendorId, onDeleteMedia, fetchVendorDetail }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [activeMediaTab, setActiveMediaTab] = useState("Photos");
    const [popupImages, setPopupImages] = useState([]);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [isVideo, setIsVideo] = useState(false);
    const videoRef = useRef(null)
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);

    const [isProcessing, setIsProcessing] = useState(false);

    const photos = Array.isArray(businessPhotos) ? businessPhotos : [];
    const videos = Array.isArray(businessVideos) ? businessVideos : [];

    const firstFourImages = photos.slice(0, 4);
    const extraImages = photos.length > 4 ? photos.slice(4) : [];

    const openMediaPopup = (url, isVideo) => {
        setSelectedMedia(url);
        setIsVideo(isVideo);
        setShowPopup(true);
    };

    const togglePopupVideo = (event) => {
        event.stopPropagation();
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        }
    };

    const confirmDeleteMedia = (media, mediaType) => {
        setIsProcessing(true);

        const formattedMediaType = mediaType === "photo" ? "businessPhotos" : "businessVideos";
        setDeleteConfirmation({ ...media, mediaType: formattedMediaType });
        fetchVendorDetail(vendorId)
        setIsProcessing(false);

    };

    const handleDeleteMedia = async () => {
        if (!deleteConfirmation) return;

        const { _id: mediaId, mediaType } = deleteConfirmation;

        await onDeleteMedia(vendorId, mediaType, mediaId);

        setDeleteConfirmation(null);
        setShowPopup(false);
        setSelectedMedia(null);
        if (fetchVendorDetail) {
            fetchVendorDetail();
        }
    };


    return (
        <div className="flex flex-col mb-4">
            <p className="text-sm font-normal text-grey-1 leading-5">Media</p>
            {photos.length === 0 && videos.length === 0 ? (
                <p className=" text-gray-500 mt-4">No data available</p>
            ) : (
                <>
                    {/* Thumbnail Grid */}
                    <div className="flex space-x-4 pt-1">
                        {firstFourImages.map((photo, index) => (
                            <img
                                key={index}
                                src={photo.url || './images/dummyUser.png'}
                                alt={`media-${index}`}
                                className="w-12 h-12 rounded-md cursor-pointer"
                                onClick={() => {
                                    setSelectedMedia(photo.url);
                                    setPopupImages(photos);
                                    setShowPopup(true);
                                    setActiveMediaTab("Photos");
                                }}

                            />

                        ))}

                        {extraImages.length > 0 && (
                            <img
                                src="/images/img5.png"
                                alt="more-media"
                                onClick={() => {
                                    setPopupImages(photos);
                                    setShowPopup(true);
                                    setActiveMediaTab("Photos");
                                }}
                                className="cursor-pointer w-12 h-12 rounded-md"
                            />
                        )}
                    </div>

                    {/* Zoomed-in Media Popup */}
                    {selectedMedia && (
                        <div
                            className="fixed z-[100] inset-0 bg-black bg-opacity-90 flex justify-center items-center"
                            onClick={() => {
                                setSelectedMedia(null);
                            }}
                        >
                            <div className="relative">

                                <button
                                    onClick={() => {

                                        setSelectedMedia(null);
                                        setPopupImages(photos);
                                    }}

                                    className="absolute top-4 right-3 text-white text-2xl font-bold z-10"
                                >
                                    ✕
                                </button>

                                {/\.(mp4|webm|ogg|mov|avi|flv|wmv|mkv)$/i.test(selectedMedia) ? (
                                    <div className="relative">
                                        <video
                                            ref={videoRef}
                                            className="w-[80vw] h-[80vh] max-w-screen-lg max-h-screen-lg rounded-md"
                                            controls
                                            autoPlay
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <source src={selectedMedia} />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                ) : (
                                    <img
                                        src={selectedMedia}
                                        alt="Zoomed Media"
                                        className="w-[550px] max-w-screen-lg rounded-md"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                )}
                            </div>
                        </div>
                    )}


                    {/* Media Popup */}
                    {showPopup && !selectedMedia && (
                        <div className="fixed z-[99] inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white p-6 rounded-lg w-[700px]">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-medium">Media</h2>
                                    <button onClick={() => setShowPopup(false)} className="text-gray-500 text-xl">✕</button>
                                </div>

                                {/* Tabs */}
                                <div className="flex border-b-2">
                                    <button
                                        className={`px-4 py-2 ${activeMediaTab === "Photos" ? "border-b-2 border-red-500 font-bold" : ""}`}
                                        onClick={() => setActiveMediaTab("Photos")}
                                    >
                                        Photos
                                    </button>
                                    <button
                                        className={`px-4 py-2 ${activeMediaTab === "Videos" ? "border-b-2 border-red-500 font-bold" : ""}`}
                                        onClick={() => setActiveMediaTab("Videos")}
                                    >
                                        Videos
                                    </button>
                                </div>

                                {/* Media Grid */}
                                <div className="mt-4 grid grid-cols-5 gap-2">
                                    {activeMediaTab === "Photos" ? (
                                        (popupImages.length > 0 || selectedMedia) ? (

                                            (popupImages.length > 0 ? popupImages : [{ url: selectedMedia }]).map((photo, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={photo.url || './images/dummyUser.png'}
                                                        alt={`popup-media-${index}`}
                                                        className="w-24 h-24 rounded-md cursor-pointer"
                                                        onClick={() => setSelectedMedia(photo.url)}
                                                    />
                                                    {/* Delete Button */}
                                                    <button onClick={() => confirmDeleteMedia(photo, 'photo')} className="absolute top-0 right-0 p-1 rounded-full">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (

                                            <p className="text-center text-gray-500 col-span-5">No photos found</p>
                                        )
                                    ) : (
                                        videos.length > 0 ? (
                                            videos.map((video, index) => (
                                                <div key={index} className="relative w-24 h-24 cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedMedia(video.url);
                                                        setShowPopup(true);
                                                    }}
                                                >
                                                    <video className="w-24 h-24 rounded-md">
                                                        <source src={video.url} type="video/mp4" />
                                                        Your browser does not support the video tag.
                                                    </video>

                                                    {/* Play Icon */}
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xl rounded-md">
                                                        <Play size={20} />
                                                    </div>

                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={() => confirmDeleteMedia(video, 'video')}
                                                        className="absolute top-0 right-0 p-1 rounded-full"
                                                    >
                                                        <Trash2 size={16} color="#fff" />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            // Show this if there are no videos
                                            <p className="text-center text-gray-500 col-span-5">No videos found</p>
                                        )
                                    )}
                                </div>

                            </div>
                        </div>
                    )}
                </>
            )}
            {/* Delete Confirmation Popup */}
            {deleteConfirmation && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-[999]">
                    <div className="bg-white px-9 py-8 rounded-lg shadow-lg w-96">

                        <div className="flex justify-between items-center">
                            <h2 className="text-lg text-black-1 font-semibold">
                                Delete Media?
                            </h2>
                            <button
                                className="text-black text-3xl flex mt-[-30px] justify-end"
                                onClick={() => setDeleteConfirmation(null)}
                            >
                                ×
                            </button>
                        </div>    <p className="text-grey-4 mt-2">
                            Are you sure you want to delete this Media? This action cannot be undone.
                        </p>
                        <div className="flex justify-center space-x-3 mt-5">
                            <button
                                className="py-2 w-1/2 px-5 border-2 border-red-500 text-red-500 rounded-lg"
                                onClick={() => setDeleteConfirmation(null)}
                            >
                                No
                            </button>
                            <button
                                className="py-2 w-1/2 px-5 bg-red-500 text-white rounded-lg flex items-center justify-center"
                                onClick={handleDeleteMedia}
                                disabled={isProcessing}
                            >
                                {isProcessing ? <ClipLoader color="white" size={20} /> : "Yes"}
                            </button>

                          

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default MediaGallery;

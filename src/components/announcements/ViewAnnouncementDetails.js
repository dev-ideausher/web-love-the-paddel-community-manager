import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import Button from "../Button";

const ViewAnnouncementDetails = ({ isOpen, onClose, title, data = {} }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState([]);
  const images = data?.images || [];

  useEffect(() => {
    const urls = images.map(img => {
      if (typeof img === 'string') return img;
      if (img?.url) return img.url;
      if (img instanceof File) return URL.createObjectURL(img);
      return null;
    }).filter(Boolean);
    
    setImageUrls(urls);
    
    return () => {
      urls.forEach(url => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [images]);

  if (!isOpen || !data) return null;

  console.log("data images:", data);

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-500 bg-opacity-70">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 px-6 pt-4 bg-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-black-1">
              Announcement Details
            </h2>

            <button
              className="text-2xl text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex flex-col">
            <span>Sub Community</span>
            <span className="text-2xl font-semibold rs-text-capitalize pb-[17px]">
              {data?.title || "N/A"}
            </span>
            <span className="text-base font-semibold">
              {data?.subtitle || "No description"}
            </span>
            <span className="text-sm font-semibold">
              {data?.description || "No description"}
            </span>
          </div>

          {/* Slideshow - Added Only Here */}
          {imageUrls.length > 0 && (
            <div className="space-y-2">
              {/* Main Image with Navigation */}
              <div className="relative group">
                <img
                  src={imageUrls[currentImageIndex]}
                  alt="Community image"
                  className="object-cover w-full h-48 rounded-xl"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                {imageUrls.length > 1 && (
                  <>
                    <button
                      onClick={goToPrevious}
                      className="absolute p-2 transition-opacity -translate-y-1/2 rounded-lg opacity-0 left-2 top-1/2 bg-white/90 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={goToNext}
                      className="absolute p-2 transition-opacity -translate-y-1/2 rounded-lg opacity-0 right-2 top-1/2 bg-white/90 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
          <div className="flex items-start justify-between w-full align-center">
            <div className="flex flex-col">
              <p className="text-2xl font-semibold">{data?.members || 0}</p>
              <p className="text-sm text-gray-600">Members</p>
            </div>
          </div>
          <button
            type="button"
            className="w-full px-8 py-3 transition-colors bg-white border-2 border-gray-300 rounded-3xl text-buttontext"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAnnouncementDetails;

import { InputWithLabel } from "@/components/ui/InputWithLabel";
import { SearchIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import Loader from "../ui/Loader";
import Pagination from "../Paignation";
import Button from "../Button";
import Popuplist from "../Popuplist";
import DeleteModal from "../ui/DeleteModal";
import ConfirmationModal from "../ui/ConfirmationModal";
import CreateSubCommunityModal from "./CreateSubCommunityModal";
import ViewSubCommunityModal from "./ViewSubCommunityModal";
import EditSubCommunityModal from "./EditSubCommunityModal";
import StatusChip from "../ui/StatusChip";
import { uploadFile } from "@/services/uploadServices";
import { createSubCommunity, getSubCommunitiesList, deleteSubCommunity, updateSubCommunity } from "@/services/subCommunityServices";

const dummyData = [
  {
    _id: "1",
    title: "Downtown Paddlers",
    description:
      "Local paddling enthusiasts meeting weekly at the downtown club.",
    dateCreated: "2026-01-10",
    images: [
      { id: 1, url: "https://via.placeholder.com/300x200?text=Image+1" },
      { id: 2, url: "https://via.placeholder.com/300x200?text=Image+2" },
      { id: 3, url: "https://via.placeholder.com/300x200?text=Image+3" },
    ],
    members: 24,
    status: "active",
  },
  {
    _id: "2",
    title: "River Runners Club",
    description: "Adventure group for whitewater rafting and kayaking trips.",
    dateCreated: "2026-01-08",
    members: 15,
    images: [
      { id: 1, url: "https://via.placeholder.com/300x200?text=Image+1" },
      { id: 2, url: "https://via.placeholder.com/300x200?text=Image+2" },
      { id: 3, url: "https://via.placeholder.com/300x200?text=Image+3" },
    ],
    status: "active",
  },
  {
    _id: "3",
    title: "Weekend Warriors",
    description: "Casual weekend paddlers looking for friendly competitions.",
    dateCreated: "2026-01-05",
    members: 32,
    images: [
      { id: 1, url: "https://via.placeholder.com/300x200?text=Image+1" },
      { id: 2, url: "https://via.placeholder.com/300x200?text=Image+2" },
      { id: 3, url: "https://via.placeholder.com/300x200?text=Image+3" },
    ],
    status: "active",
  },
  {
    _id: "4",
    title: "Elite Paddlers",
    description: "Competitive team training for national championships.",
    dateCreated: "2026-01-03",
    members: 8,
    images: [
      { id: 1, url: "https://via.placeholder.com/300x200?text=Image+1" },
      { id: 2, url: "https://via.placeholder.com/300x200?text=Image+2" },
      { id: 3, url: "https://via.placeholder.com/300x200?text=Image+3" },
    ],
    status: "active",
  },
  {
    _id: "5",
    title: "Family Floaters",
    description: "Family-friendly calm water paddling group.",
    dateCreated: "2026-01-02",
    members: 41,
    images: [
      { id: 1, url: "https://via.placeholder.com/300x200?text=Image+1" },
      { id: 2, url: "https://via.placeholder.com/300x200?text=Image+2" },
      { id: 3, url: "https://via.placeholder.com/300x200?text=Image+3" },
    ],
    status: "active",
  },
  {
    _id: "6",
    title: "Night Paddlers",
    description: "Evening paddling sessions under the city lights.",
    dateCreated: "2025-12-28",
    images: [
      { id: 1, url: "https://via.placeholder.com/300x200?text=Image+1" },
      { id: 2, url: "https://via.placeholder.com/300x200?text=Image+2" },
      { id: 3, url: "https://via.placeholder.com/300x200?text=Image+3" },
    ],
    members: 12,
    status: "active",
  },
  {
    _id: "7",
    title: "Kayak Kings",
    description: "Kayak-only group exploring local rivers and lakes.",
    dateCreated: "2025-12-25",
    members: 19,
    images: [
      { id: 1, url: "https://via.placeholder.com/300x200?text=Image+1" },
      { id: 2, url: "https://via.placeholder.com/300x200?text=Image+2" },
      { id: 3, url: "https://via.placeholder.com/300x200?text=Image+3" },
    ],
    status: "active",
  },
  {
    _id: "8",
    title: "Canoe Collective",
    description: "Traditional canoe enthusiasts preserving the craft.",
    dateCreated: "2025-12-20",
    members: 7,
    images: [
      { id: 1, url: "https://via.placeholder.com/300x200?text=Image+1" },
      { id: 2, url: "https://via.placeholder.com/300x200?text=Image+2" },
      { id: 3, url: "https://via.placeholder.com/300x200?text=Image+3" },
    ],
    status: "active",
  },
  {
    _id: "9",
    title: "SUP Squad",
    description: "Stand-up paddleboarders uniting for group sessions.",
    dateCreated: "2025-12-15",
    members: 28,
    images: [
      { id: 1, url: "https://via.placeholder.com/300x200?text=Image+1" },
      { id: 2, url: "https://via.placeholder.com/300x200?text=Image+2" },
      { id: 3, url: "https://via.placeholder.com/300x200?text=Image+3" },
    ],
    status: "active",
  },
  {
    _id: "10",
    title: "Paddle Pros",
    description: "Professional paddlers networking and sharing techniques.",
    dateCreated: "2025-12-10",
    members: 5,
    images: [
      { id: 1, url: "https://via.placeholder.com/300x200?text=Image+1" },
      { id: 2, url: "https://via.placeholder.com/300x200?text=Image+2" },
      { id: 3, url: "https://via.placeholder.com/300x200?text=Image+3" },
    ],
    status: "active",
  },
  {
    _id: "11",
    title: "Lake Lappers",
    description: "Lake-focused paddlers doing laps and endurance training.",
    dateCreated: "2025-12-05",
    members: 16,
    images: [
      { id: 1, url: "https://via.placeholder.com/300x200?text=Image+1" },
      { id: 2, url: "https://via.placeholder.com/300x200?text=Image+2" },
      { id: 3, url: "https://via.placeholder.com/300x200?text=Image+3" },
    ],
    status: "active",
  },
];

const SubCommunitiesTable = () => {
  const [isClient, setIsClient] = useState(false);
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [parentCommunityId, setParentCommunityId] = useState("69523e5ce4e6606aa7ac3d5b");

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showToggleStatusModal, setShowToggleStatusModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedDelete, setSelectedDelete] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch sub-communities from API
  const fetchSubCommunities = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getSubCommunitiesList({ limit: 100 });
      console.log('Fetch response:', response);
      if (response.status && response.data) {
        const dataArray = Array.isArray(response.data.results) ? response.data.results : [];
        console.log('Data array:', dataArray);
        const filtered = dataArray.filter(item => item.parentCommunity === parentCommunityId);
        const formattedData = filtered.map(item => {
          let locationStr = "";
          if (item.location) {
            if (typeof item.location === 'string') {
              locationStr = item.location;
            } else if (item.location.streetAddress) {
              locationStr = item.location.streetAddress;
            } else if (item.location.position?.coordinates) {
              const [lng, lat] = item.location.position.coordinates;
              locationStr = `${lat}, ${lng}`;
            }
          }
          // Use status field directly if it exists, otherwise fall back to isActive
          let status = "active";
          if (item.status) {
            status = item.status;
          } else if (item.hasOwnProperty('isActive')) {
            status = item.isActive ? "active" : "inactive";
          }
          return {
            _id: item._id,
            title: item.name,
            description: item.description,
            dateCreated: new Date(item.createdAt).toISOString().split("T")[0],
            members: item.members?.length || 0,
            status: status,
            images: item.images || [],
            location: locationStr,
            locationData: item.location,
          };
        });
        setOriginalData(formattedData);
        setFilteredData(formattedData);
      }
    } catch (error) {
      console.error("Failed to fetch sub-communities:", error);
    } finally {
      setLoading(false);
    }
  }, [parentCommunityId]);

  useEffect(() => {
    fetchSubCommunities();
  }, [fetchSubCommunities]);

  const handleCreateCommunity = async (newCommunityData) => {
    setIsProcessing(true);
    try {
      if (!parentCommunityId) {
        console.error('Parent community ID is required');
        alert('Parent community ID is not set. Please configure it first.');
        setIsProcessing(false);
        return;
      }

      const payload = {
        name: newCommunityData.title,
        description: newCommunityData.description,
        parentCommunity: newCommunityData.parentCommunity,
        isSubCommunity: true,
        tagline: newCommunityData.title.length >= 5 ? newCommunityData.title : newCommunityData.description.substring(0, 50),
      };

      console.log('Creating with payload:', payload);

      // Upload profilePic
      if (newCommunityData.profilePic) {
        try {
          const uploadResult = await uploadFile(newCommunityData.profilePic);
          if (uploadResult.status && uploadResult.data?.url) {
            payload.profilePic = uploadResult.data.url;
          }
        } catch (error) {
          console.error('Profile pic upload failed:', error);
        }
      }

      // Upload banner images
      if (newCommunityData.images?.length > 0) {
        try {
          const uploadPromises = newCommunityData.images.map(img => uploadFile(img));
          const results = await Promise.all(uploadPromises);
          const urls = results.filter(r => r.status && r.data?.url).map(r => r.data.url);
          if (urls.length > 0) {
            payload.bannerPic = urls;
          }
        } catch (error) {
          console.error('Banner images upload failed:', error);
        }
      }

      // Add socialLinks if provided
      if (newCommunityData.socialLinks && newCommunityData.socialLinks.length > 0) {
        payload.socialLinks = newCommunityData.socialLinks;
      }

      // Add location if it exists
      if (newCommunityData.location && newCommunityData.locationCoords) {
        payload.location = {
          position: {
            type: "Point",
            coordinates: [newCommunityData.locationCoords.lng, newCommunityData.locationCoords.lat]
          },
          streetAddress: newCommunityData.location
        };
      }

      const response = await createSubCommunity(payload);
      
      if (response.status) {
        // If status is inactive, update it after creation
        if (newCommunityData.status === "inactive" && response.data?._id) {
          console.log('Attempting to set inactive status for:', response.data._id);
          const updateResponse = await updateSubCommunity(response.data._id, { isActive: false });
          console.log('Update response:', updateResponse);
        }
        setShowCreateModal(false);
        await fetchSubCommunities();
      } else {
        alert(`Failed to create sub-community: ${response.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Failed to create community:", error);
      alert(`Error: ${error.message || 'Failed to create sub-community'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const router = useRouter();
  let searchTimeout;

  // Filter and paginate data
  const getPaginatedData = useCallback((data, page, limit) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return data.slice(startIndex, endIndex);
  }, []);

  // Update filtered data based on search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filtered = originalData.filter(
        (item) =>
          (item.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.description || "").toLowerCase().includes(searchTerm.toLowerCase())
      );

      setFilteredData(filtered);
      setPagination((prev) => ({
        ...prev,
        page: 1,
        totalPages: Math.ceil(filtered.length / prev.limit) || 1,
      }));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, originalData]);

  // Update displayed data when pagination or filtered data changes
  useEffect(() => {
    const paginatedData = getPaginatedData(
      filteredData,
      pagination.page,
      pagination.limit
    );
    setAllData(paginatedData);
  }, [filteredData, pagination.page, pagination.limit, getPaginatedData]);

  // Modal handlers
  const openDeleteModal = (id) => {
    setSelectedDelete(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedDelete(null);
  };

  const openViewModal = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const openToggleStatusModal = (item) => {
    setSelectedItem(item);
    setShowToggleStatusModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDelete) return;
    setIsProcessing(true);
    try {
      await deleteSubCommunity(selectedDelete);
      await fetchSubCommunities();
      closeDeleteModal();
    } catch (error) {
      console.error("Failed to delete sub-community:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleStatusConfirm = async () => {
    setIsProcessing(true);
    try {
      const newStatus = selectedItem.status === "active" ? "inactive" : "active";
      const payload = {
        name: selectedItem.title,
        tagline: selectedItem.title,
        status: newStatus
      };
      const updateResponse = await updateSubCommunity(selectedItem._id, payload);
      await fetchSubCommunities();
      setShowToggleStatusModal(false);
    } catch (error) {
      console.error("Failed to toggle sub-community status:", error);
      alert('Failed to update status. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditSave = async (updatedData) => {
    setIsProcessing(true);
    try {
      const payload = {
        name: updatedData.title,
        tagline: updatedData.title,
        status: updatedData.status
      };

      if (updatedData.images && updatedData.images.length > 0) {
        const uploadPromises = updatedData.images.map(img => uploadFile(img));
        const results = await Promise.all(uploadPromises);
        const urls = results.filter(r => r.status && r.data?.url).map(r => r.data.url);
        if (urls.length > 0) {
          payload.bannerPic = urls;
        }
      }

      const updateResponse = await updateSubCommunity(selectedItem._id, payload);
      
      if (updateResponse.status) {
        await fetchSubCommunities();
        setShowEditModal(false);
      } else {
        alert('Failed to update sub-community. Please try again.');
      }
    } catch (error) {
      console.error("Failed to update sub-community:", error);
      alert('Failed to update sub-community. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Get current page data for S.No calculation
  const currentPageData = getPaginatedData(
    filteredData,
    pagination.page,
    pagination.limit
  );

  return (
    <div>
      <Loader loading={loading} />
      <CreateSubCommunityModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateCommunity}
        isLoading={isProcessing}
        parentCommunityId={parentCommunityId}
      />
      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        isProcessing={isProcessing}
        title="Delete this Sub Community?"
        message="Are you sure you want to delete this community? This action cannot be undone."
      />

      {/* View Modal */}
      <ViewSubCommunityModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title={`${selectedItem?.title || ""} Details`}
        data={selectedItem}
      />

      {/* Edit Modal */}
      <EditSubCommunityModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleEditSave}
        title={`Edit ${selectedItem?.title || ""}`}
        initialData={selectedItem || {}}
        isLoading={isProcessing}
        fields={[
          { key: "title", label: "Community Name", required: true },
          { key: "description", label: "Description", required: true },
          {
            key: "status",
            label: "Status",
            type: "select",
            required: true,
            options: [
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ],
          },
        ]}
      />

      {/* Toggle Status Confirmation Modal */}
      <ConfirmationModal
        isOpen={showToggleStatusModal}
        onClose={() => setShowToggleStatusModal(false)}
        onConfirm={handleToggleStatusConfirm}
        title={`${selectedItem?.status === "active" ? "Deactivate" : "Activate"} Sub Community?`}
        message={`Are you sure you want to ${selectedItem?.status === "active" ? "deactivate" : "activate"} "${selectedItem?.title}"?`}
        confirmText={`Yes, ${selectedItem?.status === "active" ? "deactivate" : "activate"}`}
        cancelText="Cancel"
        isProcessing={isProcessing}
      />

      <div className="flex items-center justify-between m-4 mb-6">
        <InputWithLabel
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md rounded-full text-zinc-500"
          iconType={"pre"}
        >
          <SearchIcon />
        </InputWithLabel>

        <div className="flex gap-6">
          <Button
            className="flex gap-1 py-3 whitespace-nowrap"
            onClick={() => setShowCreateModal(true)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M9.16699 9.16699V4.16699H10.8337V9.16699H15.8337V10.8337H10.8337V15.8337H9.16699V10.8337H4.16699V9.16699H9.16699Z"
                fill="white"
              />
            </svg>
            New Sub-Community
          </Button>
        </div>
      </div>

      <div className="pt-2 m-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">
            Showing {currentPageData.length} of {filteredData.length} entries
          </span>
        </div>

        <Table className="min-w-full overflow-x-auto">
          <TableHeader className="border-t-1">
            <TableRow className="rounded-lg bg-light-blue">
              <TableHead className="text-sm font-normal text-left text-white">
                S.No
              </TableHead>
              <TableHead className="text-sm font-normal text-left text-white">
                Community Name
              </TableHead>
              <TableHead className="text-sm font-normal text-left text-white">
                Description
              </TableHead>
              <TableHead className="text-sm font-normal text-left text-white">
                Date Created
              </TableHead>
              <TableHead className="text-sm font-normal text-left text-white">
                Members
              </TableHead>
              <TableHead className="text-sm font-normal text-left text-white">
                Status
              </TableHead>
              <TableHead className="text-sm font-normal text-left text-white">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPageData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-12 text-center text-gray-500"
                >
                  {filteredData.length === 0
                    ? "No data matches your search"
                    : "No data available"}
                </TableCell>
              </TableRow>
            ) : (
              currentPageData.map((item, index) => (
                <TableRow key={item._id} className="bg-white hover:bg-gray-50">
                  <TableCell>
                    <span className="text-sm font-normal text-black-3">
                      {(pagination.page - 1) * pagination.limit + index + 1}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="block max-w-xs text-sm font-normal font-medium truncate text-black-3">
                      {item?.title || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="block max-w-xs text-sm font-normal truncate text-black-3">
                      {item?.description || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-normal text-black-3">
                      {item?.dateCreated || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-normal text-black-3">
                      {item?.members || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusChip status={item?.status || "inactive"} />
                  </TableCell>
                  <TableCell className="flex items-center">
                    <Popuplist>
                      <span
                        onClick={() => openViewModal(item)}
                        className="flex items-center w-full gap-2 px-3 py-2 text-sm font-normal text-black rounded-lg cursor-pointer hover:text-primary hover:bg-gray-100"
                      >
                        View
                      </span>
                      <span
                        onClick={() => openEditModal(item)}
                        className="flex items-center w-full gap-2 px-3 py-2 text-sm font-normal text-black rounded-lg cursor-pointer hover:text-primary hover:bg-gray-100"
                      >
                        Edit
                      </span>
                      <span
                        onClick={() => openToggleStatusModal(item)}
                        className="flex items-center w-full gap-2 px-3 py-2 text-sm font-normal text-black rounded-lg cursor-pointer hover:text-primary hover:bg-gray-100"
                      >
                        {item.status === "active" ? "Inactive" : "Active"}
                      </span>
                      <span
                        onClick={() => openDeleteModal(item._id)}
                        className="flex items-center w-full gap-2 px-3 py-2 text-sm font-normal text-red-600 rounded-lg cursor-pointer hover:text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </span>
                    </Popuplist>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Pagination pagination={pagination} setPagination={setPagination} totalItems={filteredData.length} />
      </div>
    </div>
  );
};

export default SubCommunitiesTable;

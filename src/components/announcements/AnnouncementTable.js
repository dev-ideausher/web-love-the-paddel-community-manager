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
import Link from "next/link";
import { formatDate, downloadCSV } from "@/Utilities/helpers";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import Loader from "../ui/Loader";
import { ClipLoader } from "react-spinners";
import Pagination from "../Paignation";
import Button from "../Button";
import Popuplist from "../Popuplist";
import DeleteModal from "../ui/DeleteModal";
import EditModal from "./EditAnnouncementModal";
import ConfirmationModal from "../ui/ConfirmationModal";
import CreateSubCommunityModal from "./CreateAnnouncementModal";
import ViewSubCommunityModal from "./ViewAnnouncementDetails";
import EditSubCommunityModal from "./EditAnnouncementModal";
import NotificationDropdown from "../NotificationDropdown";
import StatusChip from "../ui/StatusChip";
import ViewAnnouncementDetails from "./ViewAnnouncementDetails";
import CreateAnnouncementModal from "./CreateAnnouncementModal";
import EditAnnouncementModal from "./EditAnnouncementModal";
import { createAnnouncement } from "@/services/announcementServices";

const dummyData = [
  {
    _id: "1",
    title: "Downtown Paddlers",
    subtitle: " Downtown Paddling Club",
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
    subtitle: " Downtown Paddling Club",

    description: "Adventure group for whitewater rafting and kayaking trips.",
    dateCreated: "2026-01-08",
    subtitle: " Downtown Paddling Club",

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
    subtitle: " Downtown Paddling Club",

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
    subtitle: " Downtown Paddling Club",

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
    subtitle: " Downtown Paddling Club",

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
    subtitle: " Downtown Paddling Club",

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
    subtitle: " Downtown Paddling Club",

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
    subtitle: " Downtown Paddling Club",

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
    subtitle: " Downtown Paddling Club",

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
    subtitle: " Downtown Paddling Club",

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
    subtitle: " Downtown Paddling Club",

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

const AnnounementTable = () => {
  const [isClient, setIsClient] = useState(false);
  const [allData, setAllData] = useState(dummyData);
  const [filteredData, setFilteredData] = useState(dummyData);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedDelete, setSelectedDelete] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const handleCreateCommunity = async (newCommunityData) => {
    setIsProcessing(true);
    try {
      const payload = {
        title: newCommunityData.title,
        description: newCommunityData.description,
        type: "text",
        communityId: "69523e5ce4e6606aa7ac3d5b"
      };

      const result = await createAnnouncement(payload);
      
      if (result.status) {
        const newCommunity = {
          _id: result.data._id,
          title: result.data.title,
          description: result.data.description,
          dateCreated: new Date(result.data.createdAt).toISOString().split("T")[0],
          members: 0,
          status: result.data.status,
          images: [],
        };

        setFilteredData([newCommunity, ...filteredData]);
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error("Failed to create announcement:", error);
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
      const filtered = dummyData.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setFilteredData(filtered);
      setPagination((prev) => ({
        ...prev,
        page: 1,
        totalPages: Math.ceil(filtered.length / prev.limit),
      }));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

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

  const openInactiveModal = (item) => {
    setSelectedItem(item);
    setShowInactiveModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDelete) return;
    setIsProcessing(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Filter from original data and re-paginate
      const newFiltered = filteredData.filter(
        (item) => item._id !== selectedDelete
      );
      setFilteredData(newFiltered);

      // Update pagination if needed
      const newTotalPages = Math.ceil(newFiltered.length / pagination.limit);
      if (pagination.page > newTotalPages && newTotalPages > 0) {
        setPagination((prev) => ({ ...prev, page: newTotalPages }));
      }

      closeDeleteModal();
    } catch (error) {
      console.error("Failed to delete sub-community:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInactiveConfirm = async () => {
    setIsProcessing(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFilteredData((prev) =>
        prev.map((item) =>
          item._id === selectedItem._id ? { ...item, status: "inactive" } : item
        )
      );
      setShowInactiveModal(false);
    } catch (error) {
      console.error("Failed to inactive sub-community:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditSave = async (updatedData) => {
    setIsProcessing(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFilteredData((prev) =>
        prev.map((item) =>
          item._id === selectedItem._id ? { ...item, ...updatedData } : item
        )
      );
      setShowEditModal(false);
    } catch (error) {
      console.error("Failed to update sub-community:", error);
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
      <CreateAnnouncementModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateCommunity}
        isLoading={isProcessing}
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
      <ViewAnnouncementDetails
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title={`${selectedItem?.title || ""} Details`}
        data={selectedItem}
      />

      {/* Edit Modal */}
      <EditAnnouncementModal
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

      {/* Inactive Confirmation Modal */}
      <ConfirmationModal
        isOpen={showInactiveModal}
        onClose={() => setShowInactiveModal(false)}
        onConfirm={handleInactiveConfirm}
        title="Inactive Sub Community?"
        message={`Are you sure you want to make "${selectedItem?.title}" inactive?`}
        confirmText="Yes, make inactive"
        cancelText="Cancel"
        isProcessing={isProcessing}
      />

      <div className="flex items-center justify-between m-4 mb-6">
        <InputWithLabel
          placeholder="Search by title or description"
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
            Create Announcement
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
                Title
              </TableHead>
              <TableHead className="text-sm font-normal text-left text-white">
                Community
              </TableHead>
              <TableHead className="text-sm font-normal text-left text-white">
                Date Created
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
                  colSpan={6}
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
                  <TableCell className="text-left">
                    <span className="text-sm font-normal text-black-3">
                      {(pagination.page - 1) * pagination.limit + index + 1}
                    </span>
                  </TableCell>
                  <TableCell className="text-left">
                    <span className="text-sm font-normal font-medium truncate text-black-3">
                      {item?.title || "N/A"}
                    </span>{" "}
                    <span className="block max-w-xs text-sm font-light truncate font-extralight text-black-3">
                      {item?.subtitle || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="text-left">
                    <span className="block max-w-xs text-sm font-normal truncate text-black-3">
                      {item?.description || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="text-left">
                    <span className="text-sm font-normal text-black-3">
                      {item?.dateCreated || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="text-left">
                    <span className="text-sm font-normal text-black-3">
                      <StatusChip status={item?.status || "inactive"} />
                    </span>
                  </TableCell>
                  <TableCell className="text-left">
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

        <Pagination pagination={pagination} setPagination={setPagination} />
      </div>
    </div>
  );
};

export default AnnounementTable;

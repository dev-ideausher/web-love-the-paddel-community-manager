import { InputWithLabel } from "@/components/ui/InputWithLabel";
import { Download, SearchIcon } from "lucide-react";
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
import ConfirmationModal from "../ui/ConfirmationModal";
import StatusChip from "../ui/StatusChip";
import TransactionFilter from "./TransactionFilter";

const dummyData = [
  {
    _id: "TXN001",
    transactionId: "#TXN-2026-001",
    user: {
      name: "John Doe",
      avatar: "https://via.placeholder.com/40x40/4F46E5/FFFFFF?text=JD",
    },
    match: "Paddling Event Match",
    amount: 250.0,
    date: "2026-01-15",
    status: "completed",
  },
  {
    _id: "TXN002",
    transactionId: "#TXN-2026-002",
    user: {
      name: "Jane Smith",
      avatar: "https://via.placeholder.com/40x40/10B981/FFFFFF?text=JS",
    },
    match: "Kayak Tournament",
    amount: 150.5,
    date: "2026-01-14",
    status: "pending",
  },
  {
    _id: "TXN003",
    transactionId: "#TXN-2026-003",
    user: {
      name: "Mike Johnson",
      avatar: "https://via.placeholder.com/40x40/EF4444/FFFFFF?text=MJ",
    },
    match: "River Race Entry",
    amount: 320.0,
    date: "2026-01-13",
    status: "completed",
  },
  {
    _id: "TXN004",
    transactionId: "#TXN-2026-004",
    user: {
      name: "Sarah Wilson",
      avatar: "https://via.placeholder.com/40x40/F59E0B/FFFFFF?text=SW",
    },
    match: "Weekend Warriors Fee",
    amount: 75.25,
    date: "2026-01-12",
    status: "failed",
  },
  {
    _id: "TXN005",
    transactionId: "#TXN-2026-005",
    user: {
      name: "David Brown",
      avatar: "https://via.placeholder.com/40x40/8B5CF6/FFFFFF?text=DB",
    },
    match: "SUP Squad Membership",
    amount: 99.99,
    date: "2026-01-11",
    status: "completed",
  },
  {
    _id: "TXN006",
    transactionId: "#TXN-2026-006",
    user: {
      name: "Emily Davis",
      avatar: "https://via.placeholder.com/40x40/06B6D4/FFFFFF?text=ED",
    },
    match: "Night Paddlers Gear",
    amount: 189.75,
    date: "2026-01-10",
    status: "pending",
  },
  {
    _id: "TXN007",
    transactionId: "#TXN-2026-007",
    user: {
      name: "Chris Lee",
      avatar: "https://via.placeholder.com/40x40/EC4899/FFFFFF?text=CL",
    },
    match: "Elite Paddlers Entry",
    amount: 450.0,
    date: "2026-01-09",
    status: "completed",
  },
  {
    _id: "TXN008",
    transactionId: "#TXN-2026-008",
    user: {
      name: "Lisa Garcia",
      avatar: "https://via.placeholder.com/40x40/F97316/FFFFFF?text=LG",
    },
    match: "Family Floaters Pass",
    amount: 120.0,
    date: "2026-01-08",
    status: "completed",
  },
  {
    _id: "TXN009",
    transactionId: "#TXN-2026-009",
    user: {
      name: "Tom Anderson",
      avatar: "https://via.placeholder.com/40x40/14B8A6/FFFFFF?text=TA",
    },
    match: "Canoe Collective Fee",
    amount: 85.5,
    date: "2026-01-07",
    status: "cancelled",
  },
  {
    _id: "TXN010",
    transactionId: "#TXN-2026-010",
    user: {
      name: "Rachel Taylor",
      avatar: "https://via.placeholder.com/40x40/7C3AED/FFFFFF?text=RT",
    },
    match: "Paddle Pros Workshop",
    amount: 175.0,
    date: "2026-01-06",
    status: "completed",
  },
];

const TransactionTable = () => {
  const [filter, setFilter] = useState("all");
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Add new community to filtered data (at top)
      const newCommunity = {
        _id: Date.now().toString(),
        ...newCommunityData,
        dateCreated: new Date().toISOString().split("T")[0],
        members: 0,
        status: "active",
        images: newCommunityData.images.map((img, idx) => ({
          id: idx,
          url: URL.createObjectURL(img),
        })),
      };

      setFilteredData([newCommunity, ...filteredData]);
      setShowCreateModal(false);
      setFormData({ title: "", description: "" });
      setImages([]);
      setImagePreviews([]);
    } catch (error) {
      console.error("Failed to create community:", error);
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
          item.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.match.toLowerCase().includes(searchTerm.toLowerCase())
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

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        isProcessing={isProcessing}
        title="Delete this Sub Community?"
        message="Are you sure you want to delete this community? This action cannot be undone."
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
          className="max-w-md rounded-3xl text-zinc-500"
          iconType={"pre"}
        >
          <SearchIcon />
        </InputWithLabel>
        <div className="flex flex-row items-center justify-center gap-6">
          <TransactionFilter value={filter} onFilterChange={setFilter} />

          <Button
            className="flex gap-1 py-3 whitespace-nowrap"
            onClick={() => setShowCreateModal(true)}
          >
            <Download />
            Download CSV
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
                Transaction ID
              </TableHead>
              <TableHead className="text-sm font-normal text-left text-white">
                User
              </TableHead>
              <TableHead className="text-sm font-normal text-left text-white">
                Match
              </TableHead>
              <TableHead className="text-sm font-normal text-left text-white">
                Amount
              </TableHead>
              <TableHead className="text-sm font-normal text-left text-white">
                Date
              </TableHead>
              <TableHead className="text-sm font-normal text-left text-white">
                status
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
                      {item.transactionId || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-normal text-black-3 truncate max-w-[150px]">
                        {item.user?.name || "Unknown User"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-left">
                    <span className="block max-w-xs text-sm font-normal truncate text-black-3">
                      {item.match || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="text-left">
                    <span className="text-sm font-normal font-medium text-black-3">
                      ${item.amount?.toFixed(2) || "0.00"}
                    </span>
                  </TableCell>
                  <TableCell className="text-left">
                    <span className="text-sm font-normal text-black-3">
                      {item.date || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="text-left">
                    <StatusChip status={item.status || "pending"} />
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

export default TransactionTable;

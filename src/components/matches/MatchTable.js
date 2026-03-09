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
import { useEffect, useState, useCallback, useRef } from "react";
import Loader from "../ui/Loader";
import Pagination from "../Paignation";
import Button from "../Button";
import Popuplist from "../Popuplist";
import DeleteModal from "../ui/DeleteModal";
import ConfirmationModal from "../ui/ConfirmationModal";
import CreateMatchModal from "./CreateMatchModal";
import ViewMatchModal from "./ViewMatchModal";
import EditMatchModal from "./EditMatchModal";
import StatusChip from "../ui/StatusChip";
import {
  cancelMatch,
  createMatch,
  createMatche,
  deleteMatch,
  editMatch,
  getMatchesList,
} from "@/services/matchServices";
import { formatDate } from "@/Utilities/helpers";
import { getSubCommunitiesList } from "@/services/subCommunityServices";
import { GoogleMapsProvider } from "@/contexts/GoogleMapsContext";

const MatchTable = () => {
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
  const [subCommunities, setSubcommunities] = useState([]);

  const fetchSubCommunities = async () => {
    const res = await getSubCommunitiesList();
    const communities = res?.data?.results || res?.data || [];
    setSubcommunities(Array.isArray(communities) ? communities : []);
  };
  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { page: 1, limit: 100 };
      
      console.log("Fetching with params:", params);
      const res = await getMatchesList(params);
      console.log("Fetch matches response:", res);
      
      // Debug: Log each match status
      res.data.results.forEach((match, index) => {
        console.log(`Match ${index + 1} (${match.name}): status = "${match.status}"`);
      });

      setOriginalData(res.data.results);
      setFilteredData(res.data.results);
    } catch (error) {
      console.error("Failed to fetch matches:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
    fetchSubCommunities();
  }, []);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedDelete, setSelectedDelete] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const handleCreateMatch = async (matchData) => {
    setIsProcessing(true);
    try {
      await createMatch(matchData);
      await fetchData();
      setShowCreateModal(false);
    } catch (error) {
      console.error("Failed to create community:", error);
    } finally {
      setIsProcessing(false);
    }
  };

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
          (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.description || "").toLowerCase().includes(searchTerm.toLowerCase())
      );

      setFilteredData(filtered);
      const totalPages = Math.ceil(filtered.length / pagination.limit) || 1;
      setPagination((prev) => ({
        ...prev,
        page: 1,
        totalPages,
      }));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, originalData, pagination.limit]);

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

  const handleDeleteConfirm = async (id) => {
    if (!selectedDelete) return;
    setIsProcessing(true);
    try {
      await deleteMatch(id);
      await fetchData();
      closeDeleteModal();
    } catch (error) {
      console.error("Failed to delete match:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInactiveConfirm = async (id) => {
    setIsProcessing(true);
    try {
      console.log('Canceling match with ID:', id);
      const response = await cancelMatch(id);
      console.log('Cancel response:', response);
      
      if (response.status) {
        await fetchData();
        setShowInactiveModal(false);
      } else {
        const errorMsg = response.message || 'Failed to cancel match. Please try again.';
        alert(errorMsg);
      }
    } catch (error) {
      console.error("Failed to cancel match:", error);
      alert('Failed to cancel match. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditSave = async (updatedData) => {
    setIsProcessing(true);
    try {
      console.log('Updating match with data:', updatedData);
      await editMatch(selectedItem._id, updatedData);
      await fetchData();
      setShowEditModal(false);
    } catch (error) {
      console.error("Failed to update match:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Get current page data
  const currentPageData = allData;

  return (
    <GoogleMapsProvider>
    <div>
      <Loader loading={loading} />
      <CreateMatchModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateMatch}
        subCommunities={subCommunities}
        isLoading={isProcessing}
      />
      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        id={selectedDelete}
        onConfirm={handleDeleteConfirm}
        isProcessing={isProcessing}
        title="Delete this Match?"
        message="Are you sure you want to delete this match? This action cannot be undone."
      />

      {/* View Modal */}
      <ViewMatchModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title={`${selectedItem?.title || ""} Details`}
        data={selectedItem}
      />

      {/* Edit Modal */}
      <EditMatchModal
        subCommunitiesData={subCommunities}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleEditSave}
        title={`Edit ${selectedItem?.title || ""}`}
        initialData={selectedItem || {}}
        isLoading={isProcessing}
      />

      {/* Inactive Confirmation Modal */}
      <ConfirmationModal
        isOpen={showInactiveModal}
        onClose={() => setShowInactiveModal(false)}
        onConfirm={handleInactiveConfirm}
        title="Cancel this match?"
        id={selectedItem?._id}
        message={`Are you sure you want to cancel "${selectedItem?.name}"?`}
        confirmText="Yes, cancel match"
        cancelText="Cancel"
        isProcessing={isProcessing}
      />

      <div className="flex items-center justify-between m-4 mb-6">
        <InputWithLabel
          placeholder="Search by match name"
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
            New match
          </Button>
        </div>
      </div>

      <div className="pt-2 m-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">
            Showing {allData.length} of {filteredData.length} entries
          </span>
        </div>

        <Table className="min-w-full overflow-x-auto">
          <TableHeader className="border-t-1">
            <TableRow className="rounded-lg bg-light-blue">
              <TableHead className="text-sm font-normal text-left text-white">
                S.No
              </TableHead>
              <TableHead className="text-sm font-normal text-left text-white">
                Match Name
              </TableHead>
              <TableHead className="text-sm font-normal text-left text-white">
                Sub-community
              </TableHead>
              <TableHead className="text-sm font-normal text-left text-white">
                Date and Time
              </TableHead>
              <TableHead className="text-sm font-normal text-left text-white">
                Players
              </TableHead>
              <TableHead className="text-sm font-normal text-left text-white">
                Status
              </TableHead>
              <TableHead className="text-sm font-normal text-left text-white">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-gray-500"
                >
                  {allData.length === 0
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
                    <span className="block max-w-xs text-sm font-normal truncate text-black-3">
                      {item?.name || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="block max-w-xs text-sm font-normal truncate text-black-3">
                      {item?.community?.name || item?.community || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-normal text-black-3">
                      {formatDate(item?.date) || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-normal text-black-3">
                      {item?.players?.length || 0}/{item.playersRequired}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-normal text-black-3">
                      <StatusChip status={item?.status || "inactive"} />
                    </span>
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
                      {item?.status !== "cancelled" && (
                        <span
                          onClick={() => openInactiveModal(item)}
                          className="flex items-center w-full gap-2 px-3 py-2 text-sm font-normal text-black rounded-lg cursor-pointer hover:text-primary hover:bg-gray-100"
                        >
                          Cancel
                        </span>
                      )}

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
    </GoogleMapsProvider>
  );
};

export default MatchTable;

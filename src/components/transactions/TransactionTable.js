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
import { getCommunityTransactions } from "@/services/api/transactions";

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

const TransactionTable = ({ onSummaryUpdate }) => {
  const [filter, setFilter] = useState("all");
  const [isClient, setIsClient] = useState(false);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalResults: 0,
  });



  const router = useRouter();

  // Fetch transactions from API
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const payload = {
        page: pagination.page,
        limit: pagination.limit,
      };
      
      if (searchTerm) {
        payload.search = searchTerm;
      }
      
      if (filter && filter !== "all") {
        payload.status = filter;
      }

      const response = await getCommunityTransactions(payload);
      
      if (response.status && response.data) {
        setAllData(response.data.results || []);
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.totalPages || 1,
          totalResults: response.data.totalResults || 0,
        }));
        
        if (onSummaryUpdate && response.data.summary) {
          onSummaryUpdate(response.data.summary);
        }
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm, filter, onSummaryUpdate]);

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (pagination.page !== 1) {
        setPagination(prev => ({ ...prev, page: 1 }));
      } else {
        fetchTransactions();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div>
      <Loader loading={loading} />

      <div className="flex items-center justify-between m-4 mb-6">
        <InputWithLabel
          placeholder="Search transactions"
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
            onClick={() => downloadCSV(allData, "transactions")}
          >
            <Download />
            Download CSV
          </Button>
        </div>
      </div>

      <div className="pt-2 m-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">
            Showing {allData.length} of {pagination.totalResults} entries
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
                Community
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
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-12 text-center text-gray-500"
                >
                  {loading ? "Loading..." : "No transactions found"}
                </TableCell>
              </TableRow>
            ) : (
              allData.map((item, index) => (
                <TableRow key={item._id} className="bg-white hover:bg-gray-50">
                  <TableCell className="text-left">
                    <span className="text-sm font-normal text-black-3">
                      {(pagination.page - 1) * pagination.limit + index + 1}
                    </span>
                  </TableCell>
                  <TableCell className="text-left">
                    <span className="text-sm font-normal font-medium truncate text-black-3">
                      {item._id || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="text-left">
                    <span className="text-sm font-normal text-black-3 truncate max-w-[150px]">
                      {item.communityMatch?.community?.name || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="text-left">
                    <span className="block max-w-xs text-sm font-normal truncate text-black-3">
                      {item.communityMatch?.name || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="text-left">
                    <span className="text-sm font-normal font-medium text-black-3">
                      {item.amount} {item.currency}
                    </span>
                  </TableCell>
                  <TableCell className="text-left">
                    <span className="text-sm font-normal text-black-3">
                      {formatDate(item.transactionDate)}
                    </span>
                  </TableCell>
                  <TableCell className="text-left">
                    <StatusChip status={item.paymentStatus || "pending"} />
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

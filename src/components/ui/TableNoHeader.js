import { MapPin } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "./table";
const TableNoHeader = ({
  title = "Upcoming Matches",
  data = [],
  onViewAll,
}) => {
  const formatDateTime = (startTime) => {
    if (!startTime) return "N/A";
    const date = new Date(startTime);
    return date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className=" bg-white gap-[20px] p-6 rounded-3xl shadow-lg mt-10">
      {/* table header */}
      <div className="flex flex-row justify-between">
        <p className="mb-4 text-xl font-helvetica">{title}</p>
        <button
          onClick={onViewAll}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          View all
        </button>
      </div>
      <div>
        <Table>
          <TableBody>
            {data?.map((match) => (
              <TableRow key={match._id}>
                <TableCell className="font-semibold">{match.name}</TableCell>
                <TableCell className="flex flex-row items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{match.location?.city || match.location?.streetAddress || "N/A"}</span>
                </TableCell>
                <TableCell>{formatDateTime(match.startTime)}</TableCell>
                <TableCell className="flex flex-col">
                  <span>Players</span>
                  <span>
                    {match.players?.length || 0}/{match.playersRequired || 0}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 text-sm text-green-800 bg-green-100 rounded-full">
                    {match.matchMode || match.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TableNoHeader;

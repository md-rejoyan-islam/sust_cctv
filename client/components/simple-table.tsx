import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

const SimpleTable = ({
  columns,
  body,
  noDataMessage = "No Data Found",
  totalPages,
  currentPage = 1,
  setCurrentPage,
  isLoading,
}: {
  columns: string[];
  body: React.ReactNode[][];
  noDataMessage?: string;
  totalPages?: number;
  currentPage?: number;
  setCurrentPage: (page: number) => void;
  isLoading?: boolean;
}) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="border-border uppercase hover:bg-transparent bg-gray-100">
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className={clsx(index === columns.length - 1 && "text-right")}
              >
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {body.map((row, index) => (
            <TableRow key={index} className="border-border hover:bg-muted/50">
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}

          {!isLoading && body.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <p className="text-center py-2 text-red-600">{noDataMessage}</p>
              </TableCell>
            </TableRow>
          )}
          {isLoading && (
            <>
              {Array.from({ length: 10 }).map((_, index) => (
                <TableRow
                  key={index}
                  className="border-border hover:bg-muted/50 animate-pulse"
                >
                  {columns.map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <div className="h-7 bg-gray-300 rounded w-full"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between  pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
        {!!totalPages && totalPages > 1 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="gap-2 bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="gap-2 bg-transparent"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default SimpleTable;

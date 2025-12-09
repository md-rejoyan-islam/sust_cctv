import { IPagination } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

const Pagination = ({
  pagination,
  setCurrentPage,
  currentPage,
}: {
  pagination?: IPagination;
  setCurrentPage: (page: number) => void;
  currentPage: number;
}) => {
  if (!pagination) {
    return null;
  } else {
    return (
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Page {} of {pagination?.totalPages}
        </p>
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
              setCurrentPage(Math.min(pagination?.totalPages, currentPage + 1))
            }
            disabled={pagination?.currentPage === pagination?.totalPages}
            className="gap-2 bg-transparent"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }
};

export default Pagination;

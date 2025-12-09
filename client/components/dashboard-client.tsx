"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetCamerasQuery } from "@/lib/api/cameras";
import { ICameraSchema } from "@/lib/types";
import { History } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import SimpleTable from "./simple-table";

export function DashboardClient() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: offlineCameras, isLoading } = useGetCamerasQuery({
    status: "inactive",
    page: currentPage,
    limit: 10,
    includeZone: true,
  });

  const pagination = offlineCameras?.pagination;

  const [selectedCamera, setSelectedCamera] = useState<ICameraSchema | null>(
    null
  );

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <>
      <div className="overflow-x-auto">
        <SimpleTable
          columns={[
            "#",
            "Name",
            "Location",
            "Zone",
            "Went Offline",
            "Status",
            "Last Update",
            "History",
          ]}
          body={
            offlineCameras?.data?.length
              ? offlineCameras.data.map((camera, index) => [
                  (
                    index +
                    1 +
                    (pagination!.currentPage - 1) * pagination!.limit
                  ).toString(),
                  <Link
                    href={`/cameras/${camera._id}`}
                    className="text-primary hover:underline"
                  >
                    {camera.name}
                  </Link>,
                  camera.location,
                  typeof camera.zone === "object"
                    ? camera.zone.name
                    : camera.zone,
                  (
                    camera.history?.[0]?.date &&
                    new Date(camera.history?.[0]?.date)
                  )?.toLocaleString() || "N/A",
                  <span
                    key={camera._id}
                    className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive"
                  >
                    <span className="w-2 h-2 rounded-full bg-destructive" />
                    Offline
                  </span>,
                  <span>
                    {camera.updatedAt
                      ? new Date(camera.updatedAt).toLocaleString()
                      : "N/A"}
                  </span>,
                  <div className="flex justify-end">
                    <Button
                      key={camera._id + "-btn"}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedCamera(camera);
                        setIsHistoryOpen(true);
                      }}
                      className="gap-2  bg-green-100"
                    >
                      <History className="w-4 h-4" />
                      History
                    </Button>
                  </div>,
                ])
              : []
          }
          noDataMessage="No Camera found"
          totalPages={pagination?.totalPages}
          currentPage={pagination?.currentPage}
          setCurrentPage={setCurrentPage}
          isLoading={isLoading}
        />
      </div>

      {/* History Dialog */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Camera History</DialogTitle>
            <DialogDescription>
              {selectedCamera?.name} - {selectedCamera?.location}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 overflow-hidden">
            <div className="text-sm text-muted-foreground">
              <p>Status history</p>
              <div className="mt-4 space-y-2">
                <SimpleTable
                  columns={["#", "Timestamps", "Status"]}
                  body={
                    selectedCamera?.history && selectedCamera.history.length > 0
                      ? selectedCamera.history.map((entry, index) => [
                          (index + 1).toString(),
                          new Date(entry.date).toLocaleString(),
                          entry.status === "active" ? (
                            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                              <span className="w-2 h-2 rounded-full bg-accent" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                              <span className="w-2 h-2 rounded-full bg-destructive" />
                              Inactive
                            </span>
                          ),
                        ])
                      : []
                  }
                  noDataMessage="No history available"
                  isLoading={isLoading}
                  currentPage={1}
                  setCurrentPage={() => {}}
                  totalPages={1}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

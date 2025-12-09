"use client";

import { AddCameraDialog } from "@/components/dialogs/add-camera-dialog";
import { DeleteConfirmationDialog } from "@/components/dialogs/delete-confirmation-dialog";
import SimpleTable from "@/components/simple-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetProfileQuery } from "@/lib/api/auth";
import {
  useAddCameraMutation,
  useDeleteCameraMutation,
  useGetCamerasQuery,
  useUpdateCameraMutation,
} from "@/lib/api/cameras";
import { useGetZonesQuery } from "@/lib/api/zones";
import type { ICameraSchema } from "@/lib/types";
import type { CameraFormData } from "@/lib/validation";
import clsx from "clsx";
import { Download, Edit2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

export default function Cameras() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterZone, setFilterZone] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<ICameraSchema | null>(
    null
  );

  const { data: camerasData, isLoading: camerasLoading } = useGetCamerasQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    zone: filterZone !== "all" ? filterZone : undefined,
    status: filterStatus !== "all" ? filterStatus : undefined,
    search: searchTerm || undefined,
    includeZone: true,
  });

  const { data: allCameraData } = useGetCamerasQuery({
    limit: 100,
  });

  const { data: zonesData } = useGetZonesQuery({});

  const { data: user } = useGetProfileQuery();

  const [addCamera] = useAddCameraMutation();
  const [updateCamera] = useUpdateCameraMutation();
  const [deleteCamera] = useDeleteCameraMutation();

  const cameras = camerasData?.data || [];

  const zones = zonesData?.data || [];
  const totalPages = camerasData?.pagination?.totalPages;

  const handleAddCamera = async (data: CameraFormData) => {
    try {
      await addCamera(data).unwrap();
      setIsAddDialogOpen(false);
      setCurrentPage(1);
    } catch (error) {
      toast.error("Failed to add camera", {
        description: (error as any)?.data?.message || "",
      });
    }
  };

  const handleUpdateCamera = async (data: CameraFormData) => {
    if (!selectedCamera?._id) return;
    try {
      await updateCamera({ id: selectedCamera._id, data }).unwrap();
      setIsEditDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update camera", {
        description: (error as any)?.data?.message || "",
      });
    }
  };

  const handleDownloadReport = () => {
    try {
      const columns = [
        "Name",
        "Location",
        "Zone",
        "IP Address",
        "MAC ID",
        "Pole",
        "Latitude",
        "Longitude",
        "Status",
      ];

      // create csv content
      const csvRows = [];
      csvRows.push(columns.join(","));

      allCameraData?.data?.forEach((camera) => {
        const row = [
          `"${camera.name}"`,
          `"${camera.location}"`,
          `"${
            typeof camera.zone === "object" ? camera.zone.name : camera.zone
          }"`,
          `"${camera.ip}"`,
          `"${camera.mac_id || ""}"`,
          camera.pole,
          camera.latitude || "",
          camera.longitude || "",
          camera.status,
        ];
        csvRows.push(row.join(","));
      });

      const csvContent = csvRows.join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "cameras_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Implement report download logic here
      toast.success("Report download initiated");
    } catch (error) {
      toast.error("Failed to download report");
    }
  };

  const handleDeleteCamera = async () => {
    if (!selectedCamera?._id) return;
    try {
      await deleteCamera(selectedCamera._id).unwrap();
      setIsDeleteDialogOpen(false);
      toast.success("Camera deleted successfully");
    } catch (error) {
      toast.error("Failed to delete camera", {
        description: (error as any)?.data?.message || "",
      });
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center flex-wrap gap-3 justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Cameras</h1>
            <p className="text-muted-foreground mt-1">
              Manage all campus CCTV cameras
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleDownloadReport}
              className={clsx(
                "gap-2 group",
                user?.role !== "admin" && "hidden"
              )}
              disabled={user?.role !== "admin"}
            >
              <Download className="w-4 h-4 group-hover:animate-bounce" />
              Download Report
            </Button>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="gap-2"
              disabled={user?.role !== "admin"}
            >
              <Plus className="w-4 h-4" />
              Add Camera
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm">
          <CardContent className="">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Search
                </label>
                <Input
                  placeholder="Search by name or location..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-10"
                />
              </div>

              {/* Zone Filter */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Zone
                </label>
                <Select
                  value={filterZone}
                  onValueChange={(value) => {
                    setFilterZone(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-10 min-w-20">
                    <SelectValue placeholder="Select Zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Zones</SelectItem>
                    {zones?.map((zone) => (
                      <SelectItem key={zone._id} value={zone._id}>
                        {zone.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Status
                </label>
                <Select
                  value={filterStatus}
                  onValueChange={(value) => {
                    setFilterStatus(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-10 min-w-20">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Results
                </label>
                <p className="text-sm text-muted-foreground">
                  {camerasData?.pagination?.items || 0} camera
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cameras Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Camera List</CardTitle>
            <CardDescription>All cameras in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={[
                "#",
                "Name",
                "Location",
                "Zone",
                ...(user?.role === "admin" ? ["IP Address"] : []),
                "Came Online",
                "Status",
                "Last Update",
                "Actions",
              ]}
              body={cameras.map((camera, index) => [
                (currentPage - 1) * ITEMS_PER_PAGE + index + 1,
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
                ...(user?.role === "admin"
                  ? [<span className="font-mono text-sm">{camera.ip}</span>]
                  : []),
                camera.history?.find((entry) => entry.status === "active")
                  ? new Date(
                      camera.history
                        .filter((entry) => entry.status === "active")
                        .slice(-1)[0].date
                    ).toLocaleString()
                  : "N/A",

                <span
                  className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${
                    camera.status === "active"
                      ? "bg-accent/10 text-accent"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      camera.status === "active"
                        ? "bg-accent"
                        : "bg-destructive"
                    }`}
                  />
                  {camera.status === "active" ? "Active" : "Inactive"}
                </span>,
                <span>
                  {camera.updatedAt
                    ? new Date(camera.updatedAt).toLocaleString()
                    : "N/A"}
                </span>,
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={user?.role !== "admin"}
                    onClick={() => {
                      setSelectedCamera(camera);
                      setIsEditDialogOpen(true);
                    }}
                    className="bg-blue-50 hover:bg-blue-100 hover:text-blue-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={user?.role !== "admin"}
                    onClick={() => {
                      setSelectedCamera(camera);
                      setIsDeleteDialogOpen(true);
                    }}
                    className="text-destructive hover:text-destructive hover:bg-red-200 bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>,
              ])}
              noDataMessage={"No cameras found"}
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              isLoading={camerasLoading}
            />
          </CardContent>
        </Card>
      </div>

      {/* Add Camera Dialog */}
      <AddCameraDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        zones={zones}
        onSubmit={handleAddCamera}
      />

      {selectedCamera && (
        <AddCameraDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          zones={zones}
          onSubmit={handleUpdateCamera}
          initialData={{
            name: selectedCamera.name,
            location: selectedCamera.location,
            zone:
              typeof selectedCamera.zone === "object"
                ? selectedCamera.zone._id
                : selectedCamera.zone,
            latitude: selectedCamera.latitude,
            longitude: selectedCamera.longitude,
            pole: selectedCamera.pole,
            mac_id: selectedCamera.mac_id,
            ip: selectedCamera.ip,
            status: selectedCamera.status,
          }}
          isEditMode={true}
        />
      )}

      {selectedCamera && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Delete Camera"
          description={`Are you sure you want to delete "${selectedCamera.name}"? This action cannot be undone.`}
          onConfirm={handleDeleteCamera}
        />
      )}
    </>
  );
}

"use client";

import { DeleteConfirmationDialog } from "@/components/dialogs/delete-confirmation-dialog";
import { ZoneDialog } from "@/components/dialogs/zone-dialog";
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
import { useGetProfileQuery } from "@/lib/api/auth";
import {
  useAddZoneMutation,
  useDeleteZoneMutation,
  useGetZonesQuery,
  useUpdateZoneMutation,
} from "@/lib/api/zones";
import type { IZone } from "@/lib/types";
import type { ZoneFormData } from "@/lib/validation";
import { Edit2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

export default function Zones() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<IZone | null>(null);

  const { data: user } = useGetProfileQuery();

  const { data: zonesData, isLoading } = useGetZonesQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: searchTerm || undefined,
  });

  const [addZone] = useAddZoneMutation();
  const [updateZone] = useUpdateZoneMutation();
  const [deleteZone] = useDeleteZoneMutation();

  const totalPages = zonesData?.pagination?.totalPages
    ? Math.ceil(zonesData.pagination?.totalPages / ITEMS_PER_PAGE)
    : 1;

  const handleAddZone = async (data: ZoneFormData) => {
    try {
      await addZone(data).unwrap();
      setIsAddDialogOpen(false);
      setCurrentPage(1);
    } catch (error) {
      toast.error("Failed to add zone", {
        description: (error as any)?.data?.message || "",
      });
    }
  };

  const handleUpdateZone = async (data: ZoneFormData) => {
    if (!selectedZone?._id) return;
    try {
      await updateZone({ id: selectedZone._id, data }).unwrap();
      setIsEditDialogOpen(false);
      toast.success("Zone updated successfully");
    } catch (error) {
      toast.error("Failed to update zone", {
        description: (error as any)?.data?.message || "",
      });
    }
  };

  const handleDeleteZone = async () => {
    if (!selectedZone?._id) return;
    try {
      await deleteZone(selectedZone._id).unwrap();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete zone", {
        description: (error as any)?.data?.message || "",
      });
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Zones</h1>
            <p className="text-muted-foreground mt-1">
              Manage campus security zones
            </p>
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="gap-2"
            disabled={user?.role !== "admin"}
          >
            <Plus className="w-4 h-4" />
            Add Zone
          </Button>
        </div>

        {/* Search */}
        <Card className="border-0 shadow-sm">
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <Input
              placeholder="Search zones by name or description..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10  w-full"
            />
            <div className="flex md:justify-end">
              <div>
                <label className="text-sm font-medium  text-foreground mb-2 block">
                  Results
                </label>
                <p className="text-sm text-muted-foreground">
                  {zonesData?.pagination?.items || 0} zones found
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Zones Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Zone List</CardTitle>
            <CardDescription>All zones in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={[
                "#",
                "Name",
                "Total Camera",
                "Location",
                "Description",
                "Actions",
              ]}
              body={
                zonesData?.data?.map((zone, index) => [
                  (index + 1 + (currentPage - 1) * ITEMS_PER_PAGE).toString(),
                  <Link
                    href={`/zones/${zone._id}`}
                    className="text-primary hover:underline"
                  >
                    {zone.name}
                  </Link>,
                  zone.cameras?.length || "0",
                  zone.location || "-",
                  zone.description || "-",
                  <div
                    className="flex items-center justify-end gap-2"
                    key={zone._id}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={user?.role !== "admin"}
                      onClick={() => {
                        setSelectedZone(zone);
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
                        setSelectedZone(zone);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="text-destructive hover:text-destructive hover:bg-red-200 bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>,
                ]) || []
              }
              noDataMessage={isLoading ? "Loading..." : "No zones found"}
              isLoading={isLoading}
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </CardContent>
        </Card>
      </div>

      {/* Add Zone Dialog */}
      <ZoneDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddZone}
      />

      {/* Edit Zone Dialog */}
      {selectedZone && (
        <ZoneDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSubmit={handleUpdateZone}
          initialData={{
            name: selectedZone.name,
            description: selectedZone.description,
            location: selectedZone.location,
          }}
          title="Edit Zone"
        />
      )}

      {/* Delete Confirmation Dialog */}
      {selectedZone && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Delete Zone"
          description={`Are you sure you want to delete "${selectedZone.name}"? This action cannot be undone.`}
          onConfirm={handleDeleteZone}
        />
      )}
    </>
  );
}

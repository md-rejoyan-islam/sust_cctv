"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cameraSchema, type CameraFormData } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface AddCameraDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  zones: Array<{ _id: string; name: string }>;
  onSubmit: (data: CameraFormData) => Promise<void>;
  initialData?: CameraFormData;
  isEditMode?: boolean;
}

export function AddCameraDialog({
  open,
  onOpenChange,
  zones,
  onSubmit,
  initialData,
  isEditMode = false,
}: AddCameraDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CameraFormData>({
    resolver: zodResolver(cameraSchema),
    defaultValues: initialData || {
      status: "active",
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset(initialData);
      } else {
        reset({ status: "active" });
      }
    }
  }, [open, initialData, reset]);

  const selectedZone = watch("zone");

  const handleFormSubmit = async (data: CameraFormData) => {
    setIsLoading(true);

    try {
      await onSubmit(data);
      onOpenChange(false);
      reset();
    } catch (err: any) {
      toast.error("Failed to save camera", {
        description: err.data?.message || "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Camera" : "Add New Camera"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update camera details"
              : "Enter the camera details to add it to the system"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Camera Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Camera Name</label>
              <Input
                {...register("name")}
                placeholder="e.g., Camera A1"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input
                {...register("location")}
                placeholder="e.g., Building A, Floor 1"
                disabled={isLoading}
              />
              {errors.location && (
                <p className="text-xs text-destructive">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Zone */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Zone</label>
              <Select
                value={selectedZone}
                onValueChange={(value) => setValue("zone", value)}
              >
                <SelectTrigger disabled={isLoading} className="w-full">
                  <SelectValue placeholder="Select a zone" />
                </SelectTrigger>
                <SelectContent>
                  {zones.map((zone) => (
                    <SelectItem key={zone._id} value={zone._id}>
                      {zone.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.zone && (
                <p className="text-xs text-destructive">
                  {errors.zone.message}
                </p>
              )}
            </div>

            {/* Pole Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Pole Number</label>
              <Input
                {...register("pole", { valueAsNumber: true })}
                type="number"
                placeholder="e.g., 1"
                disabled={isLoading}
              />
              {errors.pole && (
                <p className="text-xs text-destructive">
                  {errors.pole.message}
                </p>
              )}
            </div>

            {/* Latitude */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Latitude</label>
              <Input
                {...register("latitude", { valueAsNumber: true })}
                type="number"
                step="0.0001"
                placeholder="e.g., 40.7128"
                defaultValue={0.0}
                disabled={isLoading}
              />
              {errors.latitude && (
                <p className="text-xs text-destructive">
                  {errors.latitude.message}
                </p>
              )}
            </div>

            {/* Longitude */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Longitude</label>
              <Input
                {...register("longitude", { valueAsNumber: true })}
                type="number"
                step="0.0001"
                defaultValue={0.0}
                placeholder="e.g., -74.0060"
                disabled={isLoading}
              />
              {errors.longitude && (
                <p className="text-xs text-destructive">
                  {errors.longitude.message}
                </p>
              )}
            </div>

            {/* MAC ID */}
            <div className="space-y-2">
              <label className="text-sm font-medium">MAC ID</label>
              <Input
                {...register("mac_id")}
                placeholder="e.g., 00:1A:2B:3C:4D:5E"
                disabled={isLoading}
              />
              {errors.mac_id && (
                <p className="text-xs text-destructive">
                  {errors.mac_id.message}
                </p>
              )}
            </div>

            {/* IP Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium">IP Address</label>
              <Input
                {...register("ip")}
                placeholder="e.g., 192.168.1.100"
                disabled={isLoading}
              />
              {errors.ip && (
                <p className="text-xs text-destructive">{errors.ip.message}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={watch("status")}
                onValueChange={(value) =>
                  setValue("status", value as "active" | "inactive")
                }
              >
                <SelectTrigger disabled={isLoading} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-xs text-destructive">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading
                ? isEditMode
                  ? "Updating..."
                  : "Adding..."
                : isEditMode
                ? "Update Camera"
                : "Add Camera"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

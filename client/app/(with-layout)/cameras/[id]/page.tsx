"use client";

import SimpleTable from "@/components/simple-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetProfileQuery } from "@/lib/api/auth";
import { useGetCameraByIdQuery } from "@/lib/api/cameras";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  HardDrive,
  MapPin,
  Network,
  Wifi,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CameraDetailPage() {
  const params = useParams();
  const cameraId = params.id as string;
  const { data: user } = useGetProfileQuery();

  const { data: camera, isLoading } = useGetCameraByIdQuery(cameraId, {
    skip: !cameraId,
  });

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </>
    );
  }

  if (!camera) {
    return (
      <>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Camera not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Back Button */}
        <Link href="/cameras">
          <Button variant="ghost" className="gap-2 -ml-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Cameras
          </Button>
        </Link>

        {/* Camera Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {camera.name}
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {camera.location}
            </p>
          </div>
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
              camera.status === "active"
                ? "bg-accent/10 text-accent"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {camera.status === "active" ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Active
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4" />
                Inactive
              </>
            )}
          </div>
        </div>

        {/* Camera Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* IP Address */}
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Network className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    IP Address
                  </p>
                  <p className="text-lg font-mono font-semibold text-foreground mt-1">
                    {user?.role === "admin" ? camera.ip : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* MAC Address */}
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <HardDrive className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    MAC Address
                  </p>
                  <p className="text-lg font-mono font-semibold text-foreground mt-1">
                    {user?.role === "admin" ? camera.mac_id : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pole Number */}
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Wifi className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Pole Number
                  </p>
                  <p className="text-lg font-semibold text-foreground mt-1">
                    {camera.pole}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Location Coordinates */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Location Coordinates</CardTitle>
            <CardDescription>GPS coordinates for this camera</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Latitude</p>
                <p className="text-lg font-mono font-semibold text-foreground">
                  {camera.latitude}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Longitude</p>
                <p className="text-lg font-mono font-semibold text-foreground">
                  {camera.longitude}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Location</p>
                <p className="text-lg font-mono font-semibold text-foreground">
                  {camera.location}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Camera History */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Status History</CardTitle>
            <CardDescription>
              Recent status changes for this camera
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={["#", "Timestamp", "Status"]}
              body={
                camera?.history && camera.history.length > 0
                  ? camera.history.map((entry, index) => [
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
          </CardContent>
        </Card>
      </div>
    </>
  );
}

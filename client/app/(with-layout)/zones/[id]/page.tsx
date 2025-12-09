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
import { useGetCamerasQuery } from "@/lib/api/cameras";
import { useGetZoneByIdQuery } from "@/lib/api/zones";
import { ArrowLeft, Edit2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ZoneDetailPage() {
  const params = useParams();
  const zoneId = params.id as string;
  const [currentPage, setCurrentPage] = useState(1);

  const { data: user } = useGetProfileQuery();

  const { data: zone, isLoading } = useGetZoneByIdQuery(zoneId, {
    skip: !zoneId,
  });

  const { data: cameras } = useGetCamerasQuery(
    {
      zone: zoneId,
      page: currentPage,
      limit: 15,
    },
    {
      skip: !zoneId,
    }
  );

  const activeCameras =
    cameras?.data.filter((c) => c.status === "active").length || 0;
  const inactiveCameras =
    cameras?.data.filter((c) => c.status === "inactive").length || 0;

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </>
    );
  }

  if (!zone) {
    return (
      <>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Zone not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Back Button */}
        <Link href="/zones">
          <Button variant="ghost" className="gap-2 -ml-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Zones
          </Button>
        </Link>

        {/* Zone Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">{zone.name}</h1>
          <p className="text-muted-foreground mt-1">{zone.location}</p>
        </div>

        {/* Zone Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="">
              <p className="text-sm text-muted-foreground">Total Cameras</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {zone?.cameras.length || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="">
              <p className="text-sm text-muted-foreground">Active Cameras</p>
              <p className="text-3xl font-bold text-accent mt-2">
                {activeCameras}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="">
              <p className="text-sm text-muted-foreground">Inactive Cameras</p>
              <p className="text-3xl font-bold text-destructive mt-2">
                {inactiveCameras}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Zone Description */}
        {zone.description && (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">{zone.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Cameras in Zone */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Cameras in this Zone</CardTitle>
            <CardDescription>
              All cameras assigned to {zone.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={[
                "#",
                "Camera Name",
                "Location",
                ...(user?.role === "admin" ? ["IP Address"] : []),
                "Status",
                "Actions",
              ]}
              body={
                cameras?.data.map((camera, index) => [
                  (index + 1).toString(),
                  <Link
                    href={`/cameras/${camera._id}`}
                    className="text-primary hover:underline"
                  >
                    {camera.name}
                  </Link>,
                  camera.location,
                  ...(user?.role === "admin"
                    ? [<span className="font-mono text-sm">{camera.ip}</span>]
                    : []),
                  camera.status === "active" ? (
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
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/cameras/${camera._id}`}>
                      <Button variant="ghost" size="sm">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>,
                ]) || []
              }
              noDataMessage="No cameras in this zone"
              isLoading={isLoading}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={cameras?.pagination?.totalPages}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

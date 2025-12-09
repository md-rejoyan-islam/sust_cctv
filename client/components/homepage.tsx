"use client";
import { DashboardClient } from "@/components/dashboard-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCamaraStatQuery } from "@/lib/api/cameras";
import { AlertCircle, Camera, CheckCircle, MapPin } from "lucide-react";

export default function Homepage() {
  const { data: stats } = useCamaraStatQuery();

  return (
    <>
      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cameras */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Cameras</p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {stats?.data?.overview.totalCameras ?? 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Camera className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Zones */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Zones</p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {stats?.data?.zoneDistribution.length ?? 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Cameras */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Cameras</p>
                <p className="text-3xl font-bold text-accent mt-2">
                  {stats?.data?.overview.activeCameras ?? 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Offline Cameras */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Offline Cameras</p>
                <p className="text-3xl font-bold text-destructive mt-2">
                  {stats?.data?.overview.inactiveCameras ?? 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Offline Cameras Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Offline Cameras</CardTitle>
          <CardDescription>Cameras that are currently offline</CardDescription>
        </CardHeader>
        <CardContent>
          <DashboardClient />
        </CardContent>
      </Card>
    </>
  );
}

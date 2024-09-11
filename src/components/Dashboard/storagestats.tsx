"use client";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NextImage from "next/image";
import { DockIcon, File, Image, LucideDock, Video } from "lucide-react";

export function StorageStats() {
  return (
    <div>
      <Card className="overflow-hidden bg-white shadow-lg p-4">
        <CardHeader className="flex flex-row justify-between items-start bg-muted/50 p-4">
          <div>
            <CardTitle className="text-xl font-bold">45.5 GB Used</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              out of 50 GB
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs bg-blue-500 text-white rounded"
          >
            Upgrade
          </Button>
        </CardHeader>

        {/* Card Content */}
        <CardContent className="p-4 space-y-4">
          {/* Progress Bar */}
          <div className="w-full">
            <Progress value={91} className="h-2 bg-gray-200" />
          </div>

          {/* Storage Breakdown */}
          <ul className="grid gap-3 text-sm">
            <li className="flex justify-between">
              <div className="flex items-center">
                <Image className="mr-2" />
                <span>Images</span>
              </div>
              <span className="ml-auto">15.3 GB</span>
            </li>
            <li className="flex justify-between">
              <div className="flex items-center">
                <File className="mr-2" />
                <span>Documents</span>
              </div>
              <span className="ml-auto">256 MB</span>
            </li>
            <li className="flex justify-between">
              <div className="flex items-center">
                <Video className="mr-2" />
                <span>Media Files</span>
              </div>
              <span className="ml-auto">3.4 GB</span>
            </li>
            <li className="flex justify-between">
              <div className="flex items-center">
                <File className="mr-2" />
                <span>Other Files</span>
              </div>
              <span className="ml-auto">3 GB</span>
            </li>
            <li className="flex justify-between">
              <div className="flex items-center">
                <LucideDock className="mr-2" />
                <span>Unknown Files</span>
              </div>
              <span className="ml-auto">175 MB</span>
            </li>
          </ul>
        </CardContent>
      </Card>
      <Card className="p-6 rounded-lg shadow-lg bg-white">
        {/* Card Header */}
        <CardHeader className="text-center mb-4">
          <CardTitle className="text-xl font-bold">Upgrade account!</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center space-y-4">
          <div className="relative w-36 h-36">
            <NextImage
              src="/dashboard/upgrade.svg"
              alt="Upgrade Illustration"
              fill
              className="object-contain"
              sizes="100%"
            />
          </div>

          <p className="text-center text-sm text-muted-foreground">
            5 integrations, 30 team members, advanced features for teams.
          </p>

          <Button
            size="lg"
            className="w-full mt-4 bg-blue-500 text-white rounded"
          >
            Upgrade
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarDays, MapPin, Link as LinkIcon } from "lucide-react";
import Image from "next/image";

interface UserProfileModalProps {
  profileOpen: boolean;
  setProfileOpen: (open: boolean) => void;
  children: React.ReactNode;
  profileData: any;
  messages: any;
}

export default function UserProfileModal({
  profileOpen,
  setProfileOpen,
  children,
  profileData,
  messages,
}: UserProfileModalProps) {
  const messageImages = messages.filter((e: any) => e.image);

  function formatTimestamp(unixTime:number) {
    const date = new Date(unixTime);
    
    // Get the day and month
    const day = date.getDate(); // Get the day of the month
    const month = date.toLocaleString('default', { month: 'short' }); // Get the abbreviated month name
    const year = date.getFullYear(); // Get the full year

    // Format the string
    return `${day} ${month} ${year}`;
}
  return (
    <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden">
        <Card className="border-none shadow-none">
          <div className="relative h-32 bg-gradient-to-r from-gray-600 to-gray-800">
            <Avatar className="absolute -bottom-12 left-6 h-24 w-24 border-4 border-background">
              <AvatarImage src={profileData.avatar} alt={profileData.name} />
              <AvatarFallback>
                {profileData.name
                  .split(" ")
                  .map((n: any) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardContent className="pt-16 pb-6 px-6">
            <div className="flex flex-col gap-2 mb-3">
              <div className="flex flex-col ">
                <h2 className="text-2xl font-semibold text-gray-500 ">
                  {profileData.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {profileData.username}
                </p>
              </div>
              <div className="border-b border-gray-400">
                <span className="font-semibold text-md text-gray-600">Bio</span>
                <p className="text-[14px] text-muted-foreground mb-2">
                  {profileData.bio}
                </p>
              </div>
              <div className="flex items-center gap-3 border-b border-gray-400 pb-2">
                <CalendarDays className="h-6 text-gray-500 w-6" />
                <span className="text-[13px] text-gray-500">Joined {formatTimestamp(profileData.createdAt)}</span>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-600 dark:text-gray-400">
                Media
              </h3>
              <ScrollArea className="h-[220px]">
                <div className="grid grid-cols-3 gap-2">
                  {messageImages.map((post: any, index: number) => (
                    <div
                      key={index}
                      className="relative aspect-square overflow-hidden rounded-md"
                    >
                      <Image
                        fill
                        src={post.image}
                        alt={`Post ${index + 1}`}
                        onClick={() => {
                          window.open(post.image);
                        }}
                        className="object-cover transition-all hover:border-black hover:border-[2px] cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

import React, { Suspense, useEffect, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserProfileAction } from "../../actions";

interface UserProfile {
  userId: number;
  id: number;
  displayName: string | null;
  imageId: string | null;
  image: string | null;
  bio: string;
}

const CommentItemUserSkeleton = () => (
  <div className="flex items-center space-x-2">
    <Skeleton className="h-8 w-8 rounded-full" />
    <Skeleton className="h-4 w-24" />
  </div>
);

const CommentItemUserContent = ({ userId }: { userId: number }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await getUserProfileAction({ userId });
        setProfile(result[0]);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchProfile();
  }, [userId]);

  if (!profile) return null;

  return (
    <div className="flex items-center space-x-2">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={profile.image || ""} alt={profile.displayName || ""} />
        <AvatarFallback>{profile.displayName?.charAt(0).toUpperCase() || ""}</AvatarFallback>
      </Avatar>
      <div className="font-medium text-sm">{profile.displayName || ""}</div>
    </div>
  );
};

export const CommentItemUser = ({ userId }: { userId: number }) => (
  <Suspense fallback={<CommentItemUserSkeleton />}>
    <CommentItemUserContent userId={userId} />
  </Suspense>
);
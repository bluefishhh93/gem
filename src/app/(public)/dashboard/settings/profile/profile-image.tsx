import { ConfigurationPanel } from "@/components/configuration-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/lib/session";
import Image from "next/image";
import { Suspense } from "react";
import { AvatarUploader } from "./profile-image-form";
import { revalidatePath } from "next/cache";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
export function getProfileImageFullUrl(image: string | null) {
    return image ? image : "/default-avatar.png";
}
import { updateProfileImageAction } from "./actions";
import { getUserProfileLoader } from "./page";


export async function ProfileImage() {
    return (
        <ConfigurationPanel title="Ảnh đại diện">
            <Suspense fallback={<Skeleton className="w-full h-[200px] rounded" />}>
                <ProfileImageContent />
            </Suspense>
        </ConfigurationPanel>
    )
}

async function saveAvatar(url: string) {
    "use server";
    const user = await getCurrentUser();

    if (!user) {
        console.error('No user found');
        return;
    }

    try {
        await updateProfileImageAction({ url });
    } catch (error) {
        console.error('Failed to update avatar:', error);
    }
}

async function ProfileImageContent() {
    const user = await getCurrentUser();

    if (!user) {
        return null;
    }

    const profile = await getUserProfileLoader(user.id);

    return (
        <div className="flex flex-col items-center space-y-6">
            <div className="relative w-full max-w-[200px]">
                <Image
                    src={getProfileImageFullUrl(profile.image)}
                    width={500}
                    height={500}
                    className="w-full h-auto aspect-square object-cover rounded-full border-4 border-gray-200 shadow-lg dark:border-gray-800 transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-600"
                    alt="Profile image"
                />
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="absolute -bottom-2 -right-2 p-1 bg-white dark:bg-gray-800 rounded-full shadow-md">
                            <AvatarUploader onUploadSuccess={saveAvatar} />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Nhấp để cập nhật ảnh hồ sơ của bạn</p>
                    </TooltipContent>
                </Tooltip>

            </div>

        </div>
    )
}
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { CheckIcon, LoaderCircleIcon } from 'lucide-react';
import { publishBlogAction, unpublishBlogAction } from './action';

interface PublicButtonProps {
    blogId: number;
    initialPublishedState: boolean;
}

const PublicButton = ({ blogId, initialPublishedState }: PublicButtonProps) => {
    const [published, setPublished] = useState(initialPublishedState);
    const [isPending, setIsPending] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handlePublishToggle = async () => {
        setIsPending(true);
        try {
            const action = published ? unpublishBlogAction : publishBlogAction;
            await action({ id: blogId });
            setPublished(!published);
            toast({
                title: 'Success',
                description: published ? 'Blog has been private' : 'Blog has been published',
                variant: 'success'
            });
            router.refresh(); // Refresh the page to get updated data
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update blog status',
                variant: 'destructive'
            });
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Button
            className={`text-white rounded-full py-2 px-4 
                ${published 
                  ? 'bg-yellow-500 border border-yellow-500 hover:bg-yellow-600 dark:bg-yellow-700 dark:hover:bg-yellow-800 dark:border-yellow-700'
                  : 'bg-secondary border border-secondary hover:bg-secondary/80 dark:bg-secondary dark:hover:bg-secondary/80 dark:border-secondary'}
                ${isPending ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={handlePublishToggle}
            style={{ width: '80px' }}
            disabled={isPending}
        >
            {isPending ? (
                <LoaderCircleIcon className="animate-spin" />
            ) : (
                published ? "Private" : "Public"
            )}
        </Button>
    );
}

export default PublicButton;
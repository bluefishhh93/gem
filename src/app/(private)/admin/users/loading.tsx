import { TableSkeleton } from "./users-table";

export default function Loading() {
    return <div>
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <TableSkeleton />
        </div>
    </div>;
}
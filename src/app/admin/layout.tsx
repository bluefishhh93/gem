import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children
}: {
    children: React.ReactNode
}){
    const user = await getCurrentUser();
    if(!user || user.role !== "admin"){
        redirect("/");
    }

    return (
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          {children}
        </div>
      );
}
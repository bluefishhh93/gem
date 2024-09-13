import { Button } from "@/components/ui/button";
import Link from "next/link";

const managementSections = [
    { title: "Products", link: "/admin/products" },
    { title: "Strings", link: "/admin/strings" },
    { title: "Charms", link: "/admin/charms" },
    // Add more sections as needed
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Welcome, Admin!</h2>
     
    </div>
  );
}

function AdminCard({
  title,
  description,
  link,
}: {
  title: string;
  description: string;
  link: string;
}) {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Button asChild>
        <Link href={link}>Manage {title}</Link>
      </Button>
    </div>
  );
}
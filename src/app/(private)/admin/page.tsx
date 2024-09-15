import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import Link from "next/link";
import MetricChart from "./components/charts/metric-chart";
import CategoryChart from "./components/charts/category-chart";
import ProductChart from "./components/charts/product-chart";
import RevenueChart from "./components/charts/revenue-chart";


const managementSections = [
  { title: "Products", link: "/admin/products" },
  { title: "Strings", link: "/admin/strings" },
  { title: "Charms", link: "/admin/charms" },
  // Add more sections as needed
];

export default function AdminDashboardPage(
  // {
  //   metric,
  //   category,
  //   product,
  //   revenue,
  // }: {
  //   metric: React.ReactNode
  //   category: React.ReactNode
  //   product: React.ReactNode
  //   revenue: React.ReactNode
  // }
) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Welcome, Admin!</h2>
      <div>
        <MetricChart />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <CategoryChart />
        <ProductChart />
        <RevenueChart />
      </div>
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
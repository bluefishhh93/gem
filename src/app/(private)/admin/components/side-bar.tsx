"use client"
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, Users, ShoppingCart, Package, Sparkles, Scissors, Boxes, LayoutDashboardIcon, ShellIcon, PencilLineIcon } from "lucide-react";

const mainItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboardIcon },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "SEO", href: "/admin/seo", icon: PencilLineIcon }
];

const inventoryItems = [
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Charms", href: "/admin/charms", icon: Sparkles },
  { label: "Strings", href: "/admin/strings", icon: ShellIcon },
];

export function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const isInventoryPage = inventoryItems.some(item => pathname.startsWith(item.href));
    setShowInventory(isInventoryPage);
  }, [pathname]);

  const isInventoryActive = inventoryItems.some(item => pathname.startsWith(item.href));

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-card border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-2">
          {mainItems.map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              isActive={pathname === item.href}
              isCollapsed={isCollapsed}
            />
          ))}
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 px-4 py-3",
              isInventoryActive && "bg-primary text-primary-foreground font-medium"
            )}
            onClick={() => setShowInventory(!showInventory)}
          >
            <Boxes className="h-5 w-5" />
            {!isCollapsed && <span className="text-sm">Inventory</span>}
          </Button>
          {showInventory && inventoryItems.map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              isActive={pathname === item.href}
              isCollapsed={isCollapsed}
              className="pl-8"
              isInventoryItem={true}
            />
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}

function SidebarItem({ item, isActive, isCollapsed, className, isInventoryItem = false }: { item: any, isActive: boolean, isCollapsed: boolean, className?: string, isInventoryItem?: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
        isActive && !isInventoryItem ? "bg-primary text-primary-foreground font-medium" :
          isActive && isInventoryItem ? "font-bold text-secondary-700" :
            "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        className
      )}
    >
      <item.icon className="h-5 w-5" />
      {!isCollapsed && (
        <span className="text-sm">{item.label}</span>
      )}
    </Link>
  );
}
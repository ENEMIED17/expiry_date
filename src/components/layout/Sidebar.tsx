import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Package2, AlertTriangle, Settings, LogOut, Building2, Scan } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  className?: string;
}

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: MapPin },
  { id: "machines", label: "Vending Machines", icon: Building2 },
  { id: "products", label: "Products", icon: Package2 },
  { id: "scanner", label: "Product Scanner", icon: Scan },
  { id: "alerts", label: "Alerts", icon: AlertTriangle },
  { id: "settings", label: "Settings", icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, className }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast({ title: "Signed out", description: "You have been logged out." });
    navigate("/login");
  };

  return (
    <Card className={cn("w-64 h-screen flex flex-col border-r", className)}>
      <div className="p-6 border-b">
        <h1 className="font-bold text-xl">VendingSync</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={cn("w-full justify-start gap-3 h-11 text-left")}
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Button>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-11 text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </Button>
      </div>
    </Card>
  );
};

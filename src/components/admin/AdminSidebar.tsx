"use client";

import Link from "next/link";
import { useAuth } from "~/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Home, 
  Image as ImageIcon, 
  Hammer, 
  Users,
  LogOut,
  ChevronLeft,
  FileText,
  ShieldAlert,
  UserCog
} from "lucide-react";
import Image from "next/image";

export function AdminSidebar({ 
  currentPath, 
  onClose 
}: { 
  currentPath: string;
  onClose?: () => void;
}) {
  const { logout, user } = useAuth();

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Modelos", path: "/admin/modelos", icon: Home },
    { name: "Portfólio", path: "/admin/portfolio", icon: ImageIcon },
    { name: "Diário de Obras", path: "/admin/diario-de-obras", icon: Hammer },
    { name: "Propostas", path: "/admin/propostas", icon: FileText },
    { name: "Leads (Contatos)", path: "/admin/leads", icon: Users },
    { name: "Operadores", path: "/admin/operadores", icon: UserCog },
  ];

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const handleLogout = () => {
    if (onClose) onClose();
    logout();
  };

  return (
    <aside className="flex h-full w-64 flex-col bg-slate-900 text-slate-300 transition-all border-r border-slate-800 shadow-2xl">
      <div className="flex h-20 items-center justify-center border-b border-slate-800 px-6">
        <Link href="/admin" onClick={handleLinkClick} className="relative h-12 w-32 flex items-center justify-center">
          <Image
            src="/logo.svg"
            alt="Wood Bahia"
            fill
            className="object-contain"
            priority
          />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path || (item.path !== "/admin" && currentPath.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={handleLinkClick}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-800 p-4">
        <div className="mb-4 px-3 text-xs font-medium text-slate-500">
          <p className="truncate">{user?.email}</p>
        </div>
        
        <Link 
          href="/"
          onClick={handleLinkClick}
          className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
        >
          <ChevronLeft className="h-5 w-5 flex-shrink-0" />
          Voltar ao Site
        </Link>
        <button
          onClick={handleLogout}
          className="group mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-slate-800 hover:text-red-300"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          Sair
        </button>
      </div>
    </aside>
  );
}

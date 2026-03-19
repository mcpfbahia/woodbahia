"use client";

import { useAuth } from "~/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Menu } from "lucide-react";
import { AdminSidebar } from "~/components/admin/AdminSidebar";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-slate-500">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full">
        <AdminSidebar currentPath={pathname} />
      </div>
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-8 shadow-sm">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Trigger */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger render={
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-500">
                    <Menu className="h-6 w-6" />
                  </Button>
                } />
                <SheetContent side="left" className="p-0 w-64 border-none bg-slate-900" showCloseButton={false}>
                  <AdminSidebar 
                    currentPath={pathname} 
                    onClose={() => setIsMobileMenuOpen(false)} 
                  />
                </SheetContent>
              </Sheet>
            </div>

            <Image
              src="/logo.svg"
              alt="Wood Bahia Admin"
              width={180}
              height={40}
              className="h-8 md:h-10 w-auto"
            />
            <span className="hidden sm:inline text-slate-300 font-light text-xl">|</span>
            <h1 className="hidden sm:block text-lg font-medium text-slate-500">
              {pathname === "/admin" && "Dashboard"}
              {pathname.includes("/admin/modelos") && "Gestão de Modelos"}
              {pathname.includes("/admin/portfolio") && "Projetos e Portfólio"}
              {pathname.includes("/admin/diario-de-obras") && "Diário de Obras"}
              {pathname.includes("/admin/leads") && "Leads e Contatos"}
              {pathname.includes("/admin/propostas") && "Gerador de Propostas"}
            </h1>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

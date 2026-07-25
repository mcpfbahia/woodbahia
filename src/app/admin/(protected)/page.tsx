"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "~/lib/firebase";
import { useAuth } from "~/contexts/AuthContext";
import { Home, Image as ImageIcon, Hammer, ExternalLink, Users, Activity, Loader2, FileText } from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    modelos: 0,
    portfolio: 0,
    obras: 0,
    propostas: 0,
    leads: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!db) return;
      try {
        const [modelosSnap, portfolioSnap, obrasSnap, leadsSnap, propostasSnap] = await Promise.all([
          getCountFromServer(collection(db, "models")),
          getCountFromServer(collection(db, "portfolio")),
          getCountFromServer(collection(db, "diario_obras")),
          getCountFromServer(collection(db, "leads")),
          getCountFromServer(collection(db, "proposals"))
        ]);

        setStats({
          modelos: modelosSnap.data().count,
          portfolio: portfolioSnap.data().count,
          obras: obrasSnap.data().count,
          leads: leadsSnap.data().count,
          propostas: propostasSnap.data().count,
        });
      } catch (error) {
        console.error("Erro ao carregar estatísticas", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const topCards = [
    { title: "Modelos Ativos", value: stats.modelos, icon: Home, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
    { title: "Projetos no Portfólio", value: stats.portfolio, icon: ImageIcon, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { title: "Obras Cadas.", value: stats.obras, icon: Hammer, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    { title: "Propostas Salvas", value: stats.propostas, icon: FileText, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
    { title: "Leads / Contatos", value: stats.leads, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
  ];

  const modules = [
    {
      title: "Modelos",
      description: "Gerencie as plantas, casas e chalés pré-fabricados.",
      icon: Home,
      href: "/admin/modelos",
      color: "bg-blue-500",
      light: "bg-blue-50",
      text: "text-blue-600"
    },
    {
      title: "Portfólio",
      description: "Adicione fotos de projetos e chalés já entregues.",
      icon: ImageIcon,
      href: "/admin/portfolio",
      color: "bg-emerald-500",
      light: "bg-emerald-50",
      text: "text-emerald-600"
    },
    {
      title: "Diário de Obras",
      description: "Acompanhamento passo-a-passo das obras em andamento.",
      icon: Hammer,
      href: "/admin/diario-de-obras",
      color: "bg-amber-500",
      light: "bg-amber-50",
      text: "text-amber-600"
    },
    {
      title: "Propostas",
      description: "Gerencie, crie e exporte as propostas comerciais do sistema.",
      icon: FileText,
      href: "/admin/propostas",
      color: "bg-rose-500",
      light: "bg-rose-50",
      text: "text-rose-600"
    },
    {
      title: "Leads (Contatos)",
      description: "Visualize as mensagens recebidas via formulário do site.",
      icon: Users,
      href: "/admin/leads",
      color: "bg-indigo-500",
      light: "bg-indigo-50",
      text: "text-indigo-600"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Bem-vindo(a) ao seu Painel</h2>
          <p className="text-slate-500">
            Você está logado como <span className="font-semibold text-slate-700">{user?.email}</span>. O que deseja gerenciar hoje?
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 border border-green-200">
          <Activity className="h-4 w-4" />
          Sistema Online
        </div>
      </div>

      {loading ? (
        <div className="flex py-12 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          {topCards.map((card, i) => (
            <div key={i} className={`rounded-xl border ${card.border} bg-white p-5 shadow-sm`}>
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.bg} ${card.color}`}>
                  <card.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{card.title}</p>
                  <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {modules.map((mod) => (
          <div key={mod.title} className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
            <div className={`mb-4 inline-flex rounded-xl p-3 ${mod.light} ${mod.text}`}>
              <mod.icon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-800">{mod.title}</h3>
            <p className="mb-6 text-sm text-slate-500">{mod.description}</p>
            
            <Link
              href={mod.href}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors group-hover:bg-primary group-hover:text-white"
            >
              Acessar Módulo
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

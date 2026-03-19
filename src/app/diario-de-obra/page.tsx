"use client";

import React from 'react';
import { Construction, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DiarioDeObra() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[#735F53] hover:text-[#B06D46] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Voltar para Home
        </Link>

        <div className="bg-white p-8 md:p-16 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 text-center">
          <div className="w-20 h-20 bg-[#F2E6DD] rounded-3xl flex items-center justify-center mx-auto mb-8 text-[#B06D46]">
            <Construction className="w-10 h-10" />
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-[#4A2B1D] mb-6">
            Diário de <span className="text-[#B06D46] italic">Obra</span>
          </h1>
          
          <p className="text-lg text-[#735F53] max-w-2xl mx-auto leading-relaxed mb-10">
            Acompanhe o passo a passo da construção dos nossos chalés. 
            Em breve, esta página trará fotos, vídeos e atualizações semanais dos nossos projetos em execução.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 bg-[#FAF8F5] rounded-2xl border border-[#EFE8DF]">
              <h3 className="font-bold text-[#4A2B1D] mb-2">Fundação</h3>
              <p className="text-sm text-[#735F53]">Verifique o início sólido de cada estrutura.</p>
            </div>
            <div className="p-6 bg-[#FAF8F5] rounded-2xl border border-[#EFE8DF]">
              <h3 className="font-bold text-[#4A2B1D] mb-2">Montagem</h3>
              <p className="text-sm text-[#735F53]">O encaixe preciso da madeira tratada.</p>
            </div>
            <div className="p-6 bg-[#FAF8F5] rounded-2xl border border-[#EFE8DF]">
              <h3 className="font-bold text-[#4A2B1D] mb-2">Acabamento</h3>
              <p className="text-sm text-[#735F53]">A entrega do chalé pronto para morar.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

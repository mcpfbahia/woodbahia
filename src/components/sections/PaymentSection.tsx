import { CreditCard, Home, MessageCircle, CheckCircle2 } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "~/components/common/ScrollReveal";

export const PaymentSection = () => {
  return (
    <section id="pagamento" className="py-20 md:py-32 bg-slate-50 overflow-hidden relative">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <ScrollReveal>
          <StaggerContainer className="text-center mb-16">
            <StaggerItem>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">Formas de Pagamento</h2>
            </StaggerItem>
            <StaggerItem>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Facilitamos o pagamento para tornar seu projeto de casa pré-fabricada mais acessível e seguro.
              </p>
            </StaggerItem>
          </StaggerContainer>

          <StaggerContainer className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Card 1 */}
            <StaggerItem>
              <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 h-full flex flex-col relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute -top-10 -right-10 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500 group-hover:rotate-12">
                  <CreditCard className="w-64 h-64" />
                </div>
                <div className="relative z-10 flex-1">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                    <CreditCard className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8">Cartão de Crédito</h3>
                  <ul className="space-y-5 mb-8">
                    <li className="flex items-start gap-4">
                      <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                      <span className="text-slate-600 font-medium">Parcelamento fácil e sem burocracia</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                      <span className="text-slate-600 font-medium">Juros baixos aplicados conforme operadora do cartão</span>
                    </li>
                  </ul>
                </div>
                <div className="relative z-10 mt-auto bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10 rounded-2xl p-6 flex flex-col gap-4">
                  <div>
                    <p className="text-xl sm:text-3xl font-bold text-slate-900 leading-tight whitespace-nowrap">
                      Até <span className="text-primary font-black text-2xl sm:text-4xl">18x</span> no cartão
                    </p>
                    <p className="text-slate-500 text-[10px] sm:text-xs mt-2 font-medium leading-tight">
                      Simule o valor das parcelas e descubra quanto pagará pelo seu kit.
                    </p>
                  </div>
                  <a 
                    href="/simulador/parcelamento"
                    className="w-full inline-flex items-center justify-center bg-primary text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 hover:-translate-y-0.5 transition-all text-sm uppercase tracking-wide"
                  >
                    Simule sua Compra
                  </a>
                  <div className="absolute top-0 right-0 p-3">
                     <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                      </span>
                  </div>
                </div>
              </div>
            </StaggerItem>

            {/* Card 2 */}
            <StaggerItem>
              <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 h-full flex flex-col relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                 <div className="absolute -top-10 -right-10 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500 group-hover:-rotate-12">
                  <Home className="w-64 h-64" />
                </div>
                <div className="relative z-10 flex-1">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                    <Home className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8">Pagamento Progressivo da Obra</h3>
                  
                  <div className="relative pl-6 before:absolute before:inset-0 before:left-[11px] before:top-2 before:bottom-6 before:w-0.5 before:bg-gradient-to-b before:from-primary/30 before:via-primary/20 before:to-transparent space-y-6">
                    {/* Timeline progressiva */}
                    <div className="relative flex items-start group/step">
                      <div className="absolute -left-6 top-1 flex items-center justify-center w-5 h-5 rounded-full border-[4px] border-white bg-primary text-white z-10 flex-shrink-0 shadow-sm" />
                      <div>
                          <p className="font-black text-primary text-2xl leading-none mb-1 group-hover/step:translate-x-1 transition-transform">30%</p>
                          <p className="font-medium text-slate-600 text-sm">Sinal na assinatura do contrato</p>
                      </div>
                    </div>
                    
                    <div className="relative flex items-start group/step">
                      <div className="absolute -left-6 top-1 flex items-center justify-center w-5 h-5 rounded-full border-[4px] border-white bg-primary text-white z-10 flex-shrink-0 shadow-sm" />
                      <div>
                          <p className="font-black text-primary text-2xl leading-none mb-1 group-hover/step:translate-x-1 transition-transform">20%</p>
                          <p className="font-medium text-slate-600 text-sm">Na entrega do kit no local da obra</p>
                      </div>
                    </div>

                    <div className="relative flex items-start group/step">
                      <div className="absolute -left-6 top-1.5 flex items-center justify-center w-5 h-5 rounded-full border-[4px] border-white bg-slate-300 text-white z-10 flex-shrink-0" />
                      <div>
                          <p className="font-bold text-slate-700 text-base leading-tight">Parcelas proporcionais</p>
                          <p className="text-slate-500 text-xs mt-1">Conforme o andamento da construção</p>
                      </div>
                    </div>

                    <div className="relative flex items-start group/step">
                      <div className="absolute -left-6 top-1.5 flex items-center justify-center w-5 h-5 rounded-full border-[4px] border-white bg-green-500 text-white z-10 flex-shrink-0 shadow-sm" />
                      <div>
                          <p className="font-bold text-green-700 text-base leading-tight tracking-tight uppercase">Pagamento Final</p>
                          <p className="text-slate-600 text-xs mt-1 font-medium">Concluído na entrega da obra</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>

          <StaggerContainer className="text-center max-w-3xl mx-auto flex flex-col items-center">
            <StaggerItem>
              <div className="inline-block bg-white rounded-2xl p-6 mb-10 shadow-lg shadow-slate-200/50 border border-slate-100 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-md">
                  Transparência
                </div>
                <p className="text-slate-700 font-medium text-lg md:text-xl italic leading-relaxed pt-2">
                  "Nosso modelo de pagamento acompanha o avanço da obra, garantindo segurança e transparência para ambas as partes."
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <a
                href="https://wa.me/5571992936290"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-green-500 px-10 py-5 text-lg md:text-xl font-bold text-white transition-all shadow-xl shadow-green-500/30 hover:-translate-y-1 hover:shadow-2xl hover:bg-green-600"
              >
                <MessageCircle className="h-6 w-6" />
                Falar no WhatsApp
              </a>
            </StaggerItem>
          </StaggerContainer>
        </ScrollReveal>
      </div>
    </section>
  );
};

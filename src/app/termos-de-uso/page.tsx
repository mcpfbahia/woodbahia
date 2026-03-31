"use client";

import { Header } from "~/components/layout/Header";
import { FooterWoodBahia } from "~/components/layout/FooterWoodBahia";
import { WhatsAppButton } from "~/components/common/WhatsAppButton";
import { ScrollReveal } from "~/components/common/ScrollReveal";
import { Gavel, Info, ShieldCheck, Scale, Image as ImageIcon, ShoppingBag, AlertTriangle, ExternalLink } from "lucide-react";

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Gavel className="w-4 h-4" />
                Segurança Jurídica
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6 leading-tight">
                Termos e Condições de Uso
              </h1>
              <p className="text-muted-foreground font-medium">Última atualização: 10/01/2026</p>
            </div>
          </ScrollReveal>

          <div className="space-y-12">
            <ScrollReveal>
              <div className="prose prose-slate max-w-none">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Bem-vindo ao site da <strong>Wood Bahia - Casas Pré Fabricadas</strong> (<a href="https://www.woodbahia.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">https://www.woodbahia.com</a>). Ao aceder e utilizar este site, concorda em cumprir e ficar vinculado aos seguintes Termos e Condições de Uso. Se não concordar com qualquer parte destes termos, não deverá utilizar o nosso site.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-wood">
                <h2 className="text-2xl font-serif font-bold text-primary mb-6 flex items-center gap-3">
                  <Info className="w-6 h-6" />
                  1. Aceitação dos Termos
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Ao utilizar o nosso site para consultar catálogos, ler informações ou solicitar orçamentos, concorda com estes Termos de Uso e com a nossa Política de Privacidade.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-wood">
                <h2 className="text-2xl font-serif font-bold text-primary mb-6 flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6" />
                  2. Uso do Site
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>O utilizador compromete-se a utilizar o site apenas para fins lícitos e de forma que não infrinja os direitos de terceiros, nem restrinja ou iniba o uso do site por qualquer outra pessoa. É expressamente proibido:</p>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Tentar contornar as medidas de segurança do site (hacking, extração de dados/scraping).</li>
                    <li>Enviar spam ou mensagens não solicitadas através dos nossos formulários.</li>
                  </ul>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-wood">
                <h2 className="text-2xl font-serif font-bold text-primary mb-6 flex items-center gap-3">
                  <ImageIcon className="w-6 h-6" />
                  3. Propriedade Intelectual (Imagens e Projetos)
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>Todo o conteúdo presente neste site, incluindo, mas não se limitando a: fotografias dos chalés, plantas baixas, textos, logótipos, gráficos e design do site, é propriedade exclusiva da Wood Bahia ou licenciado para nós.</p>
                  <p className="font-semibold text-primary/90">É estritamente proibida a cópia, reprodução, distribuição ou utilização comercial das nossas imagens, projetos arquitetónicos ou textos sem a nossa autorização prévia e por escrito.</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-wood">
                <h2 className="text-2xl font-serif font-bold text-primary mb-6 flex items-center gap-3">
                  <ShoppingBag className="w-6 h-6" />
                  4. Produtos, Projetos e Preços
                </h2>
                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">Imagens Ilustrativas:</h3>
                    <p>As fotografias, renderizações (imagens 3D) e plantas apresentadas no site são de caráter ilustrativo. Os projetos finais podem sofrer alterações consoante o terreno, personalizações solicitadas pelo cliente e viabilidade técnica.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">Orçamentos:</h3>
                    <p>Os valores ou estimativas apresentados no site (caso existam) estão sujeitos a alterações sem aviso prévio, dependendo do custo dos materiais, frete e local da obra. Apenas uma proposta comercial enviada diretamente pela nossa equipa após avaliação tem validade legal.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-wood border-destructive/10">
                <h2 className="text-2xl font-serif font-bold text-primary mb-6 flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6" />
                  5. Limitação de Responsabilidade
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Esforçamo-nos para manter as informações do site corretas e atualizadas. No entanto, não garantimos que o site esteja livre de erros, interrupções ou que todas as informações estejam sempre completas. A Wood Bahia não se responsabiliza por eventuais danos diretos ou indiretos decorrentes do uso, ou da incapacidade de usar, este site.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-card border border-border rounded-3xl p-8 shadow-wood">
                  <h2 className="text-xl font-serif font-bold text-primary mb-4 flex items-center gap-3">
                    <ExternalLink className="w-5 h-5" />
                    6. Links para Terceiros
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    O nosso site pode conter links para sites de terceiros (como as nossas redes sociais, Instagram, Facebook). Não temos controlo sobre esses sites e não assumimos qualquer responsabilidade pelo seu conteúdo.
                  </p>
                </div>
                <div className="bg-card border border-border rounded-3xl p-8 shadow-wood">
                  <h2 className="text-xl font-serif font-bold text-primary mb-4 flex items-center gap-3">
                    <Scale className="w-5 h-5" />
                    7. Modificações
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    A Wood Bahia reserva-se o direito de alterar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor imediatamente após a sua publicação no site.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="text-center bg-primary/5 border border-primary/20 rounded-3xl p-10">
                <h2 className="text-2xl font-serif font-bold text-primary mb-6 flex items-center justify-center gap-3">
                  <Gavel className="w-6 h-6" />
                  8. Legislação Aplicável e Foro
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Para a resolução de qualquer conflito ou litígio que possa surgir da interpretação ou execução destes termos, fica eleito o foro da <strong>Comarca de Lauro de Freitas Bahia</strong>.
                </p>
                <div className="pt-8 border-t border-border/30">
                  <p className="text-sm font-semibold text-primary">Wood Bahia - Casas Pré Fabricadas</p>
                  <p className="text-xs text-muted-foreground mt-1">Sustentabilidade e Compromisso com você.</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </main>

      <FooterWoodBahia />
      <WhatsAppButton />
    </div>
  );
}

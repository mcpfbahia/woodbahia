"use client";

import { Header } from "~/components/layout/Header";
import { Footer } from "~/components/layout/Footer";
import { WhatsAppButton } from "~/components/common/WhatsAppButton";
import { ScrollReveal } from "~/components/common/ScrollReveal";
import { Shield, Lock, Eye, FileText, UserCheck, Mail } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Shield className="w-4 h-4" />
                Segurança e Transparência
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
                Política de Privacidade
              </h1>
              <p className="text-muted-foreground">Última atualização: 10/01/2026</p>
            </div>
          </ScrollReveal>

          <div className="space-y-12">
            <ScrollReveal>
              <div className="prose prose-slate max-w-none">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  A <strong>Wood Bahia - Casas Pré Fabricadas</strong> tem o compromisso de proteger a privacidade e os dados pessoais dos utilizadores que visitam o nosso site e utilizam os nossos serviços.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Esta Política de Privacidade descreve como recolhemos, utilizamos, armazenamos e protegemos as suas informações, em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018).
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-wood">
                <h2 className="text-2xl font-serif font-bold text-primary mb-6 flex items-center gap-3">
                  <Eye className="w-6 h-6" />
                  1. Que dados recolhemos?
                </h2>
                <div className="space-y-6 text-muted-foreground">
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">Dados fornecidos por si:</h3>
                    <p>Quando preenche o formulário de contacto, solicita um orçamento ou clica no botão do WhatsApp, recolhemos o seu Nome, E-mail, Número de Telefone e a mensagem ou modelo de interesse.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">Dados de navegação (Cookies):</h3>
                    <p>Recolhemos dados automáticos sobre a sua navegação, como endereço IP, tipo de navegador, páginas visitadas e tempo de permanência no site, através de ferramentas como o Google Analytics ou Meta Pixel, para melhorar a sua experiência e otimizar os nossos anúncios.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-wood">
                <h2 className="text-2xl font-serif font-bold text-primary mb-6 flex items-center gap-3">
                  <FileText className="w-6 h-6" />
                  2. Para que utilizamos os seus dados?
                </h2>
                <ul className="space-y-4 text-muted-foreground list-disc pl-5">
                  <li>Responder às suas solicitações de orçamento e dúvidas enviadas pelo site ou WhatsApp.</li>
                  <li>Entrar em contacto para apresentar propostas comerciais referentes aos nossos projetos de casas e chalés.</li>
                  <li>Enviar comunicações de marketing, novidades ou ofertas (apenas se tiver consentido, podendo cancelar a qualquer momento).</li>
                  <li>Melhorar o desempenho, o design e a segurança do nosso site.</li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-card border border-border rounded-3xl p-8 shadow-wood">
                  <h2 className="text-xl font-serif font-bold text-primary mb-4 flex items-center gap-3">
                    <UserCheck className="w-5 h-5" />
                    3. Compartilhamento
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    A Wood Bahia não vende nem aluga os seus dados pessoais a terceiros. Podemos partilhar as suas informações apenas com fornecedores de serviços essenciais e autoridades legais, caso seja exigido por lei.
                  </p>
                </div>
                <div className="bg-card border border-border rounded-3xl p-8 shadow-wood">
                  <h2 className="text-xl font-serif font-bold text-primary mb-4 flex items-center gap-3">
                    <Lock className="w-5 h-5" />
                    4. Proteção
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Implementamos medidas de segurança técnicas e administrativas (como o uso de certificados SSL) para proteger os seus dados contra acessos não autorizados ou divulgação indevida.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 md:p-10">
                <h2 className="text-2xl font-serif font-bold text-primary mb-6 flex items-center gap-3">
                  <Shield className="w-6 h-6" />
                  5. Os seus direitos (LGPD)
                </h2>
                <div className="grid sm:grid-cols-2 gap-6 text-muted-foreground text-sm">
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    Confirmar a existência de tratamento dos seus dados.
                  </div>
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    Aceder aos seus dados.
                  </div>
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    Corrigir dados incompletos ou inexatos.
                  </div>
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    Solicitar a eliminação de dados desnecessários.
                  </div>
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    Revogar o consentimento a qualquer momento.
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="text-center bg-card border border-border rounded-3xl p-10 shadow-wood">
                <h2 className="text-2xl font-serif font-bold text-primary mb-6 flex items-center justify-center gap-3">
                  <Mail className="w-6 h-6" />
                  6. Contacto
                </h2>
                <p className="text-muted-foreground mb-8">
                  Se tiver dúvidas sobre esta Política de Privacidade ou sobre o tratamento dos seus dados, por favor, contacte-nos:
                </p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">E-mail</p>
                    <p className="text-primary font-medium text-lg">woodbahia@gmail.com</p>
                  </div>
                  <div className="w-px h-10 bg-border hidden md:block" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">WhatsApp</p>
                    <p className="text-primary font-medium text-lg">71 9 9293-6290</p>
                  </div>
                </div>
                <div className="mt-10 pt-8 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Exposição em Lauro de Freitas – Bahia
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

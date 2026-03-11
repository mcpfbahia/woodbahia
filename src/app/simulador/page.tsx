"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calculator, Lock, CheckCircle2, AlertTriangle,
    RefreshCw, MessageCircle, ChevronRight,
    Package, Layers, Home, Hammer, Sparkles, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { Header } from '~/components/layout/Header';
import { Footer } from '~/components/layout/Footer';
import { WhatsAppButton } from '~/components/common/WhatsAppButton';
import { saveLead } from '~/lib/leads';

// ─────────────────────────────────────────────
// Dados de negócio
// ─────────────────────────────────────────────

const PACOTES = [
    {
        id: 'kit-madeiramento',
        nome: '1. Kit Madeiramento Completo',
        preco: 850,
        descricao: 'Estrutura de madeira bruta completa (peças, vigas e painéis)',
        icon: Layers,
        highlight: false,
    },
    {
        id: 'kit-telhas-stain',
        nome: '2. Kit 1 + Telhas + Stain',
        preco: 1020,
        descricao: 'Kit 1 + cobertura com telhas e proteção Stain na madeira',
        icon: Home,
        highlight: false,
    },
    {
        id: 'kit-montagem',
        nome: '3. Kit 2 + Mão de Obra',
        preco: 1550,
        descricao: 'Kit 2 + montagem completa por nossa equipe especializada',
        icon: Hammer,
        highlight: false,
    },
    {
        id: 'conforto',
        nome: '4. Pacote Conforto',
        preco: 1680,
        descricao: 'Kit 3 + instalação hidráulica e elétrica básica (consulte)',
        icon: Package,
        highlight: true,
        badge: 'MAIS VENDIDO',
    },
    {
        id: 'premium',
        nome: '5. Pacote Premium',
        preco: 1950,
        descricao: 'Kit 4 + fachada de vidro e acabamentos premium',
        icon: Sparkles,
        highlight: false,
    },
];

const ADICIONAIS = [
    { id: 'radier', nome: 'Base em Radier', preco: 300, descricao: '+R$ 300/m²' },
    { id: 'declive', nome: 'Terreno em Aclive/Declive de 50cm até 1m', preco: 250, descricao: '+R$ 250/m²' },
    { id: 'piso', nome: 'Piso e Revestimento', preco: 230, descricao: '+R$ 230/m²' },
];

const formatBRL = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

// ─────────────────────────────────────────────
// Passo 1 – Calculadora
// ─────────────────────────────────────────────
interface Step1Props {
    area: number;
    setArea: (v: number) => void;
    pacoteId: string;
    setPacoteId: (v: string) => void;
    selecionados: string[];
    toggleAdicional: (id: string) => void;
    onNext: () => void;
}

function Step1({ area, setArea, pacoteId, setPacoteId, selecionados, toggleAdicional, onNext }: Step1Props) {
    return (
        <motion.div
            key="step1"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.4 }}
            className="space-y-10"
        >
            {/* Slider de área */}
            <section>
                <h2 className="text-xl font-bold text-primary mb-1">1. Área da construção</h2>
                <p className="text-muted-foreground text-sm mb-6">Arraste para selecionar os metros quadrados desejados</p>
                <div className="flex items-center gap-6">
                    <div className="bg-primary/10 border border-primary/20 rounded-2xl px-6 py-4 flex-shrink-0 min-w-[120px] text-center">
                        <span className="text-5xl font-black text-primary leading-none">{area}</span>
                        <span className="text-primary/70 block text-sm font-semibold mt-1">m²</span>
                    </div>
                    <div className="flex-1">
                        <input
                            type="range"
                            min={15}
                            max={200}
                            value={area}
                            onChange={(e) => setArea(Number(e.target.value))}
                            className="w-full h-2 bg-primary/20 rounded-full appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>15 m²</span>
                            <span>200 m²</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pacotes */}
            <section>
                <h2 className="text-xl font-bold text-primary mb-1">2. Escolha o Pacote</h2>
                <p className="text-muted-foreground text-sm mb-6">Selecione o nível de serviço desejado</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:grid-cols-2">
                    {PACOTES.map((p) => {
                        const Icon = p.icon;
                        const ativo = pacoteId === p.id;
                        return (
                            <button
                                key={p.id}
                                onClick={() => setPacoteId(p.id)}
                                className={`relative flex flex-col items-start gap-2 p-5 rounded-2xl border-2 text-left transition-all duration-200 group
                  ${ativo
                                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                                        : p.highlight
                                            ? 'border-amber-400/60 bg-amber-50/60 hover:border-amber-500'
                                            : 'border-border bg-card hover:border-primary/40 hover:bg-primary/5'}`}
                            >
                                {p.badge && (
                                    <span className="absolute -top-3 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-0.5 rounded-full z-10">
                                        {p.badge}
                                    </span>
                                )}
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                  ${ativo ? 'bg-primary text-white' : 'bg-primary/10 text-primary group-hover:bg-primary/20'}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="mt-2">
                                    <p className="font-bold text-sm text-foreground">{p.nome}</p>
                                    <p className="text-xs text-muted-foreground leading-tight">{p.descricao}</p>
                                </div>
                                <p className={`font-black text-lg mt-4 ${ativo ? 'text-primary' : 'text-foreground/70'}`}>
                                    {formatBRL(p.preco)}<span className="text-xs font-normal text-muted-foreground">/m²</span>
                                </p>
                                {ativo && (
                                    <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-primary" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Adicionais */}
            <section>
                <h2 className="text-xl font-bold text-primary mb-1">3. Serviços Adicionais</h2>
                <p className="text-muted-foreground text-sm mb-6">Selecione os extras que se aplicam ao seu projeto (opcional)</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {ADICIONAIS.map((a) => {
                        const ativo = selecionados.includes(a.id);
                        return (
                            <button
                                key={a.id}
                                onClick={() => toggleAdicional(a.id)}
                                className={`flex flex-col items-start gap-1 p-5 rounded-2xl border-2 text-left transition-all
                  ${ativo ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-primary/40'}`}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <p className="font-bold text-sm">{a.nome}</p>
                                    {ativo && <CheckCircle2 className="w-4 h-4 text-primary" />}
                                </div>
                                <p className="text-primary font-semibold text-sm">{a.descricao}</p>
                            </button>
                        );
                    })}
                </div>
            </section>

            <button
                onClick={onNext}
                disabled={!pacoteId}
                className="w-full flex items-center justify-center gap-3 py-5 px-8 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
                <Calculator className="w-5 h-5" />
                Calcular Estimativa
                <ChevronRight className="w-5 h-5" />
            </button>
        </motion.div>
    );
}

// ─────────────────────────────────────────────
// Passo 2 – Captura de Lead
// ─────────────────────────────────────────────
interface Step2Props {
    nome: string;
    setNome: (v: string) => void;
    whatsapp: string;
    setWhatsapp: (v: string) => void;
    onNext: () => void;
    isSaving: boolean;
}

function Step2({ nome, setNome, whatsapp, setWhatsapp, onNext, isSaving }: Step2Props) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (nome.trim().length < 2 || whatsapp.trim().length < 8) return;
        onNext();
    };

    return (
        <motion.div
            key="step2"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center text-center space-y-8 py-6"
        >
            <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                <Lock className="w-9 h-9 text-primary" />
            </div>

            <div>
                <h2 className="text-3xl font-bold text-primary mb-2">
                    Sua simulação está pronta!
                </h2>
                <p className="text-muted-foreground max-w-sm mx-auto">
                    Informe seus dados para liberar o resultado completo e falar com um de nossos consultores.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 text-left">
                <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Seu Nome</label>
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Ex: João Silva"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">WhatsApp com DDD</label>
                    <input
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="Ex: 71 99999-9999"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/30 hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isSaving ? 'Salvando...' : 'Ver Valor da Obra'}
                    <ChevronRight className="w-5 h-5" />
                </button>
            </form>
            <p className="text-xs text-muted-foreground">🔒 Seus dados estão protegidos. Sem spam.</p>
        </motion.div>
    );
}

// ─────────────────────────────────────────────
// Passo 3 – Resultado
// ─────────────────────────────────────────────
interface Step3Props {
    area: number;
    pacoteId: string;
    selecionados: string[];
    nome: string;
    whatsapp: string;
    onRefazer: () => void;
}

function Step3({ area, pacoteId, selecionados, nome, whatsapp, onRefazer }: Step3Props) {
    const pacote = PACOTES.find((p) => p.id === pacoteId)!;
    const adicionalPorM2 = ADICIONAIS.filter((a) => selecionados.includes(a.id)).reduce((s, a) => s + a.preco, 0);
    const valorM2 = pacote.preco + adicionalPorM2;
    const total = area * valorM2;

    const mensagem = encodeURIComponent(
        `Olá! Sou ${nome} e fiz uma simulação no site da Wood Bahia.\n\n` +
        `📐 Área: ${area}m²\n` +
        `📦 Pacote: ${pacote.nome} (R$${pacote.preco}/m²)\n` +
        (selecionados.length ? `➕ Adicionais: ${ADICIONAIS.filter((a) => selecionados.includes(a.id)).map((a) => a.nome).join(', ')}\n` : '') +
        `💰 Valor estimado: ${formatBRL(total)}\n\n` +
        `Meu WhatsApp: ${whatsapp}\n\n` +
        `Gostaria de falar com um consultor.`
    );

    const waUrl = `https://wa.me/5571992936290?text=${mensagem}`;

    return (
        <motion.div
            key="step3"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            {/* Header do resultado */}
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold mb-4">
                    <CheckCircle2 className="w-4 h-4" />
                    Simulação Concluída, {nome.split(' ')[0]}!
                </div>
                <h2 className="text-4xl font-bold text-primary mb-2">
                    Estimativa da sua obra
                </h2>
            </div>

            {/* Card de valores */}
            <div className="bg-gradient-to-br from-primary/5 via-amber-50/60 to-primary/10 border-2 border-primary/20 rounded-3xl p-8 text-center shadow-xl">
                <p className="text-muted-foreground text-sm font-semibold uppercase tracking-wider mb-2">Valor Total Estimado</p>
                <div className="text-5xl md:text-6xl font-black text-primary leading-none mb-4">{formatBRL(total)}</div>
                <p className="text-muted-foreground text-sm font-medium">
                    {area}m² × {formatBRL(valorM2)}/m²
                </p>

                <div className="mt-8 pt-8 border-t border-primary/10 grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-xl md:text-2xl font-black text-foreground">{area}m²</p>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1">Área</p>
                    </div>
                    <div>
                        <p className="text-xl md:text-2xl font-black text-foreground">{formatBRL(valorM2)}</p>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1">m²</p>
                    </div>
                    <div>
                        <p className="text-base md:text-xl font-bold text-foreground leading-tight">{pacote.nome.split('.')[1]?.trim().split(' ')[0] || pacote.nome}</p>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1">Pacote</p>
                    </div>
                </div>
            </div>

            {/* Adicionais incluídos */}
            {selecionados.length > 0 && (
                <div className="bg-card border border-border rounded-2xl p-5">
                    <p className="text-sm font-semibold text-foreground mb-3">Serviços adicionais incluídos:</p>
                    <div className="flex flex-wrap gap-2">
                        {ADICIONAIS.filter((a) => selecionados.includes(a.id)).map((a) => (
                            <span key={a.id} className="inline-flex items-center gap-1 text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
                                <CheckCircle2 className="w-3 h-3" /> {a.nome}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Alerta */}
            <div className="flex gap-3 items-start bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-amber-800 text-xs md:text-sm leading-relaxed">
                    <strong>Informação Importante:</strong> Esta é uma estimativa aproximada baseada nos valores atuais de mercado. O valor final pode variar conforme as características do terreno, logística e acabamentos específicos. Uma proposta formal será enviada após conversa com nossa equipe técnica.
                </p>
            </div>

            {/* Botão WhatsApp */}
            <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 py-5 px-8 rounded-2xl bg-green-500 text-white font-bold text-xl shadow-xl shadow-green-500/30 hover:bg-green-600 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
            >
                <MessageCircle className="w-6 h-6" />
                Falar com Consultor Agora
            </a>

            {/* Refazer */}
            <button
                onClick={onRefazer}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors text-sm font-medium"
            >
                <RefreshCw className="w-4 h-4" />
                Refazer simulação
            </button>
        </motion.div>
    );
}

// ─────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────
const STEP_LABELS = ['Simulador', 'Identificação', 'Resultado'];

export default function InvestmentSimulationPage() {
    const [step, setStep] = useState(1);
    const [area, setArea] = useState(40);
    const [pacoteId, setPacoteId] = useState('conforto');
    const [selecionados, setSelecionados] = useState<string[]>([]);
    const [nome, setNome] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleAdicional = (id: string) => {
        setSelecionados((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const resetar = () => {
        setStep(1);
        setArea(40);
        setPacoteId('conforto');
        setSelecionados([]);
        setNome('');
        setWhatsapp('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToStep = (n: number) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStep(n);
    };

    const handleSaveLead = async () => {
        setIsSaving(true);
        try {
            const pacote = PACOTES.find((p) => p.id === pacoteId)!;
            const adicionalPorM2 = ADICIONAIS.filter((a) => selecionados.includes(a.id)).reduce((s, a) => s + a.preco, 0);
            const valorM2 = pacote.preco + adicionalPorM2;
            const total = area * valorM2;

            await saveLead({
                nome,
                whatsapp,
                origem: 'simulador',
                detalhes: {
                    area,
                    pacote: pacote.nome,
                    adicionais: ADICIONAIS.filter((a) => selecionados.includes(a.id)).map(a => a.nome),
                    valorM2,
                    totalEstimado: total
                }
            });
            goToStep(3);
        } catch (error) {
            console.error('Falha ao salvar lead:', error);
            // Mesmo se falhar o salvamento, mostramos o resultado para não travar a experiência do usuário
            goToStep(3);
        } finally {
            setIsSaving(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
            <Header />
            <main className="pt-28 pb-24 relative overflow-hidden">
                {/* Visual Style Patterns */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-primary/5 to-transparent -z-10" />

                <div className="container mx-auto px-4 max-w-4xl relative z-10">

                    {/* Navegação */}
                    <Link
                        href="/"
                        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Voltar para a página inicial
                    </Link>

                    {/* Título da página */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em] mb-6">
                            <Calculator className="w-4 h-4" />
                            Simulador Instantâneo
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-primary mb-6 leading-tight tracking-tight">
                            Quanto custa o seu<br className="hidden md:block" /> chalé dos sonhos?
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto md:text-xl">
                            Simule o investimento para o seu projeto em menos de 2 minutos. 100% gratuito e personalizado.
                        </p>
                    </div>

                    {/* Steps indicadores */}
                    <div className="flex items-center justify-center gap-3 mb-12">
                        {STEP_LABELS.map((label, i) => {
                            const num = i + 1;
                            const done = step > num;
                            const active = step === num;
                            return (
                                <div key={num} className="flex items-center gap-3">
                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border
                    ${done ? 'bg-green-50 border-green-200 text-green-700' : active ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white border-slate-200 text-slate-400'}`}>
                                        {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span>{num}</span>}
                                        <span className="hidden sm:inline">{label}</span>
                                    </div>
                                    {i < 2 && <div className={`w-8 h-px ${step > num ? 'bg-green-200' : 'bg-slate-200'}`} />}
                                </div>
                            );
                        })}
                    </div>

                    {/* Cartão principal */}
                    <div className="bg-card backdrop-blur-sm border border-border rounded-[2.5rem] p-6 md:p-12 shadow-2xl shadow-primary/10 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] -mr-32 -mt-32" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[80px] -ml-32 -mb-32" />
                        
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <Step1
                                    area={area}
                                    setArea={setArea}
                                    pacoteId={pacoteId}
                                    setPacoteId={setPacoteId}
                                    selecionados={selecionados}
                                    toggleAdicional={toggleAdicional}
                                    onNext={() => goToStep(2)}
                                />
                            )}
                            {step === 2 && (
                                <Step2
                                    nome={nome}
                                    setNome={setNome}
                                    whatsapp={whatsapp}
                                    setWhatsapp={setWhatsapp}
                                    onNext={handleSaveLead}
                                    isSaving={isSaving}
                                />
                            )}
                            {step === 3 && (
                                <Step3
                                    area={area}
                                    pacoteId={pacoteId}
                                    selecionados={selecionados}
                                    nome={nome}
                                    whatsapp={whatsapp}
                                    onRefazer={resetar}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
            <Footer />
            <WhatsAppButton />
        </div>
    );
}

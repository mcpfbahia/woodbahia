import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BRAZIL_STATES = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
];

interface StepLocationProps {
  initialData: { name: string; city: string; state: string; distance?: number };
  onNext: (data: { name: string; city: string; state: string; distance?: number }) => void;
  onBack: () => void;
}

export function StepLocation({ initialData, onNext, onBack }: StepLocationProps) {
  const [name, setName] = useState(initialData.name || '');
  const [city, setCity] = useState(initialData.city || '');
  const [stateCode, setStateCode] = useState(initialData.state || '');
  const [distance, setDistance] = useState<number | string>(initialData.distance || '');

  const isValid = name.trim().length > 2 && city.trim().length > 2 && stateCode !== '';

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
      className="max-w-xl mx-auto"
    >
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 border border-accent/20">
          <MapPin className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold font-display mb-3">
          Onde seu chalé <span className="text-gradient-warm italic">ganhará vida</span>?
        </h2>
        <p className="text-muted-foreground">
          Para uma simulação mais realista, informe seu nome e o local onde será montado o chalé.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-6 md:p-8 flex flex-col gap-5 mb-8 border border-border/50">
        <div className="space-y-2">
          <Label htmlFor="clientName">Seu Nome</Label>
          <Input 
            id="clientName" 
            placeholder="Digite seu nome completo" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-background/50 h-12"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="clientCity">Cidade da Obra</Label>
            <Input 
              id="clientCity" 
              placeholder="Ex: Salvador" 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="bg-background/50 h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientState">Estado</Label>
            <Select value={stateCode} onValueChange={(val) => setStateCode(val || '')}>
              <SelectTrigger className="bg-background/50 h-12 text-left">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {BRAZIL_STATES.map((st) => (
                  <SelectItem key={st.value} value={st.value}>
                    {st.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Distância Adicional (Logística) */}
        <div className="space-y-2 pt-4 border-t border-border/30">
          <div className="flex justify-between items-center">
            <Label htmlFor="clientDistance" className="text-sm font-semibold">Distância de Lauro de Freitas (em km)</Label>
            <span className="text-[10px] text-accent uppercase font-bold tracking-wider bg-accent/10 px-2 py-0.5 rounded border border-accent/20">Importante</span>
          </div>
          <Input 
            id="clientDistance" 
            type="number"
            placeholder="Ex: 150 (Deixe em branco se for Lauro de Freitas ou RMS)" 
            value={distance}
            onChange={(e) => setDistance(e.target.value === '' ? '' : Number(e.target.value))}
            className="bg-background/50 h-12"
          />
          <p className="text-[11px] text-muted-foreground italic leading-relaxed">
            *A opção de obra Chave na Mão está disponível apenas num raio de até 160km da nossa sede. Para outros locais, onde não administramos a obra, fornecemos o Kit e fazemos a indicação de carpinteiros parceiros responsáveis e capacitados (Montagem Parceira).
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="gap-2 rounded-xl">
          Cancelar
        </Button>
        <Button 
          onClick={() => onNext({ name, city, state: stateCode, distance: distance !== '' ? Number(distance) : undefined })} 
          disabled={!isValid} 
          className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl premium-shadow"
        >
          Continuar <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

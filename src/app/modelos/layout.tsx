import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Modelos de Chalés e Casas de Madeira | Wood Bahia",
  description: "Conheça nossos modelos de chalés de madeira Pinus tratada e casas pré-fabricadas. Projetos premium para Airbnb, moradia, campo e praia na Bahia e Sergipe.",
  keywords: [
    "chalé de madeira bahia",
    "casa pré-fabricada bahia",
    "chalé para airbnb",
    "chalé a-frame",
    "casa de madeira",
    "chalé de madeira",
    "casa de campo de madeira",
    "wood bahia modelos"
  ].join(", ")
};

export default function ModelsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

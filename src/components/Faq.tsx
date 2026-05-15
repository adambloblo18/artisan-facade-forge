import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQ = [
  {
    q: "Quel budget prévoir ?",
    a: "Panneau d'enseigne à partir de 1 500€. Décor de devanture type Castor Bellux : 8 000 à 15 000€. Façade complète type Mucha (18 m²) : au-delà de 20 000€. Estimation gratuite en 1 heure, jours ouvrés.",
  },
  {
    q: "Est-ce adapté à l'extérieur ?",
    a: "Oui. Le grès ingélif cuit à 1 220°C orne les façades Art Nouveau parisiennes depuis plus d'un siècle. La Ferme la Jouvette : 10+ ans au soleil, au mistral et au gel, sans altération.",
  },
  {
    q: "Travaillez-vous avec des architectes ?",
    a: "Oui. NDA signés, plaquettes d'émaux, fiches techniques et PV feu disponibles sur demande. Commission prescripteur définie clairement sur devis signé.",
  },
  {
    q: "Quels délais pour un projet ?",
    a: "Comptez 6 à 10 semaines entre la validation du projet et la livraison prête à poser. Pour les projets complexes (façade complète, plus de 20 m²), prévoir 3 à 4 mois.",
  },
  {
    q: "Intervenez-vous partout en France ?",
    a: "Oui, France, Belgique et Suisse. La livraison est organisée selon la nature du projet.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="max-w-3xl mx-auto divide-y divide-border border-y border-border">
      {FAQ.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 py-5 text-left"
            >
              <span className="font-serif text-lg md:text-xl text-[color:var(--anthracite)]">{item.q}</span>
              {isOpen ? <Minus className="h-5 w-5 text-[color:var(--gold)]" /> : <Plus className="h-5 w-5 text-[color:var(--gold)]" />}
            </button>
            <div
              className="overflow-hidden transition-all duration-300"
              style={{ maxHeight: isOpen ? 400 : 0 }}
            >
              <p className="pb-5 text-foreground/80 leading-relaxed">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

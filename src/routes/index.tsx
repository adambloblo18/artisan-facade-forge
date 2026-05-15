import { createFileRoute } from "@tanstack/react-router";
import { Phone, ArrowRight, Star, Trophy, Clock, Flame, MapPin, Calendar } from "lucide-react";
import MultiStepForm from "@/components/MultiStepForm";
import Faq from "@/components/Faq";
import Lightbox, { Zoomable } from "@/components/Lightbox";

export const Route = createFileRoute("/")({
  component: Home,
});

const PHOTOS = {
  hero: "/images/hero-castor.jpg",
  mosaique: "/images/mosaique-sol.png",
  halle: "/images/la-halle.webp",
  jouvette: "/images/ferme-jouvette.jpg",
  laurence: "/images/laurence.jpg",
  atelier: "/images/atelier.jpg",
  emaux: "/images/emaux.jpg",
};

const REEL = [
  { src: PHOTOS.hero, alt: "Façade Castor Bellux à Dinard" },
  { src: PHOTOS.halle, alt: "Médaillons La Halle Marly-Gomont" },
  { src: PHOTOS.jouvette, alt: "Ferme la Jouvette dans la Drôme" },
  { src: PHOTOS.mosaique, alt: "Mosaïque de sol Castor Bellux" },
  { src: PHOTOS.emaux, alt: "Palette de 200 émaux préparés à la main" },
  { src: PHOTOS.atelier, alt: "Atelier de Laurence au Vésinet" },
  { src: PHOTOS.laurence, alt: "Laurence Brecher peignant une pièce" },
];

function Home() {
  return (
    <>
      {/* Bandeau urgence */}
      <div className="bg-[color:var(--anthracite)] text-[color:var(--cream)]/90 text-xs md:text-sm py-2 text-center container-px">
        <span className="font-medium">Capacité atelier 2026 : 6 projets restants.</span>
        <span className="hidden sm:inline"> Réponse en 20 minutes pendant les heures ouvrées.</span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[color:var(--cream)]/85 backdrop-blur-md border-b border-border/60">
        <div className="container-px max-w-7xl mx-auto flex items-center justify-between py-4">
          <a href="#main-content" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[color:var(--anthracite)] text-[color:var(--cream)] grid place-items-center font-serif text-lg">LB</div>
            <div className="leading-tight">
              <div className="font-serif text-base md:text-lg text-[color:var(--anthracite)]">Laurence Brecher</div>
              <div className="text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Céramique architecturale · depuis 2002</div>
            </div>
          </a>
          <nav className="flex items-center gap-2 md:gap-4">
            <a
              href="tel:+33670025133"
              className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-[color:var(--anthracite)] hover:text-[color:var(--gold)]"
            >
              <Phone className="h-4 w-4" /> 06 70 02 51 33
            </a>
            <a href="#contact" className="btn-primary text-sm py-2.5 px-4">
              Recevoir une estimation
            </a>
          </nav>
        </div>
      </header>

      <main id="main-content">

        {/* HERO */}
        <section className="container-px max-w-7xl mx-auto pt-12 md:pt-20 pb-16 md:pb-24 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 reveal-on-scroll">
            <div className="inline-flex items-center gap-2 text-xs text-foreground/70 border border-border bg-white/60 rounded-full px-3 py-1.5">
              <span className="text-[color:var(--gold)]">★★★★★</span>
              <span>5,0 sur Google</span>
              <span className="opacity-40">·</span>
              <span>Prix du Ravalement Versailles 2025</span>
            </div>
            <h1 className="mt-6 text-[2.4rem] md:text-[3.6rem] leading-[1.04] text-balance">
              Une façade qui transforme les passants en{" "}
              <em className="not-italic font-serif italic text-[color:var(--gold)]">clients.</em>
            </h1>
            <p className="mt-6 text-lg text-foreground/75 max-w-xl leading-relaxed">
              Pour restaurants, hôtels et architectes qui veulent une identité visuelle mémorable.
              Peint à la main dans notre atelier du Vésinet.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#contact" className="btn-primary">
                Recevoir une première estimation <ArrowRight className="h-4 w-4" />
              </a>
              <a href="tel:+33670025133" className="btn-ghost">
                ou 06 70 02 51 33
              </a>
            </div>
          </div>
          <div className="lg:col-span-6 reveal-on-scroll">
            <div className="relative">
              <Zoomable
                src={PHOTOS.hero}
                alt="Façade céramique du restaurant Castor Bellux à Dinard, panneaux peints à la main"
                className="w-full h-[420px] md:h-[560px] object-cover shadow-[0_40px_80px_-30px_rgba(20,49,59,0.45)]"
                loading="eager"
              />
              <div className="hidden md:block absolute -bottom-6 -left-6 bg-[color:var(--cream)] border border-border px-5 py-4 shadow-lg max-w-[220px]">
                <div className="flex items-center gap-2 text-[color:var(--gold)]">
                  <Trophy className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Prix Versailles 2025</span>
                </div>
                <p className="mt-1 text-sm text-foreground/80">Restitution de Décors</p>
              </div>
            </div>
          </div>
        </section>

        {/* PREUVES */}
        <section className="border-y border-border bg-white/60">
          <div className="container-px max-w-7xl mx-auto py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Calendar, label: "20+ ans d'atelier au Vésinet" },
              { icon: Flame, label: "1 220°C grès ingélif, tient le gel" },
              { icon: Clock, label: "1h estimation par email (jours ouvrés)" },
              { icon: Star, label: "Capacité 2026 limitée" },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <s.icon className="h-5 w-5 text-[color:var(--gold)] mt-1" aria-hidden />
                <p className="text-sm md:text-base text-foreground/85 leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FORMULAIRE */}
        <section id="contact" className="container-px max-w-7xl mx-auto py-20 md:py-28">
          <div className="text-center max-w-2xl mx-auto mb-10 reveal-on-scroll">
            <p className="eyebrow">Estimation gratuite</p>
            <h2 className="text-3xl md:text-5xl mt-3">Parlons de votre projet</h2>
            <p className="mt-4 text-foreground/70">
              4 champs, 30 secondes. Estimation par email en 1 heure (jours ouvrés).
            </p>
          </div>
          <div className="reveal-on-scroll">
            <MultiStepForm />
          </div>
        </section>

        {/* TROIS PROJETS */}
        <section id="realisations" className="container-px max-w-7xl mx-auto py-20 md:py-28">
          <div className="max-w-2xl reveal-on-scroll">
            <p className="eyebrow">Réalisations</p>
            <h2 className="text-3xl md:text-5xl mt-3 text-balance">Trois projets, trois ambiances.</h2>
            <p className="mt-4 text-foreground/70">
              Façade de restaurant qui attire, médaillons Art Nouveau qui évoquent Mucha, fresque provençale qui tient
              depuis 10 ans au mistral.
            </p>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              {
                src: PHOTOS.hero,
                title: "Castor Bellux, Dinard",
                lead: "Une façade devenue signature du quartier",
                body: "Quatre panneaux peints à la main, bleu nuit et rouge bordeaux, mosaïque de sol de 3 m × 3 m à l'entrée.",
              },
              {
                src: PHOTOS.halle,
                title: "La Halle, Marly-Gomont",
                lead: "Trois médaillons inspirés de Mucha",
                body: "Médaillons ovales d'un mètre peints un à un, cuits à 1 220°C, posés sur vert sapin.",
              },
              {
                src: PHOTOS.jouvette,
                title: "Ferme la Jouvette, Drôme",
                lead: "10 ans au mistral, sans altération",
                body: "Panneau horizontal bleu nuit, constellé de fleurs et papillons. Les couleurs tiennent depuis une décennie.",
              },
            ].map((p, i) => (
              <article key={i} className="group reveal-on-scroll">
                <div className="overflow-hidden">
                  <Zoomable
                    src={p.src}
                    alt={p.title}
                    className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <p className="mt-5 text-xs uppercase tracking-[0.18em] text-[color:var(--gold)]">{p.title}</p>
                <h3 className="mt-2 font-serif text-2xl text-[color:var(--anthracite)]">{p.lead}</h3>
                <p className="mt-2 text-foreground/75 leading-relaxed">{p.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* CITATION JURY */}
        <section className="bg-[color:var(--anthracite)] text-[color:var(--cream)]">
          <div className="container-px max-w-4xl mx-auto py-20 md:py-28 text-center reveal-on-scroll">
            <Trophy className="h-10 w-10 text-[color:var(--gold)] mx-auto" />
            <p className="mt-6 font-serif italic text-2xl md:text-3xl leading-snug text-balance">
              « Une intervention exemplaire qui redonne vie au patrimoine céramique versaillais
              avec une maîtrise technique et une sensibilité artistique remarquables. »
            </p>
            <p className="mt-6 text-sm uppercase tracking-[0.2em] text-[color:var(--cream)]/60">
              Jury du Prix du Ravalement · Ville de Versailles · Édition 2025
            </p>
          </div>
        </section>

        {/* MOSAIQUE */}
        <section className="bg-white/70 border-y border-border">
          <div className="container-px max-w-7xl mx-auto py-20 md:py-28 grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 reveal-on-scroll">
              <Zoomable
                src={PHOTOS.mosaique}
                alt="Mosaïque de sol 3m × 3m de Castor Bellux, motif Art Nouveau"
                className="w-full h-[400px] md:h-[560px] object-cover shadow-[0_30px_60px_-30px_rgba(20,49,59,0.4)]"
              />
            </div>
            <div className="lg:col-span-5 reveal-on-scroll">
              <p className="eyebrow">Focus matière</p>
              <h2 className="mt-3 text-3xl md:text-4xl text-balance">
                Le sol comme signature : la mosaïque Castor Bellux.
              </h2>
              <p className="mt-6 text-foreground/80 leading-relaxed">
                Sous le seuil d'entrée du restaurant Castor Bellux, une mosaïque de 3 m × 3 m accueille chaque convive.
                Tesselles de grès ingélif assemblées une à une, motif inspiré des sols Art Nouveau bruxellois du début du
                XXe siècle. Résistance au trafic intense, au lavage haute pression, à l'usure du temps.
              </p>
              <a href="#realisations" className="btn-ghost mt-8">
                Voir d'autres projets de sol <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <section className="py-20 md:py-24">
          <div className="container-px max-w-7xl mx-auto text-center reveal-on-scroll">
            <p className="eyebrow">Atelier</p>
            <h2 className="mt-3 text-3xl md:text-5xl">Une centaine de projets, depuis 2002.</h2>
          </div>
          <div className="marquee-wrap mt-12 overflow-hidden">
            <div className="marquee">
              {[...REEL, ...REEL].map((img, i) => (
                <div key={i} className="shrink-0 w-[280px] md:w-[360px] h-[200px] md:h-[260px] overflow-hidden">
                  <Zoomable
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ATELIER */}
        <section className="bg-[color:var(--anthracite)] text-[color:var(--cream)]">
          <div className="container-px max-w-7xl mx-auto py-20 md:py-28">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="reveal-on-scroll">
                <p className="eyebrow text-[color:var(--gold)]">Le geste</p>
                <h2 className="mt-3 text-3xl md:text-5xl text-[color:var(--cream)] text-balance">
                  Tout se fait ici. Aucune sous-traitance.
                </h2>
                <p className="mt-6 text-[color:var(--cream)]/80 leading-relaxed">
                  Laurence peint, émaille et cuit chaque pièce dans son atelier du Vésinet. Formée à l'École Duperré, dans
                  la filiation esthétique de l'Art Nouveau (Guimard, Gallé, École de Nancy), elle travaille le grès et la
                  faïence depuis plus de vingt ans. Sa palette de 200 émaux préparés à la cendre et au feldspath permet de
                  composer des tons qu'aucun catalogue industriel ne saura reproduire.
                </p>
                <div className="mt-8 inline-flex items-center gap-2 text-sm text-[color:var(--cream)]/70">
                  <MapPin className="h-4 w-4 text-[color:var(--gold)]" />
                  14 rue Ernest André · Le Vésinet · 78110
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 reveal-on-scroll">
                <Zoomable src={PHOTOS.laurence} alt="Laurence Brecher peignant une pièce de céramique" className="w-full h-72 object-cover col-span-2" />
                <Zoomable src={PHOTOS.atelier} alt="Atelier de céramique au Vésinet" className="w-full h-52 object-cover" />
                <Zoomable src={PHOTOS.emaux} alt="Palette de 200 émaux préparés à la main" className="w-full h-52 object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="container-px max-w-7xl mx-auto py-20 md:py-28">
          <div className="max-w-2xl reveal-on-scroll">
            <p className="eyebrow">Méthode</p>
            <h2 className="mt-3 text-3xl md:text-5xl">Un projet, quatre étapes.</h2>
          </div>
          <ol className="mt-12 grid md:grid-cols-4 gap-8 md:gap-6">
            {[
              { n: "01", t: "Premier échange", d: "1h", body: "Photos, dimensions, style, timing. Vérification de faisabilité et retour rapide." },
              { n: "02", t: "Maquette et devis", d: "1 à 2 semaines", body: "Esquisse, palette, format et prix détaillé avant toute mise en production." },
              { n: "03", t: "Fabrication atelier", d: "4 à 8 semaines", body: "Modelage, peinture, émaillage puis cuisson à 1 220°C. Chaque pièce est numérotée." },
              { n: "04", t: "Livraison et pose", d: "1 semaine", body: "Conditionnement sur palette avec notice de pose. Accompagnement possible du poseur." },
            ].map((p) => (
              <li key={p.n} className="reveal-on-scroll border-t-2 border-[color:var(--gold)] pt-5">
                <div className="font-serif text-3xl text-[color:var(--gold)]">{p.n}</div>
                <h3 className="mt-3 font-serif text-xl text-[color:var(--anthracite)]">{p.t}</h3>
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mt-1">{p.d}</p>
                <p className="mt-3 text-foreground/75 leading-relaxed text-sm">{p.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        <section className="bg-white/70 border-y border-border">
          <div className="container-px max-w-7xl mx-auto py-20 md:py-28">
            <div className="text-center max-w-2xl mx-auto mb-12 reveal-on-scroll">
              <p className="eyebrow">Questions fréquentes</p>
              <h2 className="mt-3 text-3xl md:text-5xl">Ce qu'on nous demande souvent.</h2>
            </div>
            <div className="reveal-on-scroll"><Faq /></div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="container-px max-w-7xl mx-auto py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[color:var(--gold)] border border-[color:var(--gold)]/40 bg-[color:var(--gold)]/5 px-4 py-2 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--gold)]" />
            6 projets restants en 2026
          </div>
          <h2 className="mt-6 text-3xl md:text-5xl text-balance max-w-3xl mx-auto">
            Prêt à donner une signature à votre lieu ?
          </h2>
          <p className="mt-5 text-foreground/75 max-w-xl mx-auto">
            Quatre champs, 30 secondes. Vous obtenez une première estimation par email en 1 heure (jours ouvrés), sans
            engagement.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href="#contact" className="btn-primary">
              Recevoir une estimation <ArrowRight className="h-4 w-4" />
            </a>
            <a href="tel:+33670025133" className="btn-gold">
              <Phone className="h-4 w-4" /> Appeler Laurence
            </a>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-border bg-[color:var(--anthracite)] text-[color:var(--cream)]/80">
          <div className="container-px max-w-7xl mx-auto py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p>Laurence Brecher · Céramique architecturale · Le Vésinet · <a href="tel:+33670025133" className="hover:text-[color:var(--gold)]">06 70 02 51 33</a></p>
            <a
              href="https://www.ceramique-murale.com/mentions-legales/"
              className="hover:text-[color:var(--gold)]"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mentions légales
            </a>
          </div>
        </footer>
      </main>

      <Lightbox />
    </>
  );
}

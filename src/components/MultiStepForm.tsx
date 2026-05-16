import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, ArrowLeft, Loader2, Building2, Brush, LayoutGrid, Landmark, Sparkles } from "lucide-react";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_ACCESS_KEY = "31bd2d6f-50c1-427d-9efd-cab0d1fada12";
const REDIRECT_BASE = "https://www.ceramique-murale.com/merci-pour-votre-demande-de-projet/";

const schema = z.object({
  type: z.enum(["enseigne", "fresque", "mosaique", "restauration", "autre"]),
  taille: z.enum(["petit", "moyen", "grand"]),
  delai: z.enum(["mois", "1-3mois", "3-6mois", "explore"]),
  nom: z.string().trim().min(2, "Au moins 2 caractères").max(80),
  email: z.string().trim().email("Email invalide").max(120),
  telephone: z.string().trim().min(8, "Téléphone invalide").max(30),
  ville: z.string().trim().max(80).optional().or(z.literal("")),
  precisions: z.string().trim().max(800).optional().or(z.literal("")),
  rgpd: z.boolean().refine((v) => v === true, {
    message: "Merci d'accepter d'être recontacté.",
  }),
  botcheck: z.string().max(0).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

const TYPE_OPTIONS = [
  { v: "enseigne", label: "Enseigne extérieure", icon: Building2 },
  { v: "fresque", label: "Fresque murale", icon: Brush },
  { v: "mosaique", label: "Mosaïque ou sol", icon: LayoutGrid },
  { v: "restauration", label: "Restauration patrimoniale", icon: Landmark },
  { v: "autre", label: "Autre projet", icon: Sparkles },
] as const;

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const mountedAt = useRef(0);
  useEffect(() => { mountedAt.current = Date.now(); }, []);

  const {
    register, handleSubmit, watch, setValue, trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: undefined as unknown as FormValues["type"],
      taille: undefined as unknown as FormValues["taille"],
      delai: undefined as unknown as FormValues["delai"],
      nom: "", email: "", telephone: "", ville: "", precisions: "",
      rgpd: false as unknown as true,
      botcheck: "",
    },
    mode: "onTouched",
  });

  const type = watch("type");
  const taille = watch("taille");
  const delai = watch("delai");

  const next = async () => {
    let ok = true;
    if (step === 1) ok = !!type;
    if (step === 2) ok = !!taille && !!delai;
    if (step === 3) ok = await trigger(["nom", "email", "telephone"]);
    if (ok) setStep((s) => Math.min(4, s + 1));
  };
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);
    if (values.botcheck) return;
    if (Date.now() - mountedAt.current < 500) {
      setSubmitError("Merci de prendre un instant pour vérifier vos informations.");
      return;
    }

    const parts = values.nom.trim().split(/\s+/);
    const firstname = parts[0] || values.nom;
    const lastname = parts.slice(1).join(" ") || "";
    const timestamp = Date.now();

    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("lcm_email", values.email);
        sessionStorage.setItem("lcm_phone", values.telephone);
      }
    } catch {}

    try {
      console.log("[MultiStepForm] Submitting to Web3Forms", {
        email: values.email,
        type: values.type,
      });
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: "🏛️ Nouveau projet façade restaurant - ceramique-murale.com",
          from_name: "Formulaire artisan-facade-forge",
          cc: "bloch-adam@hotmail.com",
          name: values.nom,
          email: values.email,
          phone: values.telephone,
          message: values.precisions || "",
          profil: values.ville || "",
          type_projet: values.type,
          budget: values.taille,
          echeance: values.delai,
          botcheck: values.botcheck || "",
        }),
      });
      const result = await response.json();
      if (result.success !== true) throw new Error(result.message || "submit failed");

      const params = new URLSearchParams({
        email: values.email,
        phone: values.telephone || "",
        fn: firstname,
        ln: lastname,
        value: "500",
        tx: `LEAD-${timestamp}`,
      });

      const adParams = ["gclid", "wbraid", "gbraid", "msclkid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
      adParams.forEach((key) => {
        const val = sessionStorage.getItem(`lcm_${key}`);
        if (val) params.set(key, val);
      });

      if (typeof window !== "undefined" && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
        (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", "conversion", {
          send_to: "AW-11400865534/XrKfCJ-31J0cEP7Nrbwq",
          value: 500.0,
          currency: "EUR",
          transaction_id: `LEAD-${timestamp}`,
        });
      }

      window.location.href = `${REDIRECT_BASE}?${params.toString()}`;
    } catch (err) {
      console.error("[MultiStepForm] Submit error:", err);
      setSubmitError("Une erreur est survenue. Merci de réessayer ou d'appeler le 06 70 02 51 33.");
    }
  };

  const inputCls = "mt-2 w-full rounded-sm border border-border bg-white px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-[color:var(--gold)]";

  return (
    <form
      id="contact-form"
      onSubmit={handleSubmit(onSubmit, (errs) => {
        console.error("[MultiStepForm] Validation errors:", errs);
        const firstError = Object.values(errs)[0]?.message as string | undefined;
        setSubmitError(firstError || "Merci de vérifier tous les champs obligatoires.");
      })}
      noValidate
      className="max-w-2xl mx-auto bg-white shadow-[0_30px_80px_-40px_rgba(20,49,59,0.35)] rounded-sm p-6 md:p-10 border border-border/60"
    >
      {/* Honeypot - inert au lieu de aria-hidden pour ne pas bloquer GTM */}
      <div
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden", pointerEvents: "none" }}
        // @ts-expect-error inert is a valid HTML attribute
        inert=""
      >
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("botcheck")}
        />
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="flex-1 h-[3px] rounded-full bg-border overflow-hidden">
            <div
              className="h-full bg-[color:var(--gold)] transition-all duration-500"
              style={{ width: step >= n ? "100%" : "0%" }}
            />
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-5">
          <div>
            <p className="eyebrow">Étape 1 sur 4</p>
            <h3 className="text-2xl mt-1">Quel type de projet ?</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TYPE_OPTIONS.map(({ v, label, icon: Icon }) => {
              const active = type === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => setValue("type", v, { shouldValidate: true })}
                  className={`flex items-center gap-3 px-4 py-4 rounded-sm border text-left transition-all ${
                    active
                      ? "border-[color:var(--gold)] bg-[color:var(--gold)]/10"
                      : "border-border hover:border-foreground/30"
                  }`}
                >
                  <Icon className="h-5 w-5 text-[color:var(--anthracite)]" aria-hidden />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <p className="eyebrow">Étape 2 sur 4</p>
            <h3 className="text-2xl mt-1">Taille et délai</h3>
          </div>
          <fieldset>
            <legend className="text-sm font-medium mb-2">Taille approximative</legend>
            <div className="grid grid-cols-3 gap-2">
              {[
                { v: "petit", label: "Petit", sub: "< 1 m²" },
                { v: "moyen", label: "Moyen", sub: "1 à 3 m²" },
                { v: "grand", label: "Grand", sub: "3 m² et +" },
              ].map((o) => (
                <button
                  key={o.v}
                  type="button"
                  onClick={() => setValue("taille", o.v as FormValues["taille"], { shouldValidate: true })}
                  className={`px-3 py-3 rounded-sm border text-center transition-all ${
                    taille === o.v ? "border-[color:var(--gold)] bg-[color:var(--gold)]/10" : "border-border hover:border-foreground/30"
                  }`}
                >
                  <div className="text-sm font-medium">{o.label}</div>
                  <div className="text-xs text-muted-foreground">{o.sub}</div>
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm font-medium mb-2">Délai souhaité</legend>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { v: "mois", label: "Dans le mois" },
                { v: "1-3mois", label: "1 à 3 mois" },
                { v: "3-6mois", label: "3 à 6 mois" },
                { v: "explore", label: "J'explore" },
              ].map((o) => (
                <button
                  key={o.v}
                  type="button"
                  onClick={() => setValue("delai", o.v as FormValues["delai"], { shouldValidate: true })}
                  className={`px-3 py-3 rounded-sm border text-sm text-center transition-all ${
                    delai === o.v ? "border-[color:var(--gold)] bg-[color:var(--gold)]/10" : "border-border hover:border-foreground/30"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <div>
            <p className="eyebrow">Étape 3 sur 4</p>
            <h3 className="text-2xl mt-1">Vos coordonnées</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nom" className="text-sm font-medium">Nom</label>
              <input id="nom" type="text" autoComplete="name" {...register("nom")} className={inputCls} />
              {errors.nom && <p className="mt-1 text-sm text-destructive">{errors.nom.message}</p>}
            </div>
            <div>
              <label htmlFor="ville" className="text-sm font-medium">Ville</label>
              <input id="ville" type="text" autoComplete="address-level2" {...register("ville")} className={inputCls} />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium">Email pro *</label>
              <input id="email" type="email" autoComplete="email" {...register("email")} className={inputCls} />
              {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="telephone" className="text-sm font-medium">Téléphone *</label>
              <input id="telephone" type="tel" autoComplete="tel" placeholder="06 12 34 56 78" {...register("telephone")} className={inputCls} />
              {errors.telephone && <p className="mt-1 text-sm text-destructive">{errors.telephone.message}</p>}
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-5">
          <div>
            <p className="eyebrow">Étape 4 sur 4</p>
            <h3 className="text-2xl mt-1">Précisions</h3>
          </div>
          <div>
            <label htmlFor="precisions" className="text-sm font-medium">
              Décrivez votre lieu, vos inspirations, vos contraintes
            </label>
            <textarea
              id="precisions" rows={5}
              placeholder="Ex. devanture brasserie 4m de large, style Art Nouveau, pose souhaitée avant été 2026."
              {...register("precisions")} className={inputCls}
            />
          </div>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" {...register("rgpd")} className="mt-1 accent-[color:var(--gold)]" />
            <span>J'accepte d'être recontacté(e) par l'atelier au sujet de mon projet. Mes données ne seront jamais transmises à des tiers.</span>
          </label>
          {errors.rgpd && <p className="text-sm text-destructive">{errors.rgpd.message as string}</p>}
          {submitError && <p role="alert" className="text-sm text-destructive">{submitError}</p>}
        </div>
      )}

      <div className="flex items-center justify-between mt-8 gap-3">
        {step > 1 ? (
          <button type="button" onClick={prev} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Retour
          </button>
        ) : <span />}

        {step < 4 ? (
          <button type="button" onClick={next} className="btn-primary">
            Continuer <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-60">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Envoyer ma demande <ArrowRight className="h-4 w-4" /></>}
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center mt-5">
        Réponse en 20 minutes pendant les heures ouvrées, gratuit, sans engagement.
      </p>
    </form>
  );
}

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Loader2, Trophy } from "lucide-react";

/**
 * Webapp: Verifica interattiva – Unità 0 (Strumenti matematici)
 * Classe target: 1ª superiore (14 anni)
 *
 * Sezioni:
 *  - Parte A: Scelta multipla (5 domande)
 *  - Parte B: Risposte brevi / numeriche (5 esercizi)
 *  - Parte C: Problemi aperti (3 tracce – valutazione manuale)
 *
 * Punteggio: /20 (A=5, B=10, C=5). Per C viene proposta una griglia rapida.
 *
 * Styling: TailwindCSS + framer-motion.
 */

const parteA = [
  {
    id: "A1",
    question: "La frazione equivalente di 2/3 è:",
    options: ["4/5", "6/9", "8/15", "5/9"],
    correctIndex: 1,
  },
  {
    id: "A2",
    question: "Il 25% di 240 è:",
    options: ["48", "60", "64", "72"],
    correctIndex: 1,
  },
  {
    id: "A3",
    question: "Arrotonda 0,0487 alle millesime:",
    options: ["0,05", "0,048", "0,049", "0,0480"],
    correctIndex: 2,
  },
  {
    id: "A4",
    question: "La potenza di 10 che corrisponde a un miliardo è:",
    options: ["10^5", "10^6", "10^7", "10^9"],
    correctIndex: 3,
  },
  {
    id: "A5",
    question: "L’equazione 3x − 5 = 10 ha soluzione:",
    options: ["x = 3", "x = 5", "x = 15", "x = 15/3"],
    correctIndex: 1,
  },
];

function normalizeNumber(input) {
  if (typeof input !== "string") return null;
  const s = input.replace(/,/g, ".").replace(/\s+/g, "").trim();
  if (s === "") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

const parteB = [
  {
    id: "B1",
    prompt: "Scrivi la proporzione 4/6 = x/12 e calcola x.",
    expected: 8,
    tolerance: 0,
    unit: "",
  },
  {
    id: "B2",
    prompt: "Calcola l’ipotenusa di un triangolo rettangolo con cateti 5 cm e 12 cm.",
    expected: 13,
    tolerance: 0.0001,
    unit: "cm",
  },
  {
    id: "B3",
    prompt: "Completa y = 2x + 1 per x = −1, 0, 1, 2. Inserisci i 4 valori di y separati da virgola.",
    expectedList: [-1, 1, 3, 5],
  },
  {
    id: "B4",
    prompt: "Risolvi l’equazione: 2(x + 3) = 14. Inserisci il valore di x.",
    expected: 4,
    tolerance: 0,
  },
  {
    id: "B5",
    prompt: "Trova la formula inversa di y = 3x − 4. Scrivi x = ... in funzione di y.",
    expectedTextVariants: ["x=(y+4)/3", "x = (y+4)/3", "(y+4)/3"],
  },
];

const parteC = [
  {
    id: "C1",
    title: "Sconto del 15% su 600 €. Calcola prezzo scontato e risparmio (spiega i passaggi).",
    rubric:
      "Pieno (5): usa 0,15×600=90, prezzo=510, spiegazione coerente. Parziale (3-4): risultato ok con passaggi incompleti/minimi errori. Base (1-2): idea corretta ma calcoli errati o incompleti.",
  },
  {
    id: "C2",
    title: "Percorso 3 km bici + 4 km a piedi: modella con triangolo rettangolo e calcola la distanza in linea retta.",
    rubric:
      "Pieno (5): Pitagora 3^2+4^2=9+16=25 → √25=5 km; disegno/descrizione chiara. Parziale (3-4): calcoli quasi corretti o spiegazione essenziale. Base (1-2): riconosce Pitagora ma con errori rilevanti.",
  },
  {
    id: "C3",
    title: "Costo fotocopie y = 0,5x: con 5 € quante copie? Se spendi 8 €, quante copie? Spiega.",
    rubric:
      "Pieno (5): x = 10 con 5€, x = 16 con 8€; spiega proporzionalità diretta. Parziale (3-4): risultati ok ma spiegazione minima. Base (1-2): idea giusta con errori nei numeri.",
  },
];

function Card({ children, className = "" }) {
  return <div className={`rounded-2xl shadow-sm border p-5 bg-white ${className}`}>{children}</div>;
}

function SectionTitle({ children, badge }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <h2 className="text-xl font-semibold">{children}</h2>
      {badge && <span className="text-xs px-2 py-1 rounded-full bg-gray-100 border">{badge}</span>}
    </div>
  );
}

export default function App() {
  const [aAnswers, setAAnswers] = useState(Array(parteA.length).fill(null));
  const [bAnswers, setBAnswers] = useState({ B1: "", B2: "", B3: "", B4: "", B5: "" });
  const [cAnswers, setCAnswers] = useState({ C1: "", C2: "", C3: "" });
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    if (!submitted) return { A: 0, B: 0, C: 0, total: 0 };

    let scoreA = 0;
    parteA.forEach((q, i) => {
      if (aAnswers[i] === q.correctIndex) scoreA += 1;
    });

    let scoreB = 0;

    const b1 = normalizeNumber(bAnswers.B1);
    if (b1 !== null && Math.abs(b1 - 8) <= 0) scoreB += 2;

    const b2 = normalizeNumber(bAnswers.B2);
    if (b2 !== null && Math.abs(b2 - 13) <= 0.0001) scoreB += 2;

    const list = bAnswers.B3
      .split(",")
      .map((s) => normalizeNumber(s))
      .filter((x) => x !== null);
    const expectedList = [-1, 1, 3, 5];
    if (list.length === 4 && list.every((v, i) => Math.abs(v - expectedList[i]) <= 0.0001)) scoreB += 2;

    const b4 = normalizeNumber(bAnswers.B4);
    if (b4 !== null && Math.abs(b4 - 4) <= 0) scoreB += 2;

    const normText = (bAnswers.B5 || "").replace(/\s+/g, "").toLowerCase();
    const okB5 = ["x=(y+4)/3", "x = (y+4)/3", "(y+4)/3"].some(
      (t) => t.replace(/\s+/g, "").toLowerCase() === normText
    );
    if (okB5) scoreB += 2;

    let scoreC = 0;

    const total = scoreA + scoreB + scoreC;
    return { A: scoreA, B: scoreB, C: scoreC, total };
  }, [submitted, aAnswers, bAnswers]);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  function resetAll() {
    setAAnswers(Array(parteA.length).fill(null));
    setBAnswers({ B1: "", B2: "", B3: "", B4: "", B5: "" });
    setCAnswers({ C1: "", C2: "", C3: "" });
    setSubmitted(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.h1 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="text-2xl md:text-3xl font-bold mb-2">
          Verifica interattiva – Unità 0 (Strumenti matematici)
        </motion.h1>
        <p className="text-sm text-gray-600 mb-6">
          Classe: 1ª superiore • Tempo consigliato: 50′ • Punteggio automatico: /15 (Parte A + B).<br />
          La Parte C (/5) è valutata manualmente con la griglia suggerita.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <SectionTitle badge="5 domande · 1 pt ciascuna">Parte A – Scelta multipla</SectionTitle>
            <div className="space-y-5">
              {parteA.map((q, idx) => (
                <div key={q.id}>
                  <div className="font-medium mb-2">{idx + 1}. {q.question}</div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {q.options.map((opt, i) => {
                      const chosen = aAnswers[idx] === i;
                      const isCorrect = submitted && i === q.correctIndex;
                      const isWrong = submitted && chosen && !isCorrect;
                      return (
                        <label
                          key={i}
                          className={`flex items-center gap-2 rounded-xl border p-3 cursor-pointer select-none transition ${
                            chosen ? "ring-1 ring-gray-300" : ""
                          } ${submitted && isCorrect ? "bg-green-50 border-green-300" : ""} ${submitted && isWrong ? "bg-red-50 border-red-300" : ""}`}
                        >
                          <input
                            type="radio"
                            name={q.id}
                            className="accent-gray-900"
                            checked={chosen}
                            onChange={() => {
                              const next = [...aAnswers];
                              next[idx] = i;
                              setAAnswers(next);
                            }}
                          />
                          <span>{opt}</span>
                          <span className="ml-auto">
                            {submitted && isCorrect && <Check className="w-4 h-4" />}
                            {submitted && isWrong && <X className="w-4 h-4" />}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle badge="5 esercizi · 2 pt ciascuno">Parte B – Risposte brevi</SectionTitle>
            <div className="space-y-5">
              <div>
                <div className="font-medium mb-2">1. {parteB[0].prompt}</div>
                <input value={bAnswers.B1} onChange={(e) => setBAnswers({ ...bAnswers, B1: e.target.value })} placeholder="es. 8" className="w-full rounded-xl border px-3 py-2" />
              </div>
              <div>
                <div className="font-medium mb-2">2. {parteB[1].prompt}</div>
                <input value={bAnswers.B2} onChange={(e) => setBAnswers({ ...bAnswers, B2: e.target.value })} placeholder="es. 13" className="w-full rounded-xl border px-3 py-2" />
              </div>
              <div>
                <div className="font-medium mb-2">3. {parteB[2].prompt}</div>
                <input value={bAnswers.B3} onChange={(e) => setBAnswers({ ...bAnswers, B3: e.target.value })} placeholder="es. -1, 1, 3, 5" className="w-full rounded-xl border px-3 py-2" />
              </div>
              <div>
                <div className="font-medium mb-2">4. {parteB[3].prompt}</div>
                <input value={bAnswers.B4} onChange={(e) => setBAnswers({ ...bAnswers, B4: e.target.value })} placeholder="es. 4" className="w-full rounded-xl border px-3 py-2" />
              </div>
              <div>
                <div className="font-medium mb-2">5. {parteB[4].prompt}</div>
                <input value={bAnswers.B5} onChange={(e) => setBAnswers({ ...bAnswers, B5: e.target.value })} placeholder="es. x = (y + 4) / 3" className="w-full rounded-xl border px-3 py-2" />
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle badge="3 problemi · valutazione manuale">Parte C – Problemi di ragionamento</SectionTitle>
            <div className="space-y-5">
              {parteC.map((p, i) => (
                <div key={p.id}>
                  <div className="font-medium mb-2">{i + 1}. {p.title}</div>
                  <textarea
                    value={cAnswers[p.id]}
                    onChange={(e) => setCAnswers({ ...cAnswers, [p.id]: e.target.value })}
                    rows={5}
                    placeholder="Scrivi qui il procedimento (passaggi, formule, risultati)."
                    className="w-full rounded-xl border px-3 py-2"
                  />
                  <details className="mt-2 text-sm">
                    <summary className="cursor-pointer text-gray-700">Griglia di valutazione suggerita</summary>
                    <div className="mt-2 p-3 bg-gray-50 rounded-xl border text-gray-700">{p.rubric}</div>
                  </details>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-2 bg-black text-white">
              <Loader2 className="w-4 h-4 mr-1 opacity-70 animate-spin hidden" />
              Correggi automaticamente (A+B)
            </button>
            <button type="button" onClick={resetAll} className="inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-2">
              Reset
            </button>
          </div>

          <AnimatePresence>
            {submitted && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <Card className="bg-gray-50">
                  <div className="flex items-start gap-3">
                    <Trophy className="w-6 h-6 mt-1" />
                    <div>
                      <div className="font-semibold">Risultati automatici</div>
                      <div className="text-sm text-gray-700 mt-1">
                        Parte A: <b>{score.A} / 5</b> • Parte B: <b>{score.B} / 10</b> • Parte C: <b>da correggere</b>
                      </div>
                      <div className="mt-2 text-lg">Totale (senza C): <b>{score.total} / 15</b></div>
                      <p className="text-xs text-gray-600 mt-2">Nota: aggiungi fino a 5 punti dopo aver corretto la Parte C secondo la griglia.</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <Card className="mt-8">
          <SectionTitle>Condividi con la classe</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-700">
            <li>Avvia in modalità sviluppo e condividi l'URL locale in aula (stessa rete).</li>
            <li>Gli studenti compilano e premono <i>Correggi</i> per vedere il punteggio automatico.</li>
            <li>Per consegna, fai esportare/salvare la pagina o chiedi screenshot delle risposte aperte.</li>
          </ol>
        </Card>
      </div>
    </div>
  );
}

"use client";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import Hadiith from "@/components/Hadiith";
export default function Home() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");
const [question, setQuestion] = useState("");
const [answer, setAnswer] = useState("");
async function askQuestion() {
  if (!question) return;

  setLoading(true);

  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
      }),
    });

    const data = await response.json();

    setAnswer(data.answer);
  } catch (error) {
    console.error(error);
  }

  setLoading(false);
}
  async function joinWaitlist() {
  if (!email) return;

  setLoading(true);

  const { error } = await supabase.from("waitlist").insert([
    {
      email,
    },
  ]);

  if (error) {
  if (error.code === "23505") {
    setMessage("Diese E-Mail ist bereits auf der Warteliste.");
  } else {
    setMessage("Etwas ist schiefgelaufen. Bitte versuche es erneut.");
  }
} else {
  setMessage("Willkommen bei nooryAI 🚀 Du bist auf der Warteliste.");
  setEmail("");
}
  

  setLoading(false);
}
  const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

console.log("Supabase verbunden:", supabase);
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07130f] text-white flex flex-col items-center justify-center px-6">

   <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.25),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.22),transparent_30%)]" />
      <nav className="absolute top-0 left-0 w-full flex items-center justify-between px-8 py-6">
  <div className="flex items-center gap-3">
    <img
  src="/nooryAI-logo.svg"
  alt="Noory.ai Logo"
  className="h-12 w-auto"
/>

    
  </div>

  <div className="hidden md:flex items-center gap-8 text-gray-300">
    <a href="#" className="hover:text-amber-300 transition">
      Vision
    </a>

    <a href="#" className="hover:text-amber-300 transition">
      Features
    </a>

    <a href="#" className="hover:text-amber-300 transition">
      Contact
    </a>
  </div>
</nav>
      <div className="relative z-10 max-w-4xl text-center">
        <p className="mb-6 text-amber-300 font-medium tracking-[0.2em] uppercase">
          Quellenbasierte islamische AI
        </p>

        <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
          nooryAI
        </h1>

        <p className="mt-8 text-xl leading-8 text-gray-300">
          Islamisches Wissen mit Quellen, Kontext und Verantwortung.
        </p>

        <p className="mt-4 text-lg text-gray-400">
          Quraan, <Hadiith />, Tafsiir und Fiqh intelligent durchsuchen —
          mit nachvollziehbaren Quellen statt Halluzinationen.
        </p>
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.06] p-3 shadow-2xl shadow-black/20 backdrop-blur-xl">
  <div className="flex flex-col gap-3 sm:flex-row">
  <input
    type="text"
    value={question}
    onChange={(e) => setQuestion(e.target.value)}
    placeholder="Frage etwas über den Quran, Hadithe oder Fiqh..."
    className="flex-1 rounded-xl bg-black/40 px-5 py-4 text-white outline-none"
  />

  <button
    onClick={askQuestion}
    disabled={loading}
    className="rounded-xl bg-amber-300 px-6 py-4 font-semibold text-black"
  >
    {loading ? "Denkt nach..." : "Fragen"}
  </button>
</div>
<div className="mx-auto mt-6 max-w-2xl rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-left">
  <div className="flex items-center gap-2">
    <div className="h-3 w-3 rounded-full bg-emerald-400" />
    <p className="text-sm text-emerald-300">
      Demo-Antwort
      
    </p>
  </div>

  <p className="mt-5 text-gray-200 leading-8">
  {answer || "Stelle eine Frage über den Quraan, Hadiithe oder Fiqh."}
</p>
</div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="rounded-full bg-amber-300 px-8 py-4 text-black font-semibold transition duration-300 hover:-translate-y-1 hover:bg-amber-200">
            Warteliste beitreten
          </button>

          <button className="rounded-full border border-white/20 px-8 py-4 text-white transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:text-amber-200">
            Mehr erfahren
          </button>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:-translate-y-1 hover:border-amber-300/40 hover:bg-white/10">
    <h3 className="font-semibold text-amber-300">Quellenbasiert</h3>
    <p className="mt-2 text-sm text-gray-400">
      Antworten mit nachvollziehbaren Referenzen statt erfundener Aussagen.
    </p>
  </div>

  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:-translate-y-1 hover:border-amber-300/40 hover:bg-white/10">
    <h3 className="font-semibold text-amber-300">Mehrsprachig</h3>
    <p className="mt-2 text-sm text-gray-400">
      Arabisch, Deutsch, Englisch, Türkisch, Bosnisch und mehr.
    </p>
  </div>

  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:-translate-y-1 hover:border-amber-300/40 hover:bg-white/10">
    <h3 className="font-semibold text-amber-300">Kein Mufti-Ersatz</h3>
    <p className="mt-2 text-sm text-gray-400">
      nooryAI hilft bei Recherche und Lernen, ersetzt aber keine Gelehrten.
    </p>
  </div>
</div>
      </div>
      </div>
      <footer className="relative z-10 mt-24 pb-10 text-center text-sm text-gray-500">
  <p>© 2026 nooryAI.com</p>

  <p className="mt-2">
    Quellenbasierte islamische Recherche mit Verantwortung.
  </p>
</footer>
<div className="mx-auto mt-20 max-w-2xl text-center">
<h3 className="mb-4 text-2xl font-semibold text-white">
  Frühzugang erhalten
</h3>

<p className="mb-6 text-white/60">
  Trage dich in die Warteliste ein und erhalte frühen Zugang zu nooryAI.
</p>
<input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Deine E-Mail Adresse"
  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none"
/>
<button
  onClick={joinWaitlist}
  disabled={loading}
  className="rounded-xl bg-amber-300 px-6 py-4 font-semibold text-black"
>
  {loading ? "Speichert..." : "Warteliste beitreten"}
</button>
    </div>
    </main>
  );
}
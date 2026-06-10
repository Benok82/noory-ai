import OpenAI from "openai";
import { terminology } from "@/lib/noory-terminology";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
function applyTerminology(text: string) {
  let result = text;

  for (const [wrong, correct] of Object.entries(terminology)) {
    result = result.replaceAll(wrong, correct);
  }

  return result;
}

const systemPrompt = [
  "Du bist nooryAI, ein islamischer Assistent für deutschsprachige Muslime.",
  "",
  "Schreibstil:",
  "- Antworte auf Deutsch.",
  "- Verwende islamologische Terminologie.",
  "- Schreibe respektvoll, sachlich und vorsichtig.",
  "- Schreibe nicht wie ein allgemeines Lexikon, sondern wie ein islamwissenschaftlicher Lernassistent.",
  "",
  "Bevorzugte Begriffe:",
  "- Quraan statt Koran",
  "- Hadiith statt Hadith",
  "- Aayah statt Vers",
  "- Suurah statt Kapitel",
  "- Zakaah statt Almosen oder Almosensteuer",
  "- Salaah statt Gebet, wenn das rituelle Gebet gemeint ist",
  "- Siyaam statt Fasten, wenn das rituelle Fasten gemeint ist",
  "- Scharii'ah statt Scharia",
  "- Fiqh statt islamisches Recht",
  "- Fatwa statt Rechtsgutachten",
  "- Fiqh-Schule statt Rechtsschule",
  "- Iimaan statt Glauben, wenn der islamische Fachbegriff gemeint ist",
  "- Mu'min statt Gläubiger, wenn der islamische Fachbegriff gemeint ist",
  "- Kaafir statt Ungläubiger, wenn der islamische Fachbegriff gemeint ist",
  "- Ummah statt Glaubensgemeinschaft",
  "- Schahaadah statt Glaubensbekenntnis",
  "- Du'aa statt Bittgebet",
  "- Masdschid statt Moschee, wenn passend",
  "- ALLAAH statt Allah",
  "",
  "Wichtige Regeln:",
  "- Erfinde niemals Quraan-Aayaat, Hadiithe oder Gelehrtenaussagen.",
  "- Wenn du keine sichere Quelle kennst, sage: Dazu habe ich keine verifizierte Quelle.",
  "- Gib Quellen nur an, wenn du dir sicher bist.",
  "- Bei Fatwa-Fragen sage, dass nooryAI keinen qualifizierten Gelehrten ersetzt.",
  "- Vermeide problematische Begriffe wie Almosen, Koran, islamisches Gesetz und islamisches Recht, außer du erklärst, warum sie ungenau sind.",
].join("\n");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const question = body.question;

    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return Response.json(
        { error: "Bitte gib eine Frage ein." },
        { status: 400 }
      );
    }

    if (question.length > 1000) {
      return Response.json(
        { error: "Die Frage ist zu lang. Bitte kürzer formulieren." },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_completion_tokens: 500,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: question,
        },
      ],
    });

    const rawAnswer = completion.choices[0].message.content || "";
const correctedAnswer = applyTerminology(rawAnswer);

return Response.json({
  answer: correctedAnswer,
});
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Etwas ist schiefgelaufen.",
      },
      {
        status: 500,
      }
    );
  }
}
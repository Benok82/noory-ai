import OpenAI from "openai";
import { quraanVerses } from "@/data/quraan";
import { hadiithCollection } from "@/data/hadiith";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function findQuraanSources(question: string) {
  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.includes("zakaah") || lowerQuestion.includes("zakat")) {
    return quraanVerses.zakaah;
  }

  if (lowerQuestion.includes("ribaa") || lowerQuestion.includes("riba")) {
    return quraanVerses.ribaa;
  }

  if (lowerQuestion.includes("siyaam") || lowerQuestion.includes("fasten")) {
    return quraanVerses.siyaam;
  }

  if (lowerQuestion.includes("tawhiid")) {
    return quraanVerses.tawhiid;
  }

  if (lowerQuestion.includes("schirk")) {
    return quraanVerses.schirk;
  }

  if (lowerQuestion.includes("salaah") || lowerQuestion.includes("gebet")) {
    return quraanVerses.salaah;
  }

  if (
    lowerQuestion.includes("eltern") ||
    lowerQuestion.includes("mutter") ||
    lowerQuestion.includes("vater")
  ) {
    return quraanVerses.eltern;
  }

  return [];
}

function findHadiithSources(question: string) {
  const lowerQuestion = question.toLowerCase();
  const results = [];

  for (const value of Object.values(hadiithCollection)) {
    const hadiith = value[0];

    if (
      hadiith.keywords.some((keyword) =>
        lowerQuestion.includes(keyword.toLowerCase())
      )
    ) {
      results.push(...value);
    }
  }

  return results;
}

const systemPrompt = [
  "Du bist nooryAI, ein islamischer Assistent.",
  "",
  "Regeln:",
  "- Antworte auf Deutsch.",
  "- Verwende islamologische Terminologie.",
  "- Wenn bei einem Hadiith Arabisch und Transliteration vorhanden sind, gib beides aus.",
"- Zeige zuerst die Übersetzung, danach die Transliteration und danach den arabischen Text.",
"- Wenn Authentizität hinterlegt ist, nenne diese.",
"- Wenn Primärquellen hinterlegt sind, nenne diese ausdrücklich.",
  "- Erfinde niemals Quraan-Aayaat oder Hadiithe.",
  "- Wenn lokale Quellen vorhanden sind, verwende diese bevorzugt.",
  "- Wenn Wichtige Lehren vorhanden sind, gib sie unverändert als Liste aus.",
"- Wenn Praktische Anwendungen vorhanden sind, gib sie unverändert als Liste aus.",
  "- Verwende nur die lokalen Quraan- und Hadiith-Quellen, wenn sie vorhanden sind.",
"- Nenne keine zusätzlichen Hadiithe, Aayaat oder Quellen, die nicht im lokalen Quellenblock stehen.",
"- Wenn du mehr Kontext gibst, kennzeichne ihn als allgemeine Erklärung und nicht als Quelle.",
"- Unterscheide zwischen Primärquellen und Sekundärquellen.",
"- Bei Hadiithen sind Primärquellen (z.B. Sahih al-Buchari, Sahih Muslim) wichtiger als spätere Sammlungen.",
"- Wenn Primärquellen in der lokalen Datenbank hinterlegt sind, nenne diese ausdrücklich.",
"- Verwende bei Hadiith-Antworten immer dieses Format:",
"- 📚 Hadiith an-Nawawii Nr. X",
"- Thema:",
"- Übersetzung:",
"- Transliteration:",
"- Arabisch:",
"- Authentizität:",
"- Primärquellen:",
"- Erklärung:",
"- Wichtige Lehren:",
"- Praktische Anwendungen:",
"- Nenne verwendete Quellen am Ende der Antwort.",
].join("\n");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const question = body.question;

    if (!question || typeof question !== "string") {
      return Response.json(
        { error: "Bitte gib eine Frage ein." },
        { status: 400 }
      );
    }

    const quraanSources = findQuraanSources(question);
    const hadiithSources = findHadiithSources(question);

    const sourceText =
      quraanSources.length > 0
        ? quraanSources
            .map((source) => `${source.surah} ${source.ayah}: ${source.text}`)
            .join("\n")
        : "Keine Quraan-Quelle gefunden.";

    const hadiithText =
  hadiithSources.length > 0
    ? hadiithSources
        .map(
          (source) =>
            [
              `${source.collection} Nr. ${source.number}`,
              `Thema: ${source.topic}`,
              `Primärquellen: ${
                source.primarySources && source.primarySources.length > 0
                  ? source.primarySources.join(", ")
                  : "nicht hinterlegt"
              }`,
              source.authenticity
                ? `Authentizität: ${source.authenticity}`
                : "",
              source.arabic ? `Arabisch: ${source.arabic}` : "",
              source.transliteration
                ? `Transliteration: ${source.transliteration}`
                : "",
              source.translation
  ? `Übersetzung: ${source.translation}`
  : `Text: ${source.text}`,

source.explanation
  ? `Erklärung: ${source.explanation}`
  : "",

source.lessons
  ? `Wichtige Lehren: ${source.lessons.join(" | ")}`
  : "",

source.practicalApplications
  ? `Praktische Anwendungen: ${source.practicalApplications.join(" | ")}`
  : "",
            ]
              .filter(Boolean)
              .join("\n")
        )
        .join("\n\n")
    : "Keine Hadiith-Quelle gefunden.";

    const fullSystemPrompt = [
      systemPrompt,
      "",
      "Quraan-Quellen:",
      sourceText,
      "",
      "Hadiith-Quellen:",
      hadiithText,
    ].join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_completion_tokens: 500,
      messages: [
        {
          role: "system",
          content: fullSystemPrompt,
        },
        {
          role: "user",
          content: question,
        },
      ],
    });

    return Response.json({
      answer: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("ASK API ERROR:", error);

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
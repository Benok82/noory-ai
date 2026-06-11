import type { HadithEntry } from "./hadith-types";

export const hadithDatabase: HadithEntry[] = [
  {
    id: "bukhari-1",
    collection: "Sahih al-Buchari",
    book: "Beginn der Offenbarung",
    number: "1",
    reference: "Sahih al-Buchari 1",

    topic: "Niyyah",

    keywords: [
      "niyyah",
      "absicht",
      "absichten",
      "taten"
    ],

    translation:
      "Die Taten werden nur nach den Absichten beurteilt.",

    primarySources: ["Sahih al-Buchari"],

    authenticity: "Sahih",

    sourceUrl: "https://sunnah.com/bukhari:1",

    isCurated: false,
  },
];
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const question = body.question;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Du bist ein hilfreicher islamischer Assistent. Antworte vorsichtig, respektvoll und mit Quellenbezug.",
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
import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const PERSONAS: Record<string, string> = {
  stranger_cold: "Tu joues le rôle d'un inconnu froid et distant. Tu réponds brièvement, tu ne souris pas, tu n'aides pas spontanément. Tu es poli mais fermé.",
  stranger_warm: "Tu joues le rôle d'un inconnu chaleureux et ouvert. Tu es souriant, curieux, tu poses des questions et tu facilites la conversation.",
  colleague: "Tu joues le rôle d'un collègue de travail occupé. Tu es professionnel mais pressé. Tu peux être légèrement distrait.",
  boss: "Tu joues le rôle d'un patron exigeant. Tu es direct, tu attends des résultats clairs, tu n'aimes pas les hésitations.",
  friend: "Tu joues le rôle d'un ami proche. Tu es détendu, taquin, tu utilises l'argot parfois, tu connais bien l'utilisateur.",
  date: "Tu joues le rôle d'un(e) inconnu(e) lors d'un premier rendez-vous. Tu es curieux(se) mais légèrement nerveux(se). Tu observes comment l'autre se comporte.",
  shopkeeper: "Tu joues le rôle d'un commerçant occupé dans son magasin. Tu es neutre, attends que le client sache ce qu'il veut.",
  conflict: "Tu joues le rôle d'une personne en désaccord avec l'utilisateur. Tu maintiens ta position calmement mais fermement.",
};

const FEEDBACK_SYSTEM = `Après chaque réponse dans le scénario, ajoute une section FEEDBACK: entre crochets [FEEDBACK: ...] qui évalue en 1-2 phrases:
- La clarté et la confiance du message de l'utilisateur
- Un conseil concret pour s'améliorer
Exemple: [FEEDBACK: Bonne initiative pour briser la glace! Tu pourrais ajouter une question pour montrer ton intérêt.]`;

export async function POST(req: NextRequest) {
  try {
    const { messages, scenario, personaId, feedbackEnabled } = await req.json();

    const persona = PERSONAS[personaId] || PERSONAS.stranger_warm;

    const systemPrompt = `${persona}

Tu parles UNIQUEMENT en français. Reste dans le personnage tout au long de la conversation.
Tes réponses sont courtes et naturelles (2-4 phrases maximum), comme dans une vraie conversation.

Scénario: ${scenario}

${feedbackEnabled ? FEEDBACK_SYSTEM : ""}`;

    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 500,
      system: systemPrompt,
      messages: messages,
    });

    const content = response.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Unexpected response type" }, { status: 500 });
    }

    // Sépare la réponse du feedback
    const fullText = content.text;
    const feedbackMatch = fullText.match(/\[FEEDBACK:([\s\S]*?)\]/);
    const feedback = feedbackMatch ? feedbackMatch[1].trim() : null;
    const replyText = fullText.replace(/\[FEEDBACK:[\s\S]*?\]/, "").trim();

    return NextResponse.json({
      reply: replyText,
      feedback: feedback,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  personaId: string;
  personaName: string;
  emoji: string;
  difficulty: "facile" | "moyen" | "difficile";
  tips: string[];
}

export const SCENARIOS: Scenario[] = [
  {
    id: "icebreaker",
    title: "Briser la glace",
    description: "Tu croises quelqu'un dans un café ou une file d'attente. Lance la conversation.",
    personaId: "stranger_cold",
    personaName: "Inconnu(e) distant(e)",
    emoji: "☕",
    difficulty: "moyen",
    tips: [
      "Commence par une observation sur la situation",
      "Pose une question ouverte",
      "Souris et maintiens le contact visuel",
    ],
  },
  {
    id: "party",
    title: "Soirée entre inconnus",
    description: "Tu arrives à une fête où tu ne connais personne. Approche quelqu'un qui semble seul.",
    personaId: "stranger_warm",
    personaName: "Quelqu'un à la soirée",
    emoji: "🎉",
    difficulty: "facile",
    tips: [
      "Utilise l'environnement comme point de départ",
      "Présente-toi naturellement",
      "Trouve des points communs",
    ],
  },
  {
    id: "compliment",
    title: "Faire un compliment",
    description: "Tu veux complimenter quelqu'un sincèrement sans que ce soit gênant.",
    personaId: "stranger_warm",
    personaName: "La personne complimentée",
    emoji: "✨",
    difficulty: "facile",
    tips: [
      "Sois spécifique, pas générique",
      "Garde le contact visuel",
      "Ne t'attends pas à une réaction particulière",
    ],
  },
  {
    id: "date",
    title: "Premier rendez-vous",
    description: "Tu es à un premier rendez-vous. Crée une connexion authentique.",
    personaId: "date",
    personaName: "Ton rendez-vous",
    emoji: "💬",
    difficulty: "difficile",
    tips: [
      "Pose des questions sur ses passions",
      "Partage quelque chose de toi aussi",
      "Écoute vraiment les réponses",
    ],
  },
  {
    id: "conflict",
    title: "Gérer un désaccord",
    description: "Quelqu'un n'est pas d'accord avec toi. Défends ton point de vue calmement.",
    personaId: "conflict",
    personaName: "Personne en désaccord",
    emoji: "🤝",
    difficulty: "difficile",
    tips: [
      "Commence par reconnaître son point de vue",
      "Utilise 'je pense que' plutôt que 'tu as tort'",
      "Reste calme et posé",
    ],
  },
  {
    id: "shopkeeper",
    title: "Interaction quotidienne",
    description: "Tu entres dans un magasin pour demander conseil ou négocier.",
    personaId: "shopkeeper",
    personaName: "Commerçant",
    emoji: "🛒",
    difficulty: "facile",
    tips: [
      "Sois direct sur ce que tu cherches",
      "Pose des questions précises",
      "Remercie et sois agréable",
    ],
  },
  {
    id: "networking",
    title: "Networking professionnel",
    description: "Tu rencontres quelqu'un dans ton domaine. Crée une connexion professionnelle.",
    personaId: "colleague",
    personaName: "Professionnel du secteur",
    emoji: "💼",
    difficulty: "moyen",
    tips: [
      "Présente-toi avec ton rôle clairement",
      "Montre ton intérêt pour leur travail",
      "Propose une suite concrète",
    ],
  },
  {
    id: "say_no",
    title: "Dire non poliment",
    description: "Quelqu'un te demande quelque chose que tu ne veux pas faire. Refuse sans blesser.",
    personaId: "friend",
    personaName: "Un ami",
    emoji: "🚫",
    difficulty: "moyen",
    tips: [
      "Sois direct mais doux",
      "Tu n'as pas besoin de te justifier longuement",
      "Propose une alternative si possible",
    ],
  },
];

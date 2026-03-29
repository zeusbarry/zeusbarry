"use client";

interface SpeakButtonProps {
  text: string;
}

export default function SpeakButton({ text }: SpeakButtonProps) {
  const speak = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={speak}
      className="p-1.5 text-gray-400 hover:text-indigo-500 transition-colors"
      title="Écouter"
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
      </svg>
    </button>
  );
}

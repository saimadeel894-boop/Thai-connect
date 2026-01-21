"use client";

interface ChatBotButtonProps {
  onClick: () => void;
}

export default function ChatBotButton({ onClick }: ChatBotButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-2xl transition hover:scale-110 hover:shadow-red-500/50"
      aria-label="Open chat support"
    >
      <span className="text-2xl">💬</span>
    </button>
  );
}

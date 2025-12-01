// Minimal stub for a future React/TSX UI. Not included in npm package.
// Replace with your framework (React/Vue/Svelte) as needed.

export type ChatMessage = { role: "user" | "assistant"; content: string };

export interface ChatBoxProps {
  messages: ChatMessage[];
  sending: boolean;
  onSend: (text: string) => void;
  onStop?: () => void;
}

// Placeholder component signature; implement per your UI stack.
export function ChatBox(_props: ChatBoxProps) {
  return null;
}

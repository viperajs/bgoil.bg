"use client"

import { cn } from "@/lib/utils"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-gradient-primary text-white rounded-br-md"
            : "bg-muted/80 text-foreground rounded-bl-md border border-border/50"
        )}
      >
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
        <div
          className={cn(
            "text-[10px] mt-1 opacity-60",
            isUser ? "text-right" : "text-left"
          )}
          suppressHydrationWarning
        >
          {message.timestamp.toLocaleTimeString("bg-BG", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  )
}

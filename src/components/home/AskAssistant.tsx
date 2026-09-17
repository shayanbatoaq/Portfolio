"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useReducedMotion } from "motion/react";
import { X, ArrowUpRight, Send, Sparkles } from "lucide-react";
import { contact } from "@/data/shayan/contact";
import { emitSceneReaction } from "@/lib/three/sceneEvents";
import {
  getPersistedConversationMessages,
  initializeConversationLogging,
  isChatLoggingMetadata,
  prepareConversationMessage,
  recordSuccessfulConversation,
} from "@/lib/conversations/session";


interface Message {
  role: "user" | "ai";
  text: string;
}

const SUGGESTED_QUESTIONS = [
  "What did Shayan build in LapSignal?",
  "What is Shayan's strongest technical work?",
  "What technologies does Shayan use?",
  "What experience does Shayan have with applied AI?",
  "Tell me about Shayan's work at Patricians.",
];

const CHAT_UNAVAILABLE_MESSAGE =
  "I could not respond just now. Please try again in a moment.";
const CHAT_RATE_LIMIT_MESSAGE =
  "Too many requests were sent in a short period. Please wait briefly and try again.";

const CONTACT_LINKS = {
  email: {
    label: "Email",
    href: `mailto:${contact.email}`,
  },
  linkedin: {
    label: "LinkedIn",
    href: contact.linkedIn,
  },
  instagram: {
    label: "Instagram",
    href: contact.instagram,
  },
} as const;

type ContactLinkKey = keyof typeof CONTACT_LINKS;

function tokenizeContactLinks(text: string) {
  return text
    .replace(
      /\[[^\]]+\]\(\s*mailto:hello@shayan\.patricians\.pk\s*\)|mailto:hello@shayan\.patricians\.pk|hello@shayan\.patricians\.pk/gi,
      "{{contact:email}}"
    )
    .replace(
      /\[[^\]]+\]\(\s*https?:\/\/(?:www\.)?linkedin\.com\/in\/shayan-batoaq-379a42246\/?\s*\)|(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/shayan-batoaq-379a42246\/?/gi,
      "{{contact:linkedin}}"
    )
    .replace(
      /\[[^\]]+\]\(\s*https?:\/\/(?:www\.)?instagram\.com\/shayanbatoaq\/?\s*\)|(?:https?:\/\/)?(?:www\.)?instagram\.com\/shayanbatoaq\/?|@shayanbatoaq/gi,
      "{{contact:instagram}}"
    );
}

function ChatMessageText({ text }: { text: string }) {
  const parts = tokenizeContactLinks(text).split(
    /(\{\{contact:(?:email|linkedin|instagram)\}\})/g
  );

  return (
    <span className="whitespace-pre-wrap">
      {parts.map((part, index) => {
        const match = part.match(/^\{\{contact:(email|linkedin|instagram)\}\}$/);
        if (!match) return part;

        const key = match[1] as ContactLinkKey;
        const link = CONTACT_LINKS[key];
        const isExternal = key !== "email";

        return (
          <a
            key={`${key}-${index}`}
            href={link.href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-1 font-semibold text-[#78b7ff] underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
          >
            {link.label}
            <ArrowUpRight size={12} aria-hidden="true" />
          </a>
        );
      })}
    </span>
  );
}

export function AskModal({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [messages, setMessages] = useState<Message[]>(() =>
    getPersistedConversationMessages(),
  );
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }, [messages, typing, reduceMotion]);

  useEffect(() => {
    dialogRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab") return;
      const controls = dialogRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex="0"]');
      if (!controls?.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  useEffect(() => {
    return () => requestRef.current?.abort();
  }, []);

  useEffect(() => initializeConversationLogging(), []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || typing) return;
      emitSceneReaction("message-submit", 1);
      const prepared = prepareConversationMessage(text);
      const nextMessages = prepared.messages;

      setMessages(nextMessages);
      setInput("");
      setTyping(true);

      const controller = new AbortController();
      requestRef.current = controller;

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            messages: prepared.requestMessages,
            sessionId: prepared.sessionId,
            exchangeId: prepared.exchangeId,
            startedAt: prepared.startedAt,
          }),
        });
        const payload: unknown = await response.json().catch(() => null);
        const reply =
          payload &&
          typeof payload === "object" &&
          "message" in payload &&
          typeof payload.message === "string"
            ? payload.message.trim()
            : null;
        const logging =
          payload &&
          typeof payload === "object" &&
          "logging" in payload &&
          isChatLoggingMetadata(payload.logging)
            ? payload.logging
            : null;

        if (!response.ok) {
          setMessages((current) => [
            ...current,
            {
              role: "ai",
              text:
                response.status === 429
                  ? CHAT_RATE_LIMIT_MESSAGE
                  : CHAT_UNAVAILABLE_MESSAGE,
            },
          ]);
          return;
        }

        if (!reply || !logging) {
          throw new Error("Chat request failed");
        }

        setMessages((current) => [
          ...current,
          { role: "ai", text: reply },
        ]);
        recordSuccessfulConversation(prepared, reply, logging);
        if (reply.length > 280) {
          emitSceneReaction("chat-reading", 1);
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;

        setMessages((current) => [
          ...current,
          { role: "ai", text: CHAT_UNAVAILABLE_MESSAGE },
        ]);
      } finally {
        if (requestRef.current === controller) requestRef.current = null;
        setTyping(false);
      }
    },
    [typing],
  );

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="assistant-title"
      className="fixed inset-0 z-[100] flex flex-col"
      style={{
        background: "rgba(5,5,14,0.9)",
        backdropFilter: "blur(18px)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 sm:px-10 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div>
          <h2
            id="assistant-title"
            className="text-2xl sm:text-[28px] font-semibold leading-none text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ask Me
          </h2>
          <p
            className="mt-2 text-[10px] sm:text-[11px] tracking-[0.22em] text-white/38 uppercase"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Portfolio AI assistant · Background &amp; work
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
            color: "rgba(255,255,255,0.4)",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)")
          }
          aria-label="Close"
        >
          <X size={15} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-8">
        <div className="max-w-2xl mx-auto">
          {messages.length === 0 ? (
            <div>
              <div className="text-center pt-10 pb-12">
                <div
                  className="w-14 h-14 rounded-2xl border border-white/8 flex items-center justify-center mx-auto mb-7"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(30,144,255,0.14), rgba(138,43,226,0.14))",
                  }}
                >
                  <Sparkles size={20} className="text-white/40" />
                </div>
                <h3
                  className="text-xl font-semibold text-white/80 mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Hello. Ask me anything about my work.
                </h3>
                <p
                  className="text-sm text-white/30 max-w-xs mx-auto leading-[1.7]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Ask about LapSignal, my engineering work, applied-AI experience or Patricians.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="p-5 text-left rounded-2xl group transition-all duration-300"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(255,255,255,0.12)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(255,255,255,0.06)")
                    }
                  >
                    <span
                      className="block text-sm text-white/52 group-hover:text-white/80 transition-colors duration-200 mb-1.5"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {q}
                    </span>
                    <span
                      className="text-[10px] text-white/18 group-hover:text-white/30 transition-colors"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Tap to ask →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5 pb-4" role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions text">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-end gap-2.5`}
                >
                  {msg.role === "ai" && (
                    <div
                      className="w-6 h-6 rounded-lg border border-white/8 flex items-center justify-center flex-shrink-0 mb-0.5"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(30,144,255,0.18), rgba(138,43,226,0.18))",
                      }}
                    >
                      <Sparkles size={10} className="text-white/45" />
                    </div>
                  )}
                  <div
                    className="max-w-[78%] px-5 py-3.5 rounded-2xl text-sm leading-[1.7]"
                    style={{
                      background:
                        msg.role === "user"
                          ? "linear-gradient(135deg, rgba(30,144,255,0.18), rgba(79,123,255,0.18))"
                          : "rgba(255,255,255,0.04)",
                      border:
                        msg.role === "user"
                          ? "1px solid rgba(30,144,255,0.18)"
                          : "1px solid rgba(255,255,255,0.06)",
                      color:
                        msg.role === "user"
                          ? "rgba(255,255,255,0.85)"
                          : "rgba(255,255,255,0.58)",
                      borderRadius:
                        msg.role === "user"
                          ? "1rem 1rem 0.25rem 1rem"
                          : "1rem 1rem 1rem 0.25rem",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {msg.role === "ai" ? (
                      <ChatMessageText text={msg.text} />
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start items-end gap-2.5" role="status" aria-label="Preparing a response">
                  <div
                    className="w-6 h-6 rounded-lg border border-white/8 flex items-center justify-center flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(30,144,255,0.18), rgba(138,43,226,0.18))",
                    }}
                  >
                    <Sparkles size={10} className="text-white/45" />
                  </div>
                  <div
                    className="px-5 py-4 rounded-2xl"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: "1rem 1rem 1rem 0.25rem",
                    }}
                  >
                    <div className="flex gap-1.5 items-center">
                      {[0, 1, 2].map((j) => (
                        <div
                          key={j}
                          className="w-1.5 h-1.5 rounded-full bg-white/28 animate-pulse"
                          style={{ animationDelay: `${j * 160}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div
        className="px-6 sm:px-10 py-5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex gap-3"
          >
            <input
              type="text"
              aria-label="Ask about Shayan's work"
              maxLength={2000}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="min-w-0 flex-1 px-5 py-3.5 rounded-xl text-sm transition-colors duration-200 focus:outline-none"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.75)",
                fontFamily: "var(--font-body)",
              }}
              onFocus={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(30,144,255,0.3)")
              }
              onBlur={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(255,255,255,0.08)")
              }
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={!input.trim() || typing}
              className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-25"
              style={{
                background: "linear-gradient(135deg, #1E90FF, #6A5ACD)",
              }}
            >
              <Send size={15} className="text-white" />
            </button>
          </form>
          <p
            className="text-[10px] text-white/14 text-center mt-3"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Responses use approved portfolio information. For direct enquiries, reach out by email.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Floating Ask button ───────────────────────────────────────────────────────

export function AskButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-6 sm:right-8 z-40 flex items-center gap-2.5 px-5 py-3.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95"
      style={{
        background:
          "linear-gradient(135deg, rgba(30,144,255,0.88), rgba(106,10,173,0.88))",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 8px 36px rgba(30,144,255,0.22), 0 4px 14px rgba(0,0,0,0.45)",
        fontFamily: "var(--font-body)",
      }}
    >
      <Sparkles size={14} />
      Ask Me
    </button>
  );
}

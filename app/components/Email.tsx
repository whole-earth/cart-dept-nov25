"use client";

import { useState, useRef, useEffect } from "react";

interface EmailStepProps {
  onSubmit: (email: string) => void;
  showOverlay: boolean;
  onOverlayChange: (show: boolean) => void;
}

export default function EmailStep({ onSubmit, showOverlay, onOverlayChange }: EmailStepProps) {
  const [email, setEmail] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const showSubmitArrow = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFocused) {
        inputRef.current?.blur();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isFocused]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onSubmit(email);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative my-8 flex w-full items-center rounded-lg border-2 border-border bg-muted px-4 py-8"
      autoComplete="off"
    >
      <input
        ref={inputRef}
        type="email"
        id="email-input"
        name="email"
        autoComplete="email"
        required
        placeholder={showOverlay ? "" : "Email"}
        className="min-w-0 flex-1 border-none bg-transparent py-0 text-[36px] font-medium outline-none placeholder:text-muted-foreground font-[Manrope,sans-serif]"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onFocus={() => {
          onOverlayChange(false);
          setIsFocused(true);
        }}
        onBlur={() => {
          if (!email) onOverlayChange(true);
          setIsFocused(false);
        }}
        aria-label="Email address"
      />

      <div className="ml-2 flex items-center">
        {showSubmitArrow && (
          <button
            type="submit"
            className="animate-arrow-fade-in rounded-lg border-2 border-transparent p-1 text-white/80 transition-opacity duration-150 hover:opacity-100"
            aria-label="Submit"
          >
            <svg width="36" height="36" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" stroke="#fff" strokeWidth="14">
              <g>
                <path d="M96,212a4,4,0,0,1-2.82861-6.82837L170.34326,128,93.17139,50.82837a4.00009,4.00009,0,0,1,5.65722-5.65674l80,80a4,4,0,0,1,0,5.65674l-80,80A3.98805,3.98805,0,0,1,96,212Z"></path>
              </g>
            </svg>
          </button>
        )}
      </div>

      {showOverlay && !email && (
        <div
          className="pointer-events-none absolute left-0 top-0 flex h-full w-full select-none flex-col items-start justify-center px-4"
          style={{ zIndex: 2 }}
        >
          <div className="absolute left-4 top-2 text-[14px]">Almost there!</div>
          <div className="absolute left-4 top-1/2 flex -translate-y-1/2 items-center text-[36px] font-medium" style={{ width: "96px" }}>
            Email
            <span
              className="animate-blink inline-block align-middle"
              style={{ height: "45px", width: "2px", background: "#ccd4d8", marginLeft: "2px", verticalAlign: "middle" }}
            ></span>
          </div>
          <div className="absolute bottom-2 left-4 text-[14px]">Enter your email to complete registration.</div>
        </div>
      )}

      <style jsx>{`
        @keyframes blink {
          to {
            visibility: hidden;
          }
        }
        .animate-blink {
          animation: blink 1.4s steps(2, start) infinite;
        }

        @keyframes arrow-fade-in {
          0% {
            opacity: 0;
            transform: translateX(-10px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-arrow-fade-in {
          animation: arrow-fade-in 0.3s ease-out;
        }
      `}</style>
    </form>
  );
}

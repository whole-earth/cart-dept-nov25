"use client";

import { useState } from "react";
import EmailStep from "./Email";

export default function ReserveName() {
  const [showOverlay, setShowOverlay] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const handleEmailSubmit = (email: string) => {
    if (!email) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="w-full rounded-2xl border border-white/20 bg-white/5 p-8 text-center text-lg text-white/80">
        Thanks! This form isn&apos;t connected to anything yet.
      </div>
    );
  }

  return (
    <div className="w-full">
      <EmailStep
        onSubmit={handleEmailSubmit}
        showOverlay={showOverlay}
        onOverlayChange={setShowOverlay}
      />
    </div>
  );
}

'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useReducedMotion } from "@/lib/useReducedMotion";

import {
  AUTH_STEP_INTERVAL,
  AUTH_STEPS,
  BOOT_LINE_INTERVAL,
  BOOT_LOG_LINES,
  GRANTED_DELAY,
  REDUCED_FLOW_DELAY,
  REDUCED_LOG_LINES,
} from "./bootConfig";
import { BootScreen } from "./BootScreen";
import { LoginScreen } from "./LoginScreen";

type Phase = "boot" | "auth" | "granted";

const DASHBOARD_ROUTE = "/dash";

type BootExperienceInnerProps = {
  prefersReducedMotion: boolean;
};

function BootExperienceInner({ prefersReducedMotion }: BootExperienceInnerProps) {
  const router = useRouter();
  const currentLines = prefersReducedMotion ? REDUCED_LOG_LINES : BOOT_LOG_LINES;
  const [phase, setPhase] = useState<Phase>("boot");
  const [visibleCount, setVisibleCount] = useState(() =>
    prefersReducedMotion ? currentLines.length : 1,
  );
  const [authStepIndex, setAuthStepIndex] = useState(0);
  const [isGranted, setIsGranted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const cleanupRef = useRef<Array<() => void>>([]);

  const safeVisibleCount = useMemo(
    () => Math.min(visibleCount, currentLines.length),
    [visibleCount, currentLines.length],
  );

  const registerCleanup = useCallback((cleanup: () => void) => {
    cleanupRef.current.push(cleanup);
  }, []);

  const clearTimers = useCallback(() => {
    cleanupRef.current.forEach((cleanup) => cleanup());
    cleanupRef.current = [];
  }, []);

  const pushToDashboard = useCallback(() => {
    router.push(DASHBOARD_ROUTE);
  }, [router]);

  const handleSkip = useCallback(() => {
    clearTimers();
    pushToDashboard();
  }, [clearTimers, pushToDashboard]);

  const startAuthPhase = useCallback(() => {
    setPhase("auth");
    setAuthStepIndex(0);
    setIsGranted(false);

    const intervalId = window.setInterval(() => {
      setAuthStepIndex((previous) => {
        if (previous >= AUTH_STEPS.length - 1) {
          return previous;
        }

        const next = previous + 1;

        if (next === AUTH_STEPS.length - 1) {
          window.clearInterval(intervalId);
          setIsGranted(true);
          setPhase("granted");

          const grantedTimeout = window.setTimeout(() => {
            pushToDashboard();
          }, GRANTED_DELAY);

          registerCleanup(() => window.clearTimeout(grantedTimeout));
        }

        return next;
      });
    }, AUTH_STEP_INTERVAL);

    registerCleanup(() => window.clearInterval(intervalId));
  }, [pushToDashboard, registerCleanup]);

  useEffect(() => {
    const idTimeout = window.setTimeout(() => {
      setSessionId(generateSessionId());
    }, 0);

    clearTimers();
    if (prefersReducedMotion) {
      const reducedTimeout = window.setTimeout(() => {
        pushToDashboard();
      }, REDUCED_FLOW_DELAY);

      registerCleanup(() => window.clearTimeout(reducedTimeout));
      return () => clearTimers();
    }

    const bootInterval = window.setInterval(() => {
      setVisibleCount((previous) => {
        if (previous >= BOOT_LOG_LINES.length) {
          return previous;
        }

        const next = previous + 1;

        if (next === BOOT_LOG_LINES.length) {
          window.clearInterval(bootInterval);
          startAuthPhase();
        }

        return next;
      });
    }, BOOT_LINE_INTERVAL);

    registerCleanup(() => window.clearInterval(bootInterval));

    return () => {
      clearTimers();
      window.clearTimeout(idTimeout);
    };
  }, [
    prefersReducedMotion,
    registerCleanup,
    clearTimers,
    pushToDashboard,
    startAuthPhase,
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleSkip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSkip]);

  const isBootPhase = phase === "boot";

  return (
    <div className="relative min-h-screen bg-zinc-950 text-green-100">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-15 mix-blend-screen"
        style={{
          backgroundImage:
            "linear-gradient(rgba(244,244,244,0.06) 50%, rgba(0,0,0,0) 50%)",
          backgroundSize: "100% 3px",
        }}
      />

      {isBootPhase ? (
        <BootScreen
          lines={currentLines}
          visibleCount={safeVisibleCount}
          sessionId={sessionId}
          onSkip={handleSkip}
        />
      ) : (
        <LoginScreen
          sessionId={sessionId}
          stepIndex={authStepIndex}
          isGranted={isGranted}
          onSkip={handleSkip}
        />
      )}
    </div>
  );
}

function generateSessionId() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const length = Math.floor(Math.random() * 5) + 8; // 8 - 12 chars
  let id = "";

  for (let i = 0; i < length; i += 1) {
    id += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return id;
}

export default function BootExperience() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <BootExperienceInner
      key={prefersReducedMotion ? "reduced" : "full"}
      prefersReducedMotion={prefersReducedMotion}
    />
  );
}

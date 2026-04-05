import { useEffect, useRef, useCallback } from 'react';

const JITTER_GUARD_MS = 120; // ignore target switches shorter than this

export function useDwell(gazeRef, dwellTime = 500, onDwell, onProgress, isActive = true) {
  const dwellTarget = useRef(null);
  const dwellStart = useRef(null);
  const animFrameRef = useRef(null);

  // Jitter guard: track when the candidate changed to a new target
  const pendingTarget = useRef(null);
  const pendingStart = useRef(null);

  // Clear dwell state when isActive changes
  useEffect(() => {
    if (dwellTarget.current) {
      if (onProgress) onProgress(dwellTarget.current, 0);
      dwellTarget.current = null;
      dwellStart.current = null;
    }
    pendingTarget.current = null;
    pendingStart.current = null;
  }, [isActive, onProgress]);

  const checkDwell = useCallback(() => {
    if (!isActive) {
      animFrameRef.current = requestAnimationFrame(checkDwell);
      return;
    }

    const gaze = gazeRef.current;
    if (!gaze || (gaze.x === 0 && gaze.y === 0)) {
      animFrameRef.current = requestAnimationFrame(checkDwell);
      return;
    }

    const elements = document.querySelectorAll('[data-dwell]');
    let bestHit = null;
    let minDistance = Infinity;

    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const margin = 40; // generous hit boundary
      if (
        gaze.x >= rect.left - margin &&
        gaze.x <= rect.right + margin &&
        gaze.y >= rect.top - margin &&
        gaze.y <= rect.bottom + margin
      ) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.hypot(gaze.x - centerX, gaze.y - centerY);
        if (distance < minDistance) {
          minDistance = distance;
          bestHit = el.getAttribute('data-dwell');
        }
      }
    });

    const hit = bestHit;

    if (hit) {
      // ── Jitter guard ──────────────────────────────────────
      // If this is a different target than what we're committed to dwelling on,
      // hold it in "pending" for JITTER_GUARD_MS before we commit.
      if (hit !== dwellTarget.current) {
        if (pendingTarget.current !== hit) {
          // New candidate — start the guard timer
          pendingTarget.current = hit;
          pendingStart.current = Date.now();
        } else if (Date.now() - pendingStart.current >= JITTER_GUARD_MS) {
          // Candidate has been stable long enough — commit it
          if (dwellTarget.current && onProgress) onProgress(dwellTarget.current, 0);
          dwellTarget.current = hit;
          dwellStart.current = Date.now();
          if (onProgress) onProgress(hit, 0);
          pendingTarget.current = null;
          pendingStart.current = null;
        }
        // While waiting for jitter guard, keep old dwell progress alive
        animFrameRef.current = requestAnimationFrame(checkDwell);
        return;
      }

      // ── Committed target ───────────────────────────────────
      pendingTarget.current = null;
      pendingStart.current = null;

      const elapsed = Date.now() - dwellStart.current;
      const progress = Math.min(100, Math.floor((elapsed / dwellTime) * 100));

      if (onProgress) onProgress(hit, progress);

      if (elapsed >= dwellTime) {
        onDwell(hit);
        dwellTarget.current = null;
        dwellStart.current = null;
        if (onProgress) onProgress(hit, 0);
      }
    } else {
      // No element under gaze
      pendingTarget.current = null;
      pendingStart.current = null;
      if (dwellTarget.current) {
        if (onProgress) onProgress(dwellTarget.current, 0);
        dwellTarget.current = null;
        dwellStart.current = null;
      }
    }

    animFrameRef.current = requestAnimationFrame(checkDwell);
  }, [gazeRef, dwellTime, onDwell, onProgress, isActive]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(checkDwell);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [checkDwell]);
}

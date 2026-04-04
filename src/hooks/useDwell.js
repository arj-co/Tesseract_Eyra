import { useEffect, useRef, useCallback } from 'react';

export function useDwell(gazeRef, dwellTime = 500, onDwell, onProgress, isActive = true) {
  const dwellTarget = useRef(null);
  const dwellStart = useRef(null);
  const animFrameRef = useRef(null);

  // Clear dwell state when isActive changes (e.g. calibration completes)
  useEffect(() => {
    if (dwellTarget.current) {
      if (onProgress) onProgress(dwellTarget.current, 0);
      dwellTarget.current = null;
      dwellStart.current = null;
    }
  }, [isActive, onProgress]);

  const checkDwell = useCallback(() => {
    if (!isActive) {
      // Still need to keep the loop alive if we want it to pick up immediately,
      // but we skip all hit detection logic
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
      const margin = 20; // 20px generous hit boundary
      if (
        gaze.x >= rect.left - margin &&
        gaze.x <= rect.right + margin &&
        gaze.y >= rect.top - margin &&
        gaze.y <= rect.bottom + margin
      ) {
        // Calculate distance to center to find the single best match if multiple overlap
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.sqrt(Math.pow(gaze.x - centerX, 2) + Math.pow(gaze.y - centerY, 2));
        
        if (distance < minDistance) {
          minDistance = distance;
          bestHit = el.getAttribute('data-dwell');
        }
      }
    });

    const hit = bestHit;

    if (hit) {
      if (dwellTarget.current !== hit) {
        if (dwellTarget.current && onProgress) {
          onProgress(dwellTarget.current, 0); // Clear old target progress
        }
        dwellTarget.current = hit;
        dwellStart.current = Date.now();
        if (onProgress) onProgress(hit, 0);
      } else {
        const elapsed = Date.now() - dwellStart.current;
        const progress = Math.min(100, Math.floor((elapsed / dwellTime) * 100));
        
        if (onProgress) onProgress(hit, progress);

        if (elapsed >= dwellTime) {
          onDwell(hit);
          // Standard is to wait for move-away before re-triggering.
          dwellTarget.current = null;
          dwellStart.current = null;
          if (onProgress) onProgress(hit, 0);
        }
      }
    } else {
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
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [checkDwell]);
}

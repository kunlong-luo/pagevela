import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type RefObject } from 'react';
import { storage, STORAGE_KEYS } from '../lib/storage';

const DEFAULT_SPLIT_RATIO = 50;
const MIN_DRAG_RATIO = 28;
const MAX_DRAG_RATIO = 72;

/** Pure geometry mapping; percentages are bounded and the center snaps to 50%. */
export function ratioForPointer(clientX: number, left: number, width: number): number | null {
  if (!Number.isFinite(clientX) || !Number.isFinite(left) || !Number.isFinite(width) || width <= 0) {
    return null;
  }
  const rawRatio = ((clientX - left) / width) * 100;
  const clamped = Math.min(Math.max(rawRatio, MIN_DRAG_RATIO), MAX_DRAG_RATIO);
  return Math.abs(clamped - DEFAULT_SPLIT_RATIO) < 1.5 ? DEFAULT_SPLIT_RATIO : clamped;
}

/** Keep the complete pre-existing 25–75% preference range readable. */
export function readSavedSplitRatio(): number {
  const saved = storage.getString(STORAGE_KEYS.SPLIT_RATIO);
  if (saved) {
    const parsed = Number.parseFloat(saved);
    if (Number.isFinite(parsed) && parsed >= 25 && parsed <= 75) return parsed;
  }
  return DEFAULT_SPLIT_RATIO;
}

export function useResizableSplitPane(containerRef: RefObject<HTMLElement | null>) {
  const [splitRatio, setSplitRatio] = useState(readSavedSplitRatio);
  const [isDragging, setIsDragging] = useState(false);
  const latestRatioRef = useRef(splitRatio);

  const handleMouseDown = useCallback((event: ReactMouseEvent) => {
    if (event.button !== 0) return;
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleTouchStart = useCallback(() => setIsDragging(true), []);

  const resetSplitRatio = useCallback(() => {
    latestRatioRef.current = DEFAULT_SPLIT_RATIO;
    setSplitRatio(DEFAULT_SPLIT_RATIO);
    storage.set(STORAGE_KEYS.SPLIT_RATIO, String(DEFAULT_SPLIT_RATIO));
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    let frame: number | null = null;
    let pointerX: number | null = null;

    const applyPointer = () => {
      frame = null;
      if (pointerX === null || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const next = ratioForPointer(pointerX, rect.left, rect.width);
      if (next === null) return;
      latestRatioRef.current = next;
      setSplitRatio(next);
    };

    const move = (clientX: number) => {
      pointerX = clientX;
      if (frame === null) frame = window.requestAnimationFrame(applyPointer);
    };

    const onMouseMove = (event: MouseEvent) => move(event.clientX);
    const onTouchMove = (event: TouchEvent) => {
      if (event.touches[0]) move(event.touches[0].clientX);
    };
    const finish = () => {
      // A pointerup can precede the scheduled animation frame: commit the
      // last actual pointer location rather than a stale rendered ratio.
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
        frame = null;
      }
      if (pointerX !== null) applyPointer();
      storage.set(STORAGE_KEYS.SPLIT_RATIO, String(latestRatioRef.current));
      setIsDragging(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', finish);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', finish);
    window.addEventListener('touchcancel', finish);
    window.addEventListener('blur', finish);
    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', finish);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', finish);
      window.removeEventListener('touchcancel', finish);
      window.removeEventListener('blur', finish);
    };
  }, [isDragging, containerRef]);

  return { splitRatio, isDragging, handleMouseDown, handleTouchStart, resetSplitRatio };
}

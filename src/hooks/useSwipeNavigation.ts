import { useRef, useCallback, useState } from 'react';

interface SwipeConfig {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  threshold?: number;
  enabled?: boolean;
}

export function useSwipeNavigation({ onSwipeLeft, onSwipeRight, threshold = 50, enabled = true }: SwipeConfig) {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchCurrentX = useRef(0);
  const isSwiping = useRef(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enabled) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchCurrentX.current = e.touches[0].clientX;
    isSwiping.current = false;
    setIsAnimating(false);
  }, [enabled]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!enabled) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;

    // Only start swiping if horizontal movement dominates
    if (!isSwiping.current) {
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        isSwiping.current = true;
      } else if (Math.abs(dy) > 10) {
        return; // vertical scroll, ignore
      } else {
        return;
      }
    }

    if (isSwiping.current) {
      e.preventDefault();
      touchCurrentX.current = e.touches[0].clientX;
      const clampedDx = Math.max(-200, Math.min(200, dx));
      setSwipeOffset(clampedDx);
      setSwipeDirection(dx < 0 ? 'left' : 'right');
    }
  }, [enabled]);

  const onTouchEnd = useCallback(() => {
    if (!enabled || !isSwiping.current) {
      setSwipeOffset(0);
      setSwipeDirection(null);
      return;
    }

    const dx = touchCurrentX.current - touchStartX.current;

    if (Math.abs(dx) > threshold) {
      setIsAnimating(true);
      // Animate the fold to completion
      setSwipeOffset(dx < 0 ? -window.innerWidth : window.innerWidth);
      
      setTimeout(() => {
        if (dx < 0) onSwipeLeft();
        else onSwipeRight();
        setSwipeOffset(0);
        setSwipeDirection(null);
        setIsAnimating(false);
      }, 280);
    } else {
      // Snap back
      setIsAnimating(true);
      setSwipeOffset(0);
      setTimeout(() => {
        setSwipeDirection(null);
        setIsAnimating(false);
      }, 200);
    }

    isSwiping.current = false;
  }, [enabled, threshold, onSwipeLeft, onSwipeRight]);

  return {
    swipeHandlers: { onTouchStart, onTouchMove, onTouchEnd },
    swipeOffset,
    swipeDirection,
    isAnimating,
  };
}
